/**
 * RFID Reader Driver
 *
 * Supports both serial (USB) and TCP connections to RFID panel readers.
 * Parses ISO 11784/11785 EID tags (15-digit FDX-B transponders).
 *
 * Common reader protocols:
 *   - Most livestock RFID readers send tag reads as newline-terminated strings
 *   - Format varies: raw hex, decimal FDX-B, or proprietary frames
 *   - This driver normalizes to 15-digit decimal EID
 */
import * as net from 'net';
import { EventEmitter } from 'events';
import pino from 'pino';

const logger = pino({ name: 'rfid-driver' });

export interface TagRead {
  eid: string;           // 15-digit ISO 11784/11785 EID
  rssi?: number;         // Signal strength (if available)
  timestamp: Date;
  raw: string;
  readerType: string;
}

export interface RfidConfig {
  protocol: 'tcp' | 'serial';
  serialPort: string;
  baudRate: number;
  tcpHost: string;
  tcpPort: number;
}

export class RfidDriver extends EventEmitter {
  private socket: net.Socket | null = null;
  private connected = false;
  private buffer = '';
  private reconnectTimer: NodeJS.Timeout | null = null;
  private lastTag: string | null = null;
  private lastTagTime = 0;
  private debounceMs = 2000; // Ignore same tag within 2s

  constructor(private readonly cfg: RfidConfig) {
    super();
  }

  async connect(): Promise<void> {
    if (this.cfg.protocol === 'serial') {
      await this.connectSerial();
    } else {
      await this.connectTcp();
    }
  }

  private connectTcp(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new net.Socket();

      this.socket.on('connect', () => {
        this.connected = true;
        logger.info(`Connected to RFID reader at ${this.cfg.tcpHost}:${this.cfg.tcpPort}`);
        this.emit('connected');
        resolve();
      });

      this.socket.on('data', (data: Buffer) => {
        this.buffer += data.toString('ascii');
        this.processBuffer();
      });

      this.socket.on('error', (err: Error) => {
        logger.error({ err }, 'RFID reader connection error');
        this.emit('deviceError', err);
        if (!this.connected) reject(err);
      });

      this.socket.on('close', () => {
        this.connected = false;
        logger.warn('RFID reader connection closed');
        this.emit('disconnected');
        this.scheduleReconnect();
      });

      this.socket.connect(this.cfg.tcpPort, this.cfg.tcpHost);
    });
  }

  private async connectSerial(): Promise<void> {
    try {
      const { SerialPort } = await import('serialport');
      const port = new SerialPort({
        path: this.cfg.serialPort,
        baudRate: this.cfg.baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
      });

      port.on('open', () => {
        this.connected = true;
        logger.info(`Serial connected to RFID reader on ${this.cfg.serialPort}`);
        this.emit('connected');
      });

      port.on('data', (data: Buffer) => {
        this.buffer += data.toString('ascii');
        this.processBuffer();
      });

      port.on('error', (err: Error) => {
        logger.error({ err }, 'RFID serial error');
        this.emit('deviceError', err);
      });

      port.on('close', () => {
        this.connected = false;
        this.emit('disconnected');
        this.scheduleReconnect();
      });

      this.socket = {
        write: (data: string | Buffer) => port.write(data),
        destroy: () => port.close(),
      } as any;
    } catch (err) {
      logger.error({ err }, 'Failed to initialize RFID serial port');
      throw err;
    }
  }

  private processBuffer(): void {
    const lines = this.buffer.split(/\r?\n/);
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      this.parseTagRead(trimmed);
    }
  }

  /**
   * Parse tag data from various reader formats:
   *   - Plain 15-digit decimal: "982000123456789"
   *   - Hex FDX-B: "00 07 5B CD 15 00 01" (country + national ID)
   *   - Prefixed: "TAG:982000123456789"
   *   - With RSSI: "982000123456789,-45"
   *   - Allflex/Gallagher: "*982000123456789*"
   */
  private parseTagRead(raw: string): void {
    let eid: string | null = null;
    let rssi: number | undefined;

    // Format 1: Plain 15-digit number
    const plain15 = raw.match(/^(\d{15})$/);
    if (plain15) {
      eid = plain15[1];
    }

    // Format 2: 15 digits anywhere in string
    if (!eid) {
      const embedded = raw.match(/(\d{15})/);
      if (embedded) {
        eid = embedded[1];
      }
    }

    // Format 3: Hex FDX-B (7 bytes = country code + national ID)
    if (!eid) {
      const hex = raw.replace(/[\s:,-]/g, '');
      if (/^[0-9A-Fa-f]{14}$/.test(hex)) {
        // Convert FDX-B hex to decimal EID
        const countryCode = parseInt(hex.substring(0, 4), 16);
        const nationalId = parseInt(hex.substring(4), 16);
        eid = `${countryCode}${nationalId.toString().padStart(12, '0')}`.substring(0, 15);
      }
    }

    // Format 4: With RSSI suffix
    if (!eid) {
      const withRssi = raw.match(/(\d{15})[,;]\s*(-?\d+)/);
      if (withRssi) {
        eid = withRssi[1];
        rssi = parseInt(withRssi[2], 10);
      }
    }

    if (!eid) {
      logger.debug({ raw }, 'Could not parse RFID tag from response');
      return;
    }

    // Debounce: ignore same tag within window
    const now = Date.now();
    if (eid === this.lastTag && now - this.lastTagTime < this.debounceMs) {
      return;
    }
    this.lastTag = eid;
    this.lastTagTime = now;

    const tagRead: TagRead = {
      eid,
      rssi,
      timestamp: new Date(),
      raw,
      readerType: this.cfg.protocol,
    };

    logger.info({ eid }, 'RFID tag read');
    this.emit('tag', tagRead);
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      logger.info('Attempting RFID reader reconnection...');
      try {
        await this.connect();
      } catch (err) {
        logger.error({ err }, 'RFID reconnection failed');
        this.scheduleReconnect();
      }
    }, 5000);
  }

  isConnected(): boolean {
    return this.connected;
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
    this.connected = false;
  }
}
