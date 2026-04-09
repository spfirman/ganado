enum BreedingEventType {
  heatDetection,
  insemination,
  naturalBreeding,
  pregnancyCheck,
  calving,
  weaning,
  abortion,
}

enum PregnancyStatus {
  open,
  bred,
  confirmed,
  late,
  calved,
  aborted,
}

class BreedingEvent {
  final String id;
  final String? idTenant;
  final String idCattle; // dam
  final String? cattleNumber;
  final String? sireId;
  final String? sireNumber;
  final BreedingEventType type;
  final PregnancyStatus? pregnancyStatus;
  final DateTime eventDate;
  final DateTime? expectedCalvingDate;
  final DateTime? actualCalvingDate;
  final String? calvingDifficulty; // easy, assisted, difficult, csection
  final int? calvesCount;
  final String? calfId;
  final double? calfBirthWeight;
  final String? calfGender;
  final String? inseminationType; // natural, ai
  final String? semenBatch;
  final String? technician;
  final String? notes;
  final DateTime? createdAt;

  BreedingEvent({
    required this.id,
    this.idTenant,
    required this.idCattle,
    this.cattleNumber,
    this.sireId,
    this.sireNumber,
    required this.type,
    this.pregnancyStatus,
    required this.eventDate,
    this.expectedCalvingDate,
    this.actualCalvingDate,
    this.calvingDifficulty,
    this.calvesCount,
    this.calfId,
    this.calfBirthWeight,
    this.calfGender,
    this.inseminationType,
    this.semenBatch,
    this.technician,
    this.notes,
    this.createdAt,
  });

  factory BreedingEvent.fromJson(Map<String, dynamic> json) {
    return BreedingEvent(
      id: json['id'] as String,
      idTenant: json['id_tenant'] as String?,
      idCattle: json['id_cattle'] as String,
      cattleNumber: json['cattle_number'] as String?,
      sireId: json['sire_id'] as String?,
      sireNumber: json['sire_number'] as String?,
      type: _parseBreedingEventType(json['type']),
      pregnancyStatus: _parsePregnancyStatus(json['pregnancy_status']),
      eventDate: DateTime.parse(json['event_date'] as String),
      expectedCalvingDate: json['expected_calving_date'] != null
          ? DateTime.parse(json['expected_calving_date'] as String)
          : null,
      actualCalvingDate: json['actual_calving_date'] != null
          ? DateTime.parse(json['actual_calving_date'] as String)
          : null,
      calvingDifficulty: json['calving_difficulty'] as String?,
      calvesCount: json['calves_count'] as int?,
      calfId: json['calf_id'] as String?,
      calfBirthWeight: (json['calf_birth_weight'] as num?)?.toDouble(),
      calfGender: json['calf_gender'] as String?,
      inseminationType: json['insemination_type'] as String?,
      semenBatch: json['semen_batch'] as String?,
      technician: json['technician'] as String?,
      notes: json['notes'] as String?,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'id_tenant': idTenant,
      'id_cattle': idCattle,
      'cattle_number': cattleNumber,
      'sire_id': sireId,
      'sire_number': sireNumber,
      'type': _breedingEventTypeToString(type),
      'pregnancy_status': _pregnancyStatusToString(pregnancyStatus),
      'event_date': eventDate.toIso8601String(),
      'expected_calving_date': expectedCalvingDate?.toIso8601String(),
      'actual_calving_date': actualCalvingDate?.toIso8601String(),
      'calving_difficulty': calvingDifficulty,
      'calves_count': calvesCount,
      'calf_id': calfId,
      'calf_birth_weight': calfBirthWeight,
      'calf_gender': calfGender,
      'insemination_type': inseminationType,
      'semen_batch': semenBatch,
      'technician': technician,
      'notes': notes,
      'created_at': createdAt?.toIso8601String(),
    };
  }

  BreedingEvent copyWith({
    String? id,
    String? idTenant,
    String? idCattle,
    String? cattleNumber,
    String? sireId,
    String? sireNumber,
    BreedingEventType? type,
    PregnancyStatus? pregnancyStatus,
    DateTime? eventDate,
    DateTime? expectedCalvingDate,
    DateTime? actualCalvingDate,
    String? calvingDifficulty,
    int? calvesCount,
    String? calfId,
    double? calfBirthWeight,
    String? calfGender,
    String? inseminationType,
    String? semenBatch,
    String? technician,
    String? notes,
    DateTime? createdAt,
  }) {
    return BreedingEvent(
      id: id ?? this.id,
      idTenant: idTenant ?? this.idTenant,
      idCattle: idCattle ?? this.idCattle,
      cattleNumber: cattleNumber ?? this.cattleNumber,
      sireId: sireId ?? this.sireId,
      sireNumber: sireNumber ?? this.sireNumber,
      type: type ?? this.type,
      pregnancyStatus: pregnancyStatus ?? this.pregnancyStatus,
      eventDate: eventDate ?? this.eventDate,
      expectedCalvingDate: expectedCalvingDate ?? this.expectedCalvingDate,
      actualCalvingDate: actualCalvingDate ?? this.actualCalvingDate,
      calvingDifficulty: calvingDifficulty ?? this.calvingDifficulty,
      calvesCount: calvesCount ?? this.calvesCount,
      calfId: calfId ?? this.calfId,
      calfBirthWeight: calfBirthWeight ?? this.calfBirthWeight,
      calfGender: calfGender ?? this.calfGender,
      inseminationType: inseminationType ?? this.inseminationType,
      semenBatch: semenBatch ?? this.semenBatch,
      technician: technician ?? this.technician,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  String toString() => 'BreedingEvent(id: $id, type: $type, cattle: $cattleNumber)';
}

BreedingEventType _parseBreedingEventType(dynamic value) {
  if (value == null) throw ArgumentError('type cannot be null');
  final str = value.toString();
  return BreedingEventType.values.firstWhere(
    (e) => e.toString().split('.').last == str,
    orElse: () => BreedingEventType.insemination,
  );
}

String _breedingEventTypeToString(BreedingEventType type) {
  return type.toString().split('.').last;
}

PregnancyStatus? _parsePregnancyStatus(dynamic value) {
  if (value == null) return null;
  final str = value.toString();
  return PregnancyStatus.values.firstWhere(
    (e) => e.toString().split('.').last == str,
    orElse: () => PregnancyStatus.open,
  );
}

String? _pregnancyStatusToString(PregnancyStatus? status) {
  if (status == null) return null;
  return status.toString().split('.').last;
}
