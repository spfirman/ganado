import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  // Cloud API
  cloudApiUrl: process.env.CLOUD_API_URL || 'http://localhost:3000/api/v1',
  deviceId: process.env.DEVICE_ID || '',
  deviceApiKey: process.env.DEVICE_API_KEY || '',

  // Scale (Rice Lake 920i)
  scale: {
    host: process.env.SCALE_HOST || '192.168.1.200',
    port: parseInt(process.env.SCALE_PORT || '10001', 10),
    protocol: (process.env.SCALE_PROTOCOL || 'tcp') as 'tcp' | 'serial',
    serialPort: process.env.SCALE_SERIAL_PORT || '/dev/ttyUSB0',
    baudRate: parseInt(process.env.SCALE_BAUD_RATE || '9600', 10),
    // 920i stable weight detection
    stableThresholdKg: parseFloat(process.env.SCALE_STABLE_THRESHOLD || '0.5'),
    stableReadingsRequired: parseInt(process.env.SCALE_STABLE_READINGS || '3', 10),
    pollIntervalMs: parseInt(process.env.SCALE_POLL_MS || '500', 10),
  },

  // RFID Reader
  rfid: {
    serialPort: process.env.RFID_SERIAL_PORT || '/dev/ttyUSB1',
    baudRate: parseInt(process.env.RFID_BAUD_RATE || '57600', 10),
    protocol: (process.env.RFID_PROTOCOL || 'serial') as 'tcp' | 'serial',
    tcpHost: process.env.RFID_TCP_HOST || '192.168.1.201',
    tcpPort: parseInt(process.env.RFID_TCP_PORT || '4001', 10),
  },

  // UniFi Protect
  unifi: {
    host: process.env.UNIFI_HOST || '192.168.1.1',
    username: process.env.UNIFI_USERNAME || 'admin',
    password: process.env.UNIFI_PASSWORD || '',
    cameraId: process.env.UNIFI_CAMERA_ID || '',
  },

  // WebSocket
  wsPort: parseInt(process.env.WS_PORT || '8765', 10),

  // Offline Queue
  queueDbPath: process.env.QUEUE_DB_PATH || './data/offline-queue.sqlite',
  syncIntervalMs: parseInt(process.env.SYNC_INTERVAL_MS || '30000', 10),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};
