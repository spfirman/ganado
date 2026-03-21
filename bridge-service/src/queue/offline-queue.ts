/**
 * SQLite-backed Offline Queue
 *
 * Stores weighing records locally when the cloud API is unreachable.
 * Automatically syncs when connectivity is restored.
 */
import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import pino from 'pino';

const logger = pino({ name: 'offline-queue' });

export interface QueuedRecord {
  id: number;
  payload: string; // JSON serialized CreateWeighingDto
  createdAt: string;
  attempts: number;
  lastError: string | null;
  status: 'pending' | 'synced' | 'failed';
}

export class OfflineQueue {
  private db: Database.Database;

  constructor(dbPath: string) {
    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('busy_timeout = 5000');
    this.initSchema();
  }

  private initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        attempts INTEGER NOT NULL DEFAULT 0,
        last_error TEXT,
        status TEXT NOT NULL DEFAULT 'pending'
      );
      CREATE INDEX IF NOT EXISTS idx_queue_status ON queue(status);
    `);
    logger.info('Offline queue initialized');
  }

  /**
   * Enqueue a weighing record for later sync
   */
  enqueue(payload: Record<string, unknown>): number {
    const stmt = this.db.prepare(
      'INSERT INTO queue (payload) VALUES (?)',
    );
    const result = stmt.run(JSON.stringify(payload));
    const id = result.lastInsertRowid as number;
    logger.info({ id }, 'Record queued for offline sync');
    return id;
  }

  /**
   * Get all pending records for sync
   */
  getPending(limit: number = 50): QueuedRecord[] {
    const stmt = this.db.prepare(
      'SELECT id, payload, created_at as createdAt, attempts, last_error as lastError, status FROM queue WHERE status = ? ORDER BY id ASC LIMIT ?',
    );
    return stmt.all('pending', limit) as QueuedRecord[];
  }

  /**
   * Mark a record as successfully synced
   */
  markSynced(id: number): void {
    const stmt = this.db.prepare(
      'UPDATE queue SET status = ?, attempts = attempts + 1 WHERE id = ?',
    );
    stmt.run('synced', id);
  }

  /**
   * Mark a record as failed with error message
   */
  markFailed(id: number, error: string): void {
    const stmt = this.db.prepare(
      'UPDATE queue SET status = CASE WHEN attempts >= 10 THEN ? ELSE ? END, attempts = attempts + 1, last_error = ? WHERE id = ?',
    );
    stmt.run('failed', 'pending', error, id);
  }

  /**
   * Get queue statistics
   */
  stats(): { pending: number; synced: number; failed: number } {
    const stmt = this.db.prepare(
      'SELECT status, COUNT(*) as count FROM queue GROUP BY status',
    );
    const rows = stmt.all() as { status: string; count: number }[];
    const result = { pending: 0, synced: 0, failed: 0 };
    for (const row of rows) {
      if (row.status in result) {
        (result as any)[row.status] = row.count;
      }
    }
    return result;
  }

  /**
   * Clean up old synced records (keep last 7 days)
   */
  cleanup(daysOld: number = 7): number {
    const stmt = this.db.prepare(
      "DELETE FROM queue WHERE status = 'synced' AND created_at < datetime('now', ?)",
    );
    const result = stmt.run(`-${daysOld} days`);
    if (result.changes > 0) {
      logger.info({ deleted: result.changes }, 'Cleaned up old synced records');
    }
    return result.changes;
  }

  close(): void {
    this.db.close();
  }
}
