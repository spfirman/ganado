/**
 * Weighing Session Orchestrator
 *
 * Coordinates the complete weighing workflow:
 *   1. Animal enters chute → RFID reader captures EID tag
 *   2. EID lookup → identifies cattle in the system
 *   3. Scale captures weight → waits for stable reading
 *   4. Camera captures entry photo
 *   5. Record submitted to cloud (or offline queue)
 *   6. Camera captures exit photo
 *   7. State broadcast to all connected WebSocket clients
 */
import { EventEmitter } from 'events';
import { ScaleDriver, WeightReading } from '../drivers/scale-driver';
import { RfidDriver, TagRead } from '../drivers/rfid-driver';
import { CameraDriver } from '../drivers/camera-driver';
import { CloudSyncService, CattleLookup } from './cloud-sync';
import pino from 'pino';

const logger = pino({ name: 'weighing-session' });

export enum SessionPhase {
  IDLE = 'IDLE',                     // Waiting for animal
  TAG_READ = 'TAG_READ',             // RFID tag detected, looking up cattle
  CATTLE_IDENTIFIED = 'CATTLE_IDENTIFIED', // Cattle found in system
  WEIGHING = 'WEIGHING',             // Weight readings incoming
  STABLE = 'STABLE',                 // Stable weight achieved
  CAPTURING = 'CAPTURING',           // Capturing photos/video
  RECORDING = 'RECORDING',           // Submitting to cloud
  COMPLETE = 'COMPLETE',             // Weighing complete
  ERROR = 'ERROR',                   // Error state
}

export interface SessionState {
  phase: SessionPhase;
  currentEid: string | null;
  cattle: CattleLookup | null;
  currentWeight: WeightReading | null;
  stableWeight: WeightReading | null;
  entryPhoto: boolean;
  exitPhoto: boolean;
  cloudSynced: boolean;
  weighingId: string | null;
  queueId: number | null;
  error: string | null;
  timestamp: number;
}

export class WeighingSession extends EventEmitter {
  private state: SessionState;
  private autoRecord = true;
  private authToken: string | null = null;
  private sessionTimeout: NodeJS.Timeout | null = null;

  constructor(
    private readonly scale: ScaleDriver,
    private readonly rfid: RfidDriver,
    private readonly camera: CameraDriver | null,
    private readonly cloud: CloudSyncService,
  ) {
    super();
    this.state = this.initialState();
    this.setupListeners();
  }

  private initialState(): SessionState {
    return {
      phase: SessionPhase.IDLE,
      currentEid: null,
      cattle: null,
      currentWeight: null,
      stableWeight: null,
      entryPhoto: false,
      exitPhoto: false,
      cloudSynced: false,
      weighingId: null,
      queueId: null,
      error: null,
      timestamp: Date.now(),
    };
  }

  private setupListeners(): void {
    // RFID tag read → start session
    this.rfid.on('tag', async (tag: TagRead) => {
      if (this.state.phase !== SessionPhase.IDLE && this.state.phase !== SessionPhase.COMPLETE) {
        // If we're mid-session with a different tag, log a warning
        if (this.state.currentEid && this.state.currentEid !== tag.eid) {
          logger.warn({ current: this.state.currentEid, new: tag.eid }, 'New tag read while session active');
        }
        return;
      }

      this.resetSession();
      this.updateState({ phase: SessionPhase.TAG_READ, currentEid: tag.eid });

      // Look up cattle by EID
      try {
        const cattle = await this.cloud.lookupCattle(tag.eid, this.authToken || undefined);
        this.updateState({
          cattle,
          phase: cattle.found ? SessionPhase.CATTLE_IDENTIFIED : SessionPhase.TAG_READ,
        });

        if (!cattle.found) {
          logger.warn({ eid: tag.eid }, 'Unknown RFID tag - cattle not found');
        }
      } catch (err) {
        logger.error({ err, eid: tag.eid }, 'Cattle lookup failed');
        this.updateState({ phase: SessionPhase.TAG_READ });
      }

      // Start session timeout (auto-reset after 5 minutes)
      this.startTimeout(5 * 60 * 1000);
    });

    // Weight reading → update live weight
    this.scale.on('weight', (reading: WeightReading) => {
      if (this.state.phase === SessionPhase.IDLE) {
        // If we get weight before tag, still show it
        this.updateState({ currentWeight: reading });
        return;
      }

      this.updateState({
        currentWeight: reading,
        phase: this.state.phase === SessionPhase.TAG_READ ||
               this.state.phase === SessionPhase.CATTLE_IDENTIFIED
          ? SessionPhase.WEIGHING
          : this.state.phase,
      });
    });

    // Stable weight → trigger auto-record
    this.scale.on('stableWeight', async (reading: WeightReading) => {
      if (this.state.phase !== SessionPhase.WEIGHING &&
          this.state.phase !== SessionPhase.CATTLE_IDENTIFIED) {
        return;
      }

      this.updateState({
        stableWeight: reading,
        phase: SessionPhase.STABLE,
      });

      if (this.autoRecord) {
        await this.record();
      }
    });
  }

