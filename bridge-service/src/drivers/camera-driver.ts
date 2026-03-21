/**
 * UniFi Protect Camera Driver
 *
 * Captures snapshots from UniFi Protect cameras via the local API.
 * Used to take entry/exit photos during weighing events.
 *
 * UniFi Protect API (local, v2):
 *   POST /api/auth/login → get auth cookie
 *   GET  /proxy/protect/api/cameras/:id/snapshot → JPEG snapshot
 */
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import pino from 'pino';

const logger = pino({ name: 'camera-driver' });

export interface CameraConfig {
  host: string;
  username: string;
  password: string;
  cameraId: string;
}

export interface Snapshot {
  data: Buffer;
  contentType: string;
  timestamp: Date;
  cameraId: string;
}

export class CameraDriver {
  private client: AxiosInstance;
  private authCookie: string | null = null;
  private authExpiry = 0;
  private connected = false;

  constructor(private readonly cfg: CameraConfig) {
    this.client = axios.create({
      baseURL: `https://${cfg.host}`,
      timeout: 10000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Self-signed cert
    });
  }

  async connect(): Promise<void> {
    try {
      await this.authenticate();
      this.connected = true;
      logger.info(`Connected to UniFi Protect at ${this.cfg.host}`);
    } catch (err) {
      logger.error({ err }, 'Failed to connect to UniFi Protect');
      throw err;
    }
  }

  private async authenticate(): Promise<void> {
    const response = await this.client.post('/api/auth/login', {
      username: this.cfg.username,
      password: this.cfg.password,
    });

    const cookies = response.headers['set-cookie'];
    if (cookies) {
      this.authCookie = cookies
        .map((c: string) => c.split(';')[0])
        .join('; ');
      // Token valid for ~12 hours typically
      this.authExpiry = Date.now() + 10 * 60 * 60 * 1000;
    }
  }

  private async ensureAuth(): Promise<void> {
    if (!this.authCookie || Date.now() > this.authExpiry) {
      await this.authenticate();
    }
  }

  /**
   * Capture a JPEG snapshot from the configured camera
   */
  async captureSnapshot(): Promise<Snapshot> {
    await this.ensureAuth();

    try {
      const response = await this.client.get(
        `/proxy/protect/api/cameras/${this.cfg.cameraId}/snapshot`,
        {
          responseType: 'arraybuffer',
          headers: {
            Cookie: this.authCookie || '',
          },
          params: {
            ts: Date.now(),
            force: true,
          },
        },
      );

      const snapshot: Snapshot = {
        data: Buffer.from(response.data),
        contentType: response.headers['content-type'] || 'image/jpeg',
        timestamp: new Date(),
        cameraId: this.cfg.cameraId,
      };

      logger.info({ size: snapshot.data.length, cameraId: this.cfg.cameraId }, 'Snapshot captured');
      return snapshot;
    } catch (err) {
      logger.error({ err }, 'Failed to capture snapshot');
      throw err;
    }
  }

  /**
   * Capture a short video clip (if supported by UniFi Protect version)
   */
  async captureClip(durationSec: number = 5): Promise<Buffer | null> {
    await this.ensureAuth();

    const endTs = Date.now();
    const startTs = endTs - durationSec * 1000;

    try {
      const response = await this.client.get(
        `/proxy/protect/api/video/export`,
        {
          responseType: 'arraybuffer',
          headers: {
            Cookie: this.authCookie || '',
          },
          params: {
            camera: this.cfg.cameraId,
            start: startTs,
            end: endTs,
          },
        },
      );

      logger.info({ size: response.data.length }, 'Video clip captured');
      return Buffer.from(response.data);
    } catch (err) {
      logger.warn({ err }, 'Video clip capture not supported or failed');
      return null;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  disconnect(): void {
    this.connected = false;
    this.authCookie = null;
  }
}
