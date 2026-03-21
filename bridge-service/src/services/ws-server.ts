/**
 * WebSocket Server
 *
 * Exposes real-time bridge state on localhost:8765
 * Used by the Flutter web/mobile app to display:
 *   - Live weight readings
 *   - RFID tag detection
 *   - Session state transitions
 *   - Camera snapshots
 *   - Device status
 *
 * Protocol:
 *   Server → Client messages (JSON):
 *     { type: "state", data: SessionState }
 *     { type: "weight", data: WeightReading }
 *     { type: "tag", data: TagRead }
 *     { type: "device_status", data: { scale, rfid, camera, cloud } }
 *     { type: "queue_stats", data: { pending, synced, failed } }
 *
 *   Client → Server messages (JSON):
 *     { action: "tare" }
 *     { action: "zero" }
 *     { action: "record" }
 *     { action: "reset" }
 *     { action: "set_auto_record", value: boolean }
 *     { action: "set_auth_token", value: string }
 */
import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import pino from 'pino';

const logger = pino({ name: 'ws-server' });

export interface WsServerCallbacks {
  onTare: () => void;
  onZero: () => void;
  onRecord: () => Promise<void>;
  onReset: () => void;
  onSetAutoRecord: (value: boolean) => void;
  onSetAuthToken: (token: string) => void;
}

export class BridgeWebSocketServer extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private clients = new Set<WebSocket>();

  constructor(
    private readonly port: number,
    private readonly callbacks: WsServerCallbacks,
  ) {
    super();
  }

  start(): void {
    this.wss = new WebSocketServer({
      port: this.port,
      host: '0.0.0.0', // Allow connections from any interface (for Flutter app)
    });

    this.wss.on('listening', () => {
      logger.info({ port: this.port }, 'WebSocket server started');
    });

    this.wss.on('connection', (ws: WebSocket, req) => {
      const clientIp = req.socket.remoteAddress;
      logger.info({ clientIp }, 'WebSocket client connected');
      this.clients.add(ws);

      ws.on('message', (raw: Buffer) => {
        try {
          const msg = JSON.parse(raw.toString());
          this.handleClientMessage(msg, ws);
        } catch (err) {
          logger.warn({ err }, 'Invalid WebSocket message');
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
        logger.info({ clientIp }, 'WebSocket client disconnected');
      });

      ws.on('error', (err) => {
        logger.error({ err, clientIp }, 'WebSocket client error');
        this.clients.delete(ws);
      });

      // Send initial state request
      this.emit('clientConnected');
    });

    this.wss.on('error', (err) => {
      logger.error({ err }, 'WebSocket server error');
    });
  }

  private handleClientMessage(msg: any, ws: WebSocket): void {
    switch (msg.action) {
      case 'tare':
        this.callbacks.onTare();
        break;
      case 'zero':
        this.callbacks.onZero();
        break;
      case 'record':
        this.callbacks.onRecord().catch(err => {
          ws.send(JSON.stringify({ type: 'error', message: err.message }));
        });
        break;
      case 'reset':
        this.callbacks.onReset();
        break;
      case 'set_auto_record':
        this.callbacks.onSetAutoRecord(!!msg.value);
        break;
      case 'set_auth_token':
        if (typeof msg.value === 'string') {
          this.callbacks.onSetAuthToken(msg.value);
        }
        break;
      default:
        logger.warn({ action: msg.action }, 'Unknown WebSocket action');
    }
  }

  /**
   * Broadcast a message to all connected clients
   */
  broadcast(type: string, data: unknown): void {
    const message = JSON.stringify({ type, data, ts: Date.now() });
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  /**
   * Get number of connected clients
   */
  getClientCount(): number {
    return this.clients.size;
  }

  stop(): void {
    if (this.wss) {
      for (const client of this.clients) {
        client.close();
      }
      this.clients.clear();
      this.wss.close();
      this.wss = null;
    }
  }
}