  /**
   * Manually trigger recording (or automatic on stable weight)
   */
  async record(): Promise<void> {
    if (!this.state.stableWeight && !this.state.currentWeight) {
      this.updateState({ phase: SessionPhase.ERROR, error: 'No weight reading available' });
      return;
    }

    const weight = this.state.stableWeight || this.state.currentWeight!;

    // Capture entry photo
    this.updateState({ phase: SessionPhase.CAPTURING });
    if (this.camera) {
      try {
        await this.camera.captureSnapshot();
        this.updateState({ entryPhoto: true });
      } catch (err) {
        logger.warn({ err }, 'Entry photo capture failed');
      }
    }

    // Submit weighing to cloud
    this.updateState({ phase: SessionPhase.RECORDING });

    const cattleId = this.state.cattle?.cattle?.id;
    if (!cattleId) {
      // No cattle identified - queue with EID only for manual matching later
      const payload = {
        eidTag: this.state.currentEid,
        grossWeightKg: weight.grossKg,
        netWeightKg: weight.netKg,
        tareKg: weight.tareKg,
        source: 'AUTOMATIC',
        stableAt: weight.timestamp.toISOString(),
        notes: `Auto-weigh: EID=${this.state.currentEid}, unmatched cattle`,
      };

      // Queue for offline - can't submit without cattleId
      const queueId = this.cloud['queue'].enqueue(payload);
      this.updateState({
        phase: SessionPhase.COMPLETE,
        queueId,
        error: 'Cattle not identified - record queued for manual matching',
      });
      return;
    }

    try {
      const result = await this.cloud.submitWeighing(
        {
          idCattle: cattleId,
          eidTag: this.state.currentEid,
          grossWeightKg: weight.grossKg,
          netWeightKg: weight.netKg,
          tareKg: weight.tareKg,
          source: 'AUTOMATIC',
          stableAt: weight.timestamp.toISOString(),
          notes: `Auto-weigh via bridge`,
        },
        this.authToken || undefined,
      );

      this.updateState({
        phase: SessionPhase.COMPLETE,
        cloudSynced: result.synced,
        weighingId: result.id || null,
        queueId: result.queueId || null,
      });

      // Upload entry photo if we have one and a weighing ID
      if (result.id && this.state.entryPhoto && this.camera) {
        try {
          const snapshot = await this.camera.captureSnapshot();
          await this.cloud.uploadMedia(result.id, snapshot.data, 'ENTRY_PHOTO', this.authToken || undefined);
        } catch (err) {
          logger.warn({ err }, 'Photo upload failed');
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      this.updateState({
        phase: SessionPhase.ERROR,
        error: `Cloud sync failed: ${msg}`,
      });
    }
  }

  /**
   * Manual trigger: tare the scale
   */
  tare(): void {
    this.scale.tare();
  }

  /**
   * Manual trigger: zero the scale
   */
  zero(): void {
    this.scale.zero();
  }

  /**
   * Reset session to idle
   */
  resetSession(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
    this.state = this.initialState();
    this.emit('stateChange', this.state);
  }

  /**
   * Set auto-record mode
   */
  setAutoRecord(auto: boolean): void {
    this.autoRecord = auto;
  }

  /**
   * Set auth token for API calls
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Get current session state
   */
  getState(): SessionState {
    return { ...this.state };
  }

  private updateState(patch: Partial<SessionState>): void {
    this.state = { ...this.state, ...patch, timestamp: Date.now() };
    this.emit('stateChange', this.state);
  }

  private startTimeout(ms: number): void {
    if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
    this.sessionTimeout = setTimeout(() => {
      if (this.state.phase !== SessionPhase.COMPLETE) {
        logger.warn('Session timeout - resetting');
        this.resetSession();
      }
    }, ms);
  }
}
