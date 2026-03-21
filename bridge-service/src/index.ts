/**
 * Ganado Bridge Service
 *
 * Standalone Node.js application that runs on the farm PC.
 * Connects hardware devices (RFID, Scale, Camera) to the Ganado Cloud API.
 *
 * Architecture:
 *   ┌─────────────┐   ┌───────────────┐   ┌─────────────────┐
 *   │ RFID Reader  │──→│               │──→│ Ganado Cloud API │
 *   │ (Serial/TCP) │   │  Bridge Core  │   │ (POST /weighings)│
 *   ├─────────────┤   │               │   └─────────────────┘
 *   │ Rice Lake    │──→│  Weighing     │          ↕
 *   │ 920i Scale   │   │  Session      │   ┌─────────────────┐
 *   ├─────────────┤   │  Orchestrator  │   │ SQLite Offline   │
 *   │ UniFi Camera │──→│               │   │ Queue            │
 *   └─────────────┘   │               │   └─────────────────┘
 *                      │               │
 *                      │  WebSocket    │──→ Flutter/Browser UI
 *                      │  :8765        │   (localhost:8765)
 *                      └───────────────┘
 */
import { config } from './config/env';
import { ScaleDriver } from './drivers/scale-driver';
import { RfidDriver } from './drivers/rfid-driver';
import { CameraDriver } from './drivers/camera-driver';
import { OfflineQueue } from './queue/offline-queue';
import { CloudSyncService } from './services/cloud-sync';
import { WeighingSession, SessionPhase } from './services/weighing-session';
import { BridgeWebSocketServer } from './services/ws-server';
import pino from 'pino';

const logger = pino({
  name: 'bridge-service',
  level: config.logLevel,
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

async function main() {
  logger.info('🐂 Ganado Bridge Service starting...');
  logger.info({ cloudApi: config.cloudApiUrl, deviceId: config.deviceId });

  // ── Initialize components ─────────────────────────────────

  // 1. Offline queue (always available)
  const queue = new OfflineQueue(config.queueDbPath);
  logger.info({ path: config.queueDbPath, stats: queue.stats() }, 'Offline queue ready');

  // 2. Cloud sync service
  const cloud = new CloudSyncService(
    {
      apiUrl: config.cloudApiUrl,
      deviceId: config.deviceId,
      apiKey: config.deviceApiKey,
      syncIntervalMs: config.syncIntervalMs,
    },
    queue,
  );

  // 3. Scale driver
  const scale = new ScaleDriver(config.scale);

  // 4. RFID driver
  const rfid = new RfidDriver(config.rfid);

  // 5. Camera driver (optional)
  let camera: CameraDriver | null = null;
  if (config.unifi.cameraId && config.unifi.password) {
    camera = new CameraDriver(config.unifi);
  }

  // 6. Weighing session orchestrator
  const session = new WeighingSession(scale, rfid, camera, cloud);

  // 7. WebSocket server
  const wsServer = new BridgeWebSocketServer(config.wsPort, {
    onTare: () => session.tare(),
    onZero: () => session.zero(),
    onRecord: () => session.record(),
    onReset: () => session.resetSession(),
    onSetAutoRecord: (v) => session.setAutoRecord(v),
    onSetAuthToken: (t) => session.setAuthToken(t),
  });

  // ── Wire up event broadcasting ────────────────────────────

  // Broadcast session state changes to all WS clients
  session.on('stateChange', (state) => {
    wsServer.broadcast('state', state);
  });

  // Broadcast live weight readings
  scale.on('weight', (reading) => {
    wsServer.broadcast('weight', reading);
  });

  // Broadcast RFID tag reads
  rfid.on('tag', (tag) => {
    wsServer.broadcast('tag', tag);
  });

  // Broadcast device status changes
  const broadcastDeviceStatus = () => {
    wsServer.broadcast('device_status', {
      scale: scale.isConnected() ? 'ONLINE' : 'OFFLINE',
      rfid: rfid.isConnected() ? 'ONLINE' : 'OFFLINE',
      camera: camera?.isConnected() ? 'ONLINE' : 'OFFLINE',
      cloud: cloud.isOnline() ? 'ONLINE' : 'OFFLINE',
    });
  };

  scale.on('connected', broadcastDeviceStatus);
  scale.on('disconnected', broadcastDeviceStatus);
  rfid.on('connected', broadcastDeviceStatus);
  rfid.on('disconnected', broadcastDeviceStatus);

  // When a new WS client connects, send current state
  wsServer.on('clientConnected', () => {
    wsServer.broadcast('state', session.getState());
    broadcastDeviceStatus();
    wsServer.broadcast('queue_stats', cloud.getQueueStats());
  });

  // Periodic queue stats broadcast
  setInterval(() => {
    wsServer.broadcast('queue_stats', cloud.getQueueStats());
  }, 10000);

  // ── Start services ────────────────────────────────────────

  // Start WebSocket server (always starts)
  wsServer.start();

  // Start cloud sync (heartbeat + queue drain)
  cloud.start();

  // Connect to hardware (non-blocking, retries on failure)
  connectHardware(scale, rfid, camera);

  // ── Graceful shutdown ─────────────────────────────────────
  const shutdown = async () => {
    logger.info('Shutting down bridge service...');
    cloud.stop();
    wsServer.stop();
    scale.disconnect();
    rfid.disconnect();
    camera?.disconnect();
    queue.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  logger.info(`✅ Bridge service running (WS: ws://localhost:${config.wsPort})`);
}

async function connectHardware(
  scale: ScaleDriver,
  rfid: RfidDriver,
  camera: CameraDriver | null,
) {
  const logger2 = pino({ name: 'hardware-init' });

  // Scale
  try {
    await scale.connect();
  } catch (err) {
    logger2.warn({ err }, 'Scale connection failed (will retry automatically)');
  }

  // RFID
  try {
    await rfid.connect();
  } catch (err) {
    logger2.warn({ err }, 'RFID reader connection failed (will retry automatically)');
  }

  // Camera
  if (camera) {
    try {
      await camera.connect();
    } catch (err) {
      logger2.warn({ err }, 'Camera connection failed (snapshots will be skipped)');
    }
  }
}

main().catch((err) => {
  logger.fatal({ err }, 'Bridge service failed to start');
  process.exit(1);
});
