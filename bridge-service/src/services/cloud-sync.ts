/**
 * Cloud Sync Service
 *
 * Handles communication with the Ganado Cloud API:
 *   - POST /weighings → create weighing records
 *   - POST /bridge/sync → batch sync offline queue
 *   - GET /cattle/by-eid/:eid → look up cattle by RFID EID
 *   - POST /bridge/devices/:id/heartbeat → device heartbeat
 *   - POST /weighings/:id/media → upload photos/videos
 */
import axios, { AxiosInstance, AxiosError } from 'axios';
import { OfflineQueue } from '../queue/offline-queue';
import pino from 'pino';

const logger = pino({ name: 'cloud-sync' });

export interface CloudConfig {
  apiUrl: string;
  deviceId: string;
  apiKey: string;
  syncIntervalMs: number;
}

export interface CattleLookup {
  found: boolean;
  eid: string;
  cattle?: {
    id: string;
    number: string;
    eartagLeft?: string;
    lastWeight?: number;
    [key: string]: unknown;
  };
}

export class CloudSyncService {
  private client: AxiosInstance;
  private syncTimer: NodeJS.Timeout | null = null;
  private online = false;

  constructor(
    private readonly cfg: CloudConfig,
    private readonly queue: OfflineQueue,
  ) {
    this.client = axios.create({
      baseURL: cfg.apiUrl,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Start periodic heartbeat and queue sync
   */
  start(): void {
    // Immediate heartbeat
    this.heartbeat().catch(() => {});

    // Periodic sync
    this.syncTimer = setInterval(() => {
      this.heartbeat().catch(() => {});
      this.syncQueue().catch(() => {});
      this.queue.cleanup();
    }, this.cfg.syncIntervalMs);

    logger.info({ intervalMs: this.cfg.syncIntervalMs }, 'Cloud sync started');
  }

  stop(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * Send heartbeat to cloud API
   */
  async heartbeat(): Promise<boolean> {
    try {
      const response = await this.client.post(
        `/bridge/devices/${this.cfg.deviceId}/heartbeat`,
        {},
        { params: { apiKey: this.cfg.apiKey } },
      );
      this.online = true;
      logger.debug({ pollIntervalMs: response.data?.pollIntervalMs }, 'Heartbeat OK');
      return true;
    } catch (err) {
      this.online = false;
      logger.warn('Heartbeat failed - cloud API unreachable');
      return false;
    }
  }

  /**
   * Submit a weighing record to the cloud.
   * If the API is unreachable, queue it for later sync.
   */
  async submitWeighing(
    record: Record<string, unknown>,
    authToken?: string,
  ): Promise<{ synced: boolean; id?: string; queueId?: number }> {
    try {
      const headers: Record<string, string> = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await this.client.post('/weighings', record, { headers });
      logger.info({ id: response.data.id }, 'Weighing synced to cloud');
      return { synced: true, id: response.data.id };
    } catch (err) {
      const axiosErr = err as AxiosError;

      // If it's a validation error (4xx), don't queue - report error
      if (axiosErr.response && axiosErr.response.status >= 400 && axiosErr.response.status < 500) {
        logger.error({ status: axiosErr.response.status, data: axiosErr.response.data }, 'Cloud API rejected weighing');
        throw err;
      }

      // Network/server error - queue for offline sync
      const queueId = this.queue.enqueue(record);
      logger.warn({ queueId }, 'Cloud unreachable, weighing queued for offline sync');
      return { synced: false, queueId };
    }
  }

  /**
   * Look up cattle by RFID EID tag
   */
  async lookupCattle(eid: string, authToken?: string): Promise<CattleLookup> {
    try {
      const headers: Record<string, string> = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await this.client.get(`/cattle/by-eid/${eid}`, { headers });
      return response.data;
    } catch (err) {
      logger.warn({ eid }, 'Cattle lookup failed');
      return { found: false, eid };
    }
  }

  /**
   * Sync pending records from the offline queue
   */
  async syncQueue(): Promise<{ synced: number; failed: number }> {
    const pending = this.queue.getPending(20);
    if (pending.length === 0) return { synced: 0, failed: 0 };

    logger.info({ pending: pending.length }, 'Syncing offline queue...');

    let synced = 0;
    let failed = 0;

    // Batch sync if > 1 record
    if (pending.length > 1) {
      try {
        const records = pending.map(r => JSON.parse(r.payload));
        const response = await this.client.post('/bridge/sync', { records }, {
          params: { apiKey: this.cfg.apiKey },
        });

        const results = response.data.results || [];
        for (let i = 0; i < results.length; i++) {
          if (results[i].success) {
            this.queue.markSynced(pending[i].id);
            synced++;
          } else {
            this.queue.markFailed(pending[i].id, results[i].error || 'Unknown error');
            failed++;
          }
        }
      } catch (err) {
        logger.error({ err }, 'Batch sync failed');
        failed = pending.length;
      }
    } else {
      // Single record sync
      const record = pending[0];
      try {
        const payload = JSON.parse(record.payload);
        await this.client.post('/weighings', payload);
        this.queue.markSynced(record.id);
        synced = 1;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        this.queue.markFailed(record.id, msg);
        failed = 1;
      }
    }

    logger.info({ synced, failed }, 'Queue sync complete');
    return { synced, failed };
  }

  /**
   * Upload media (snapshot) to a weighing record
   */
  async uploadMedia(
    weighingId: string,
    imageData: Buffer,
    type: string = 'ENTRY_PHOTO',
    authToken?: string,
  ): Promise<boolean> {
    try {
      const FormData = (await import('form-data')).default;
      const form = new FormData();
      form.append('file', imageData, {
        filename: `${type.toLowerCase()}_${Date.now()}.jpg`,
        contentType: 'image/jpeg',
      });
      form.append('type', type);

      const headers: Record<string, string> = {
        ...form.getHeaders(),
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      await this.client.post(`/weighings/${weighingId}/media`, form, { headers });
      logger.info({ weighingId, type }, 'Media uploaded');
      return true;
    } catch (err) {
      logger.error({ err, weighingId }, 'Media upload failed');
      return false;
    }
  }

  isOnline(): boolean {
    return this.online;
  }

  getQueueStats() {
    return this.queue.stats();
  }
}
