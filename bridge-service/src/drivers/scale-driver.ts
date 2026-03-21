/**
 * Rice Lake 920i Scale Driver
 *
 * Communicates with Rice Lake 920i indicator via TCP socket.
 * The 920i supports multiple protocols; this driver uses the
 * "Continuous Print" / demand mode over TCP port 10001.
 *
 * Protocol reference:
 *   - Command "W\r\n" → requests current weight
 *   - Response format: "ST,GS,    450.5,kg\r\n" or "ST,NT,    445.0,kg\r\n"
 *     where ST = stable, US = unstable, GS = gross, NT = net
 *   - Tare command: "T\r\n"
 *   - Zero command: "Z\r\n"
 */
import * as net from 'net';
import { EventEmitter } from 'events';
import pino from 'pino';

const logger = pino({ name: 'scale-driver' });

export interface WeightReading {
  grossKg: number;
  netKg: number | null;
  tareKg: number | null;
  stable: boolean;
  timestamp: Date;
  raw: string;
}

export interface ScaleConfig {
  host: string;
  port: number;
  protocol: 'tcp' | 'serial';
  serialPort?: string;
  baudRate?: number;
  stableThresholdKg: number;
  stableReadingsRequired: number;
  pollIntervalMs: number;
}

export class ScaleDriver extends EventEmitter {
  private socket: net.Socket | null = null;
  private connected = false;
  private pollTimer: NodeJS.Timeout | null = null;
  private buffer = '';
  private lastWeight: number | null = null;
  private stableCount = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(private readonly cfg: ScaleConfig) {
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
        logger.info(`Connected to scale at ${this.cfg.host}:${this.cfg.port}`);
        this.emit('connected');
        this.startPolling();
        resolve();
      });

      this.socket.on('data', (data: Buffer) => {
        this.buffer += data.toString('ascii');
        this.processBuffer();
      });

      this.socket.on('error', (err: Error) => {
        logger.error({ err }, 'Scale connection error');
        this.emit('deviceError', err);
        if (!this.connected) reject(err);
      });

      this.socket.on('close', () => {
        this.connected = false;
        this.stopPolling();
        logger.warn('Scale connection closed, will reconnect...');
        this.emit('disconnected');
        this.scheduleReconnect();
      });

      this.socket.connect(this.cfg.port, this.cfg.host);
    });
  }

  private async connectSerial(): Promise<void> {
    // Dynamic import for serialport (only needed if protocol is serial)
    try {
      const { SerialPort } = await import('serialport');
      const port = new SerialPort({
        path: this.cfg.serialPort || '/dev/ttyUSB0',
        baudRate: this.cfg.baudRate || 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
      });

      port.on('open', () => {
        this.connected = true;
        logger.info(`Serial connected to scale on ${this.cfg.serialPort}`);
        this.emit('connected');
        this.startPolling();
      });

      port.on('data', (data: Buffer) => {
        this.buffer += data.toString('ascii');
        this.processBuffer();
      });

      port.on('error', (err: Error) => {
        logger.error({ err }, 'Scale serial error');
        this.emit('deviceError', err);
      });

      port.on('close', () => {
        this.connected = false;
        this.stopPolling();
        this.emit('disconnected');
        this.scheduleReconnect();
      });

      // Wrap serial port as socket-like for write()
      this.socket = {
        write: (data: string | Buffer) => port.write(data),
        destroy: () => port.close(),
      } as any;
    } catch (err) {
      logger.error({ err }, 'Failed to initialize serial port (is serialport package installed?)');
      throw err;
    }
  }

  private processBuffer(): void {
    // Rice Lake 920i sends line-terminated responses
    const lines = this.buffer.split(/\r?\n/);
    this.buffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      this.parseWeightResponse(trimmed);
    }
  }

  /**
   * Parse Rice Lake 920i weight response
   * Formats:
   *   "ST,GS,    450.5,kg"  → Stable, Gross, 450.5 kg
   *   "ST,NT,    445.0,kg"  → Stable, Net, 445.0 kg
   *   "US,GS,    449.8,kg"  → Unstable, Gross, 449.8 kg
   *   "OL"                  → Overload
   *   "UL"                  → Under load
   *   Simple format: "   450.5 kg" (some configurations)
   */
  private parseWeightResponse(raw: string): void {
    let grossKg = 0;
    let netKg: number | null = null;
    let tareKg: number | null = null;
    let stable = false;

    // Try structured format: ST,GS,   450.5,kg
    const structured = raw.match(/^(ST|US),(GS|NT),\s*([\d.-]+),\s*(\w+)/);
    if (structured) {
      stable = structured[1] === 'ST';
      const weightType = structured[2]; // GS or NT
      const value = parseFloat(structured[3]);

      if (weightType === 'GS') {
        grossKg = value;
      } else {
        netKg = value;
      }
    } else {
      // Try simple format: "   450.5 kg" or just a number
      const simple = raw.match(/^\s*([\d.-]+)\s*(kg|lb)?/i);
      if (simple) {
        grossKg = parseFloat(simple[1]);
        stable = true; // Assume stable in simple mode
      } else if (raw === 'OL' || raw === 'UL') {
        logger.warn(`Scale ${raw === 'OL' ? 'overload' : 'underload'}`);
        this.emit('scaleAlert', raw);
        return;
      } else {
        logger.debug({ raw }, 'Unrecognized scale response');
        return;
      }
    }

    // Detect stability based on consecutive similar readings
    if (this.lastWeight !== null) {
      const diff = Math.abs(grossKg - this.lastWeight);
      if (diff <= this.cfg.stableThresholdKg) {
        this.stableCount++;
      } else {
        this.stableCount = 0;
      }
    }
    this.lastWeight = grossKg;

    const isStable = stable || this.stableCount >= this.cfg.stableReadingsRequired;

    const reading: WeightReading = {
      grossKg,
      netKg,
      tareKg,
      stable: isStable,
      timestamp: new Date(),
      raw,
    };

    this.emit('weight', reading);

    if (isStable && this.stableCount === this.cfg.stableReadingsRequired) {
      this.emit('stableWeight', reading);
    }
  }

  private startPolling(): void {
    this.pollTimer = setInterval(() => {
      this.requestWeight();
    }, this.cfg.pollIntervalMs);
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      logger.info('Attempting scale reconnection...');
      try {
        await this.connect();
      } catch (err) {
        logger.error({ err }, 'Reconnection failed');
        this.scheduleReconnect();
      }
    }, 5000);
  }

  /** Send weight request command to 920i */
  requestWeight(): void {
    if (this.connected && this.socket) {
      this.socket.write('W\r\n');
    }
  }

  /** Send tare command */
  tare(): void {
    if (this.connected && this.socket) {
      this.socket.write('T\r\n');
      logger.info('Tare command sent');
      this.emit('tare');
    }
  }

  /** Send zero command */
  zero(): void {
    if (this.connected && this.socket) {
      this.socket.write('Z\r\n');
      logger.info('Zero command sent');
      this.emit('zero');
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  disconnect(): void {
    this.stopPolling();
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
