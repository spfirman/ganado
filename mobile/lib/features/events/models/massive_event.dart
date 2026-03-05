import 'package:json_annotation/json_annotation.dart';

part 'massive_event.g.dart';

@JsonSerializable()
class MassiveEvent {
  final String id;
  final String name;
  final String? description;
  final String status; // open, closed
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;
  @JsonKey(name: 'closed_at')
  final DateTime? closedAt;
  @JsonKey(name: 'created_by')
  final String? createdBy;

  MassiveEvent({
    required this.id,
    required this.name,
    this.description,
    this.status = 'open',
    this.createdAt,
    this.closedAt,
    this.createdBy,
  });

  factory MassiveEvent.fromJson(Map<String, dynamic> json) =>
      _$MassiveEventFromJson(json);
  Map<String, dynamic> toJson() => _$MassiveEventToJson(this);
}

@JsonSerializable()
class SimpleEvent {
  final String id;
  @JsonKey(name: 'id_massive_event')
  final String idMassiveEvent;
  final String name;
  final String type;
  @JsonKey(name: 'data_json')
  final String? dataJson;
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;

  SimpleEvent({
    required this.id,
    required this.idMassiveEvent,
    required this.name,
    required this.type,
    this.dataJson,
    this.createdAt,
  });

  factory SimpleEvent.fromJson(Map<String, dynamic> json) =>
      _$SimpleEventFromJson(json);
  Map<String, dynamic> toJson() => _$SimpleEventToJson(this);
}
