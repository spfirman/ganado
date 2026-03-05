import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/database/app_database.dart';

final syncQueueServiceProvider = Provider<SyncQueueService>((ref) {
  return SyncQueueService(ref.read(appDatabaseProvider));
});

class SyncQueueService {
  final AppDatabase _db;

  SyncQueueService(this._db);

  Future<void> enqueue({
    required String entityType,
    required String entityId,
    required String operation,
    required String payloadJson,
  }) async {
    await _db.into(_db.syncQueue).insert(
          SyncQueueCompanion.insert(
            entityType: entityType,
            entityId: entityId,
            operation: operation,
            payloadJson: payloadJson,
          ),
        );
  }

  Future<List<SyncQueueData>> getPendingItems() async {
    return (_db.select(_db.syncQueue)
          ..where((t) => t.status.equals('pending'))
          ..orderBy([(t) => OrderingTerm.asc(t.createdAt)]))
        .get();
  }

  Future<void> markProcessing(int id) async {
    await (_db.update(_db.syncQueue)..where((t) => t.id.equals(id))).write(
      const SyncQueueCompanion(status: Value('processing')),
    );
  }

  Future<void> markFailed(int id, int retryCount) async {
    await (_db.update(_db.syncQueue)..where((t) => t.id.equals(id))).write(
      SyncQueueCompanion(
        status: const Value('pending'),
        retryCount: Value(retryCount + 1),
      ),
    );
  }

  Future<void> remove(int id) async {
    await (_db.delete(_db.syncQueue)..where((t) => t.id.equals(id))).go();
  }

  Stream<int> watchPendingCount() {
    final query = _db.selectOnly(_db.syncQueue)
      ..where(_db.syncQueue.status.equals('pending'))
      ..addColumns([_db.syncQueue.id.count()]);
    return query
        .watchSingle()
        .map((row) => row.read(_db.syncQueue.id.count()) ?? 0);
  }
}
