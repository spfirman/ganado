import 'package:json_annotation/json_annotation.dart';

part 'feed.g.dart';

enum FeedCategory {
  @JsonValue('hay')
  hay,
  @JsonValue('grain')
  grain,
  @JsonValue('supplement')
  supplement,
  @JsonValue('mineral')
  mineral,
  @JsonValue('silage')
  silage,
}

@JsonSerializable()
class FeedType {
  final String id;
  @JsonKey(name: 'id_tenant')
  final String idTenant;
  final String name;
  final FeedCategory category;
  final String unit;
  @JsonKey(name: 'price_per_unit')
  final double pricePerUnit;
  @JsonKey(name: 'nutritional_info')
  final String? nutritionalInfo;
  @JsonKey(name: 'in_stock')
  final double inStock;
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;

  FeedType({
    required this.id,
    required this.idTenant,
    required this.name,
    required this.category,
    required this.unit,
    required this.pricePerUnit,
    this.nutritionalInfo,
    required this.inStock,
    this.createdAt,
  });

  factory FeedType.fromJson(Map<String, dynamic> json) =>
      _$FeedTypeFromJson(json);
  Map<String, dynamic> toJson() => _$FeedTypeToJson(this);

  String get categoryLabel {
    switch (category) {
      case FeedCategory.hay:
        return 'Hay';
      case FeedCategory.grain:
        return 'Grain';
      case FeedCategory.supplement:
        return 'Supplement';
      case FeedCategory.mineral:
        return 'Mineral';
      case FeedCategory.silage:
        return 'Silage';
    }
  }

  bool get isLowStock => inStock < 50;
  bool get isOutOfStock => inStock == 0;
}

enum FeedingTargetGroup {
  @JsonValue('all')
  all,
  @JsonValue('lot')
  lot,
  @JsonValue('individual')
  individual,
}

@JsonSerializable()
class FeedingRecord {
  final String id;
  @JsonKey(name: 'id_tenant')
  final String idTenant;
  @JsonKey(name: 'feed_type_id')
  final String feedTypeId;
  @JsonKey(name: 'feed_type_name')
  final String feedTypeName;
  final double quantity;
  final String unit;
  @JsonKey(name: 'target_group')
  final FeedingTargetGroup targetGroup;
  @JsonKey(name: 'target_id')
  final String? targetId;
  @JsonKey(name: 'fed_at')
  final DateTime fedAt;
  @JsonKey(name: 'fed_by')
  final String? fedBy;
  final double cost;
  final String? notes;
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;

  FeedingRecord({
    required this.id,
    required this.idTenant,
    required this.feedTypeId,
    required this.feedTypeName,
    required this.quantity,
    required this.unit,
    required this.targetGroup,
    this.targetId,
    required this.fedAt,
    this.fedBy,
    required this.cost,
    this.notes,
    this.createdAt,
  });

  factory FeedingRecord.fromJson(Map<String, dynamic> json) =>
      _$FeedingRecordFromJson(json);
  Map<String, dynamic> toJson() => _$FeedingRecordToJson(this);

  String get targetLabel {
    switch (targetGroup) {
      case FeedingTargetGroup.all:
        return 'All Cattle';
      case FeedingTargetGroup.lot:
        return 'Lot';
      case FeedingTargetGroup.individual:
        return 'Individual';
    }
  }

  bool get isToday {
    final now = DateTime.now();
    return fedAt.year == now.year &&
        fedAt.month == now.month &&
        fedAt.day == now.day;
  }
}

@JsonSerializable()
class FeedingSummary {
  @JsonKey(name: 'total_quantity')
  final double totalQuantity;
  @JsonKey(name: 'total_cost')
  final double totalCost;
  @JsonKey(name: 'records_count')
  final int recordsCount;
  @JsonKey(name: 'date_range')
  final String dateRange;

  FeedingSummary({
    required this.totalQuantity,
    required this.totalCost,
    required this.recordsCount,
    required this.dateRange,
  });

  factory FeedingSummary.fromJson(Map<String, dynamic> json) =>
      _$FeedingSummaryFromJson(json);
  Map<String, dynamic> toJson() => _$FeedingSummaryToJson(this);
}
