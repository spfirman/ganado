import 'dart:io';

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';

part 'app_database.g.dart';

// ─── Sync Queue Table ───
class SyncQueue extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get entityType => text()();
  TextColumn get entityId => text()();
  TextColumn get operation => text()(); // CREATE, UPDATE, DELETE
  TextColumn get payloadJson => text()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  IntColumn get retryCount => integer().withDefault(const Constant(0))();
  TextColumn get status =>
      text().withDefault(const Constant('pending'))(); // pending, processing, failed
}

// ─── Cattle Tables ───
class CattleTable extends Table {
  @override
  String get tableName => 'cattle';

  TextColumn get id => text()();
  TextColumn get idTenant => text()();
  TextColumn get sysNumber => text()();
  TextColumn get number => text()();
  DateTimeColumn get receivedAt => dateTime().nullable()();
  RealColumn get receivedWeight => real().withDefault(const Constant(0))();
  TextColumn get idPurchase => text().nullable()();
  RealColumn get purchaseWeight => real().withDefault(const Constant(0))();
  RealColumn get purchasePrice => real().withDefault(const Constant(0))();
  TextColumn get idLot => text().nullable()();
  TextColumn get idBrand => text().nullable()();
  TextColumn get color => text().nullable()();
  TextColumn get eartagLeft => text().nullable()();
  TextColumn get eartagRight => text().nullable()();
  TextColumn get idDevice => text().nullable()();
  BoolColumn get castrated => boolean().withDefault(const Constant(false))();
  DateTimeColumn get castrationDate => dateTime().nullable()();
  TextColumn get comments => text().nullable()();
  RealColumn get purchaseCommission => real().withDefault(const Constant(0))();
  RealColumn get negotiatedPricePerKg =>
      real().withDefault(const Constant(0))();
  RealColumn get lotPricePerWeight => real().withDefault(const Constant(0))();
  RealColumn get salePrice => real().withDefault(const Constant(0))();
  RealColumn get salePricePerKg => real().withDefault(const Constant(0))();
  RealColumn get saleWeight => real().withDefault(const Constant(0))();
  RealColumn get averageGr => real().withDefault(const Constant(0))();
  TextColumn get purchasedFrom => text().nullable()();
  TextColumn get idProvider => text().nullable()();
  RealColumn get lastWeight => real().withDefault(const Constant(0))();
  BoolColumn get hasHorn => boolean().withDefault(const Constant(false))();
  TextColumn get status => text().withDefault(const Constant('active'))();
  TextColumn get gender => text().nullable()();
  DateTimeColumn get birthDateAprx => dateTime().nullable()();
  DateTimeColumn get newFeedStartDate => dateTime().nullable()();
  RealColumn get averageDailyGain => real().nullable()();
  DateTimeColumn get createdAt => dateTime().nullable()();
  DateTimeColumn get updatedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

class CattleWeightHistoryTable extends Table {
  @override
  String get tableName => 'cattle_weight_history';

  TextColumn get id => text()();
  TextColumn get idCattle => text()();
  RealColumn get weight => real()();
  DateTimeColumn get weighedAt => dateTime()();
  TextColumn get registeredBy => text().nullable()();
  DateTimeColumn get createdAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

class CattleMedicationHistoryTable extends Table {
  @override
  String get tableName => 'cattle_medication_history';

  TextColumn get id => text()();
  TextColumn get idCattle => text()();
  TextColumn get medication => text()();
  TextColumn get dosage => text().nullable()();
  TextColumn get notes => text().nullable()();
  DateTimeColumn get appliedAt => dateTime()();
  TextColumn get appliedBy => text().nullable()();
  DateTimeColumn get createdAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// ─── Brand Table ───
class BrandTable extends Table {
  @override
  String get tableName => 'brands';

  TextColumn get id => text()();
  TextColumn get idTenant => text()();
  TextColumn get name => text()();
  TextColumn get imageUrl => text().nullable()();
  TextColumn get localImagePath => text().nullable()();
  DateTimeColumn get createdAt => dateTime().nullable()();
  DateTimeColumn get updatedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// ─── Purchase Table ───
class PurchaseTable extends Table {
  @override
  String get tableName => 'purchases';

