import 'package:json_annotation/json_annotation.dart';

part 'pasture.g.dart';

enum PastureStatus {
  @JsonValue('resting')
  resting,
  @JsonValue('active')
  active,
  @JsonValue('over_grazed')
  overGrazed,
}

@JsonSerializable()
class Pasture {
  final String id;
  @JsonKey(name: 'id_tenant')
  final String idTenant;
  final String name;
  @JsonKey(name: 'area_hectares')
  final double areaHectares;
  @JsonKey(name: 'grass_type')
  final String? grassType;
  final PastureStatus status;
  final int capacity;
  @JsonKey(name: 'current_count')
  final int currentCount;
  @JsonKey(name: 'last_rotation_date')
  final DateTime? lastRotationDate;
  @JsonKey(name: 'next_rotation_date')
  final DateTime? nextRotationDate;
  final String? notes;
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;

  Pasture({
    required this.id,
    required this.idTenant,
    required this.name,
    required this.areaHectares,
    this.grassType,
    required this.status,
    required this.capacity,
    required this.currentCount,
    this.lastRotationDate,
    this.nextRotationDate,
    this.notes,
    this.createdAt,
  });

  factory Pasture.fromJson(Map<String, dynamic> json) =>
      _$PastureFromJson(json);
  Map<String, dynamic> toJson() => _$PastureToJson(this);

  double get utilizationPercentage => (currentCount / capacity * 100).clamp(0, 100);

  String get statusLabel {
    switch (status) {
      case PastureStatus.resting:
        return 'Resting';
      case PastureStatus.active:
        return 'Active';
      case PastureStatus.overGrazed:
        return 'Over Grazed';
    }
  }

  bool get isAtCapacity => currentCount >= capacity;
  bool get isOverCapacity => currentCount > capacity;
}

@JsonSerializable()
class GrazingRotation {
  final String id;
  @JsonKey(name: 'pasture_id')
  final String pastureId;
  @JsonKey(name: 'pasture_name')
  final String pastureName;
  @JsonKey(name: 'start_date')
  final DateTime startDate;
  @JsonKey(name: 'end_date')
  final DateTime? endDate;
  @JsonKey(name: 'cattle_count')
  final int cattleCount;
  final String? notes;
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;

  GrazingRotation({
    required this.id,
    required this.pastureId,
    required this.pastureName,
    required this.startDate,
    this.endDate,
    required this.cattleCount,
    this.notes,
    this.createdAt,
  });

  factory GrazingRotation.fromJson(Map<String, dynamic> json) =>
      _$GrazingRotationFromJson(json);
  Map<String, dynamic> toJson() => _$GrazingRotationToJson(this);

  bool get isActive => endDate == null || endDate!.isAfter(DateTime.now());

  int get daysInRotation {
    final now = DateTime.now();
    final end = endDate ?? now;
    return end.difference(startDate).inDays;
  }
}
