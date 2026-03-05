import 'package:json_annotation/json_annotation.dart';

part 'cattle.g.dart';

enum CattleStatus {
  @JsonValue('active')
  active,
  @JsonValue('sold')
  sold,
  @JsonValue('dead')
  dead,
  @JsonValue('transferred')
  transferred,
}

enum CattleGender {
  @JsonValue('male')
  male,
  @JsonValue('female')
  female,
}

enum CattleColor {
  @JsonValue('black')
  black,
  @JsonValue('white')
  white,
  @JsonValue('brown')
  brown,
  @JsonValue('red')
  red,
  @JsonValue('spotted')
  spotted,
  @JsonValue('gray')
  gray,
  @JsonValue('yellow')
  yellow,
  @JsonValue('brindle')
  brindle,
}

@JsonSerializable()
class Cattle {
  final String id;
  @JsonKey(name: 'id_tenant')
  final String idTenant;
  @JsonKey(name: 'sys_number')
  final String sysNumber;
  final String number;
  @JsonKey(name: 'received_at')
  final DateTime? receivedAt;
  @JsonKey(name: 'received_weight')
  final double receivedWeight;
  @JsonKey(name: 'id_purchase')
  final String? idPurchase;
  @JsonKey(name: 'purchase_weight')
  final double purchaseWeight;
  @JsonKey(name: 'purchase_price')
  final double purchasePrice;
  @JsonKey(name: 'id_lot')
  final String? idLot;
  @JsonKey(name: 'id_brand')
  final String? idBrand;
  final CattleColor? color;
  @JsonKey(name: 'eartag_left')
  final String? eartagLeft;
  @JsonKey(name: 'eartag_right')
  final String? eartagRight;
  @JsonKey(name: 'id_device')
  final String? idDevice;
  final bool castrated;
  @JsonKey(name: 'castration_date')
  final DateTime? castrationDate;
  final String? comments;
  @JsonKey(name: 'purchase_commission')
  final double purchaseCommission;
  @JsonKey(name: 'negotiated_price_per_kg')
  final double negotiatedPricePerKg;
  @JsonKey(name: 'lot_price_per_weight')
  final double lotPricePerWeight;
  @JsonKey(name: 'sale_price')
  final double salePrice;
  @JsonKey(name: 'sale_price_per_kg')
  final double salePricePerKg;
  @JsonKey(name: 'sale_weight')
  final double saleWeight;
  @JsonKey(name: 'average_gr')
  final double averageGr;
  @JsonKey(name: 'purchased_from')
  final String? purchasedFrom;
  @JsonKey(name: 'id_provider')
  final String? idProvider;
  @JsonKey(name: 'last_weight')
  final double lastWeight;
  @JsonKey(name: 'has_horn')
  final bool hasHorn;
  final CattleStatus status;
  final CattleGender? gender;
  @JsonKey(name: 'birth_date_aprx')
  final DateTime? birthDateAprx;
  @JsonKey(name: 'new_feed_start_date')
  final DateTime? newFeedStartDate;
  @JsonKey(name: 'average_daily_gain')
  final double? averageDailyGain;
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime? updatedAt;
  @JsonKey(name: 'weight_history')
  final List<CattleWeightHistory>? weightHistory;
  @JsonKey(name: 'medication_history')
  final List<CattleMedicationHistory>? medicationHistory;
  @JsonKey(name: 'estimated_weight')
  final double? estimatedWeight;

  Cattle({
    required this.id,
    required this.idTenant,
    required this.sysNumber,
    required this.number,
    this.receivedAt,
    this.receivedWeight = 0,
    this.idPurchase,
    this.purchaseWeight = 0,
    this.purchasePrice = 0,
    this.idLot,
    this.idBrand,
    this.color,
    this.eartagLeft,
    this.eartagRight,
    this.idDevice,
    this.castrated = false,
    this.castrationDate,
    this.comments,
    this.purchaseCommission = 0,
    this.negotiatedPricePerKg = 0,
    this.lotPricePerWeight = 0,
    this.salePrice = 0,
    this.salePricePerKg = 0,
    this.saleWeight = 0,
    this.averageGr = 0,
    this.purchasedFrom,
    this.idProvider,
    this.lastWeight = 0,
    this.hasHorn = false,
    this.status = CattleStatus.active,
    this.gender,
    this.birthDateAprx,
    this.newFeedStartDate,
    this.averageDailyGain,
    this.createdAt,
    this.updatedAt,
    this.weightHistory,
    this.medicationHistory,
    this.estimatedWeight,
  });

  factory Cattle.fromJson(Map<String, dynamic> json) => _$CattleFromJson(json);
  Map<String, dynamic> toJson() => _$CattleToJson(this);
}

@JsonSerializable()
class CattleWeightHistory {
  final String id;
  @JsonKey(name: 'id_cattle')
  final String idCattle;
  final double weight;
  @JsonKey(name: 'weighed_at')
  final DateTime weighedAt;
  @JsonKey(name: 'registered_by')
  final String? registeredBy;

  CattleWeightHistory({
    required this.id,
    required this.idCattle,
    required this.weight,
    required this.weighedAt,
    this.registeredBy,
  });

  factory CattleWeightHistory.fromJson(Map<String, dynamic> json) =>
      _$CattleWeightHistoryFromJson(json);
  Map<String, dynamic> toJson() => _$CattleWeightHistoryToJson(this);
}

@JsonSerializable()
class CattleMedicationHistory {
  final String id;
  @JsonKey(name: 'id_cattle')
  final String idCattle;
  final String medication;
  final String? dosage;
  final String? notes;
  @JsonKey(name: 'applied_at')
  final DateTime appliedAt;
  @JsonKey(name: 'applied_by')
  final String? appliedBy;

  CattleMedicationHistory({
    required this.id,
    required this.idCattle,
    required this.medication,
    this.dosage,
    this.notes,
    required this.appliedAt,
    this.appliedBy,
  });

  factory CattleMedicationHistory.fromJson(Map<String, dynamic> json) =>
      _$CattleMedicationHistoryFromJson(json);
  Map<String, dynamic> toJson() => _$CattleMedicationHistoryToJson(this);
}