  TextColumn get id => text()();
  TextColumn get idTenant => text()();
  TextColumn get idProvider => text().nullable()();
  TextColumn get providerName => text().nullable()();
  TextColumn get status => text().withDefault(const Constant('draft'))();
  RealColumn get totalWeight => real().withDefault(const Constant(0))();
  RealColumn get totalPrice => real().withDefault(const Constant(0))();
  IntColumn get totalAnimals => integer().withDefault(const Constant(0))();
  DateTimeColumn get purchaseDate => dateTime().nullable()();
  TextColumn get comments => text().nullable()();
  DateTimeColumn get createdAt => dateTime().nullable()();
  DateTimeColumn get updatedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// ─── Provider Table ───
class ProviderTable extends Table {
  @override
  String get tableName => 'providers';

  TextColumn get id => text()();
  TextColumn get idTenant => text()();
  TextColumn get name => text()();
  TextColumn get nit => text().nullable()();
  TextColumn get type => text().nullable()();
  TextColumn get phone => text().nullable()();
  TextColumn get email => text().nullable()();
  TextColumn get address => text().nullable()();
  DateTimeColumn get createdAt => dateTime().nullable()();
  DateTimeColumn get updatedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// ─── Sale Table ───
class SaleTable extends Table {
  @override
  String get tableName => 'sales';

  TextColumn get id => text()();
  TextColumn get idTenant => text()();
  TextColumn get buyerName => text().nullable()();
  TextColumn get buyerNit => text().nullable()();
  TextColumn get status => text().withDefault(const Constant('draft'))();
  RealColumn get totalWeight => real().withDefault(const Constant(0))();
  RealColumn get totalPrice => real().withDefault(const Constant(0))();
  IntColumn get totalAnimals => integer().withDefault(const Constant(0))();
  DateTimeColumn get saleDate => dateTime().nullable()();
  TextColumn get comments => text().nullable()();
  DateTimeColumn get createdAt => dateTime().nullable()();
  DateTimeColumn get updatedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// ─── Massive Event Table ───
class MassiveEventTable extends Table {
  @override
  String get tableName => 'massive_events';

  TextColumn get id => text()();
  TextColumn get idTenant => text()();
  TextColumn get name => text()();
  TextColumn get description => text().nullable()();
  TextColumn get status => text().withDefault(const Constant('open'))();
  DateTimeColumn get createdAt => dateTime().nullable()();
  DateTimeColumn get closedAt => dateTime().nullable()();
  TextColumn get createdBy => text().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// ─── Simple Event Table ───
class SimpleEventTable extends Table {
  @override
  String get tableName => 'simple_events';

  TextColumn get id => text()();
  TextColumn get idMassiveEvent => text()();
  TextColumn get name => text()();
  TextColumn get type => text()();
  TextColumn get dataJson => text().nullable()();
  DateTimeColumn get createdAt => dateTime().nullable()();
  DateTimeColumn get updatedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// ─── Animal Simple Event (junction) ───
class AnimalSimpleEventTable extends Table {
  @override
  String get tableName => 'animal_simple_events';

  TextColumn get id => text()();
  TextColumn get idCattle => text()();
  TextColumn get idSimpleEvent => text()();
  DateTimeColumn get appliedAt => dateTime()();
  TextColumn get appliedBy => text().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(tables: [
  SyncQueue,
  CattleTable,
  CattleWeightHistoryTable,
  CattleMedicationHistoryTable,
  BrandTable,
  PurchaseTable,
  ProviderTable,
  SaleTable,
  MassiveEventTable,
  SimpleEventTable,
  AnimalSimpleEventTable,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  static LazyDatabase _openConnection() {
    return LazyDatabase(() async {
      if (kIsWeb) {
        // Web uses in-memory or IndexedDB via drift
        return NativeDatabase.memory();
      }
      final dbFolder = await getApplicationDocumentsDirectory();
      final file = File(p.join(dbFolder.path, 'ganado.db'));
      return NativeDatabase.createInBackground(file);
    });
  }
}

final appDatabaseProvider = Provider<AppDatabase>((ref) {
  final db = AppDatabase();
  ref.onDispose(() => db.close());
  return db;
});
