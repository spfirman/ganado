enum HealthEventType {
  vaccination,
  deworming,
  treatment,
  injury,
  disease,
  checkup,
  surgery,
  other,
}

class HealthEvent {
  final String id;
  final String? idTenant;
  final String idCattle;
  final String? cattleNumber;
  final HealthEventType type;
  final String name;
  final String? description;
  final String? medication;
  final String? dosage;
  final String? diagnosis;
  final String? veterinarian;
  final double? cost;
  final String? status; // scheduled, completed, followup_required
  final DateTime eventDate;
  final DateTime? followUpDate;
  final String? notes;
  final DateTime? createdAt;

  HealthEvent({
    required this.id,
    this.idTenant,
    required this.idCattle,
    this.cattleNumber,
    required this.type,
    required this.name,
    this.description,
    this.medication,
    this.dosage,
    this.diagnosis,
    this.veterinarian,
    this.cost,
    this.status,
    required this.eventDate,
    this.followUpDate,
    this.notes,
    this.createdAt,
  });

  factory HealthEvent.fromJson(Map<String, dynamic> json) {
    return HealthEvent(
      id: json['id'] as String,
      idTenant: json['id_tenant'] as String?,
      idCattle: json['id_cattle'] as String,
      cattleNumber: json['cattle_number'] as String?,
      type: _parseEventType(json['type'] as String),
      name: json['name'] as String,
      description: json['description'] as String?,
      medication: json['medication'] as String?,
      dosage: json['dosage'] as String?,
      diagnosis: json['diagnosis'] as String?,
      veterinarian: json['veterinarian'] as String?,
      cost: (json['cost'] as num?)?.toDouble(),
      status: json['status'] as String?,
      eventDate: DateTime.parse(json['event_date'] as String),
      followUpDate: json['follow_up_date'] != null
          ? DateTime.parse(json['follow_up_date'] as String)
          : null,
      notes: json['notes'] as String?,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'id_tenant': idTenant,
        'id_cattle': idCattle,
        'cattle_number': cattleNumber,
        'type': type.name,
        'name': name,
        'description': description,
        'medication': medication,
        'dosage': dosage,
        'diagnosis': diagnosis,
        'veterinarian': veterinarian,
        'cost': cost,
        'status': status,
        'event_date': eventDate.toIso8601String(),
        'follow_up_date': followUpDate?.toIso8601String(),
        'notes': notes,
        'created_at': createdAt?.toIso8601String(),
      };

  static HealthEventType _parseEventType(String value) {
    return HealthEventType.values.firstWhere(
      (e) => e.name == value,
      orElse: () => HealthEventType.other,
    );
  }
}
