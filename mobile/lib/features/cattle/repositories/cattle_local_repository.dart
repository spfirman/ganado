import 'dart:convert';

import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/database/app_database.dart';
import 'package:ganado_app/core/sync/sync_queue.dart';
import 'package:ganado_app/features/cattle/models/cattle.dart';

final cattleLocalRepositoryProvider = Provider<CattleLocalRepository>((ref) {
  return CattleLocalRepository(
    ref.read(appDatabaseProvider),
    ref.read(syncQueueServiceProvider),
  );
});

class CattleLocalRepository {
  final AppDatabase _db;
  final SyncQueueService _syncQueue;

  CattleLocalRepository(this._db, this._syncQueue);

  Future<List<CattleTableData>> getAll({int limit = 50, int offset = 0}) {
    return (_db.select(_db.cattleTable)
          ..limit(limit, offset: offset)
          ..orderBy([(t) => OrderingTerm.desc(t.updatedAt)]))
        .get();
  }

  Future<CattleTableData?> getById(String id) {
    return (_db.select(_db.cattleTable)..where((t) => t.id.equals(id)))
        .getSingleOrNull();
  }

  Future<List<CattleTableData>> search(String query) {
    return (_db.select(_db.cattleTable)
          ..where((t) =>
              t.number.like('%$query%') | t.sysNumber.like('%$query%')))
        .get();
  }

  Future<void> upsert(Cattle cattle) async {
    await _db.into(_db.cattleTable).insertOnConflictUpdate(
          CattleTableCompanion.insert(
            id: cattle.id,
            idTenant: cattle.idTenant,
            sysNumber: cattle.sysNumber,
            number: cattle.number,
            receivedAt: Value(cattle.receivedAt),
            receivedWeight: Value(cattle.receivedWeight),
            idPurchase: Value(cattle.idPurchase),
            purchaseWeight: Value(cattle.purchaseWeight),
            purchasePrice: Value(cattle.purchasePrice),
            idLot: Value(cattle.idLot),
            idBrand: Value(cattle.idBrand),
            color: Value(cattle.color?.name),
            eartagLeft: Value(cattle.eartagLeft),
            eartagRight: Value(cattle.eartagRight),
            idDevice: Value(cattle.idDevice),
            castrated: Value(cattle.castrated),
            castrationDate: Value(cattle.castrationDate),
            comments: Value(cattle.comments),
            lastWeight: Value(cattle.lastWeight),
            hasHorn: Value(cattle.hasHorn),
            status: Value(cattle.status.name),
            gender: Value(cattle.gender?.name),
            birthDateAprx: Value(cattle.birthDateAprx),
            createdAt: Value(cattle.createdAt),
            updatedAt: Value(cattle.updatedAt),
          ),
        );
  }

  Future<void> upsertMany(List<Cattle> cattleList) async {
    await _db.batch((batch) {
      for (final cattle in cattleList) {
        batch.insert(
          _db.cattleTable,
          CattleTableCompanion.insert(
            id: cattle.id,
            idTenant: cattle.idTenant,
            sysNumber: cattle.sysNumber,
            number: cattle.number,
            lastWeight: Value(cattle.lastWeight),
            status: Value(cattle.status.name),
            gender: Value(cattle.gender?.name),
            color: Value(cattle.color?.name),
            idBrand: Value(cattle.idBrand),
            updatedAt: Value(cattle.updatedAt),
          ),
          mode: InsertMode.insertOrReplace,
        );
      }
    });
  }

  Future<void> createOffline(Map<String, dynamic> data, String id) async {
    await _syncQueue.enqueue(
      entityType: 'cattle',
      entityId: id,
      operation: 'CREATE',
      payloadJson: jsonEncode(data),
    );
  }

  Future<void> updateOffline(String id, Map<String, dynamic> data) async {
    await _syncQueue.enqueue(
      entityType: 'cattle',
      entityId: id,
      operation: 'UPDATE',
      payloadJson: jsonEncode(data),
    );
  }

  Future<void> deleteOffline(String id) async {
    await (_db.delete(_db.cattleTable)..where((t) => t.id.equals(id))).go();
    await _syncQueue.enqueue(
      entityType: 'cattle',
      entityId: id,
      operation: 'DELETE',
      payloadJson: '{}',
    );
  }

  // Weight history
  Future<List<CattleWeightHistoryTableData>> getWeightHistory(String cattleId) {
    return (_db.select(_db.cattleWeightHistoryTable)
          ..where((t) => t.idCattle.equals(cattleId))
          ..orderBy([(t) => OrderingTerm.desc(t.weighedAt)]))
        .get();
  }

  Future<void> upsertWeightHistory(CattleWeightHistory wh) async {
    await _db.into(_db.cattleWeightHistoryTable).insertOnConflictUpdate(
          CattleWeightHistoryTableCompanion.insert(
            id: wh.id,
            idCattle: wh.idCattle,
            weight: wh.weight,
            weighedAt: wh.weighedAt,
            registeredBy: Value(wh.registeredBy),
          ),
        );
  }

  // Medication history
  Future<List<CattleMedicationHistoryTableData>> getMedicationHistory(
      String cattleId) {
    return (_db.select(_db.cattleMedicationHistoryTable)
          ..where((t) => t.idCattle.equals(cattleId))
          ..orderBy([(t) => OrderingTerm.desc(t.appliedAt)]))
        .get();
  }

  Future<void> upsertMedicationHistory(CattleMedicationHistory mh) async {
    await _db.into(_db.cattleMedicationHistoryTable).insertOnConflictUpdate(
          CattleMedicationHistoryTableCompanion.insert(
            id: mh.id,
            idCattle: mh.idCattle,
            medication: mh.medication,
            dosage: Value(mh.dosage),
            notes: Value(mh.notes),
            appliedAt: mh.appliedAt,
            appliedBy: Value(mh.appliedBy),
          ),
        );
  }
}
