import 'package:json_annotation/json_annotation.dart';

part 'work_order.g.dart';

enum WorkOrderType {
  @JsonValue('fencing')
  fencing,
  @JsonValue('maintenance')
  maintenance,
  @JsonValue('veterinary')
  veterinary,
  @JsonValue('feeding')
  feeding,
  @JsonValue('general')
  general,
}

enum WorkOrderPriority {
  @JsonValue('low')
  low,
  @JsonValue('medium')
  medium,
  @JsonValue('high')
  high,
  @JsonValue('urgent')
  urgent,
}

enum WorkOrderStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('in_progress')
  inProgress,
  @JsonValue('completed')
  completed,
  @JsonValue('cancelled')
  cancelled,
}

@JsonSerializable()
class WorkOrder {
  final String id;
  @JsonKey(name: 'id_tenant')
  final String idTenant;
  final String title;
  final String? description;
  final WorkOrderType type;
  final WorkOrderPriority priority;
  final WorkOrderStatus status;
  @JsonKey(name: 'assigned_to')
  final String? assignedTo;
  @JsonKey(name: 'assigned_to_name')
  final String? assignedToName;
  @JsonKey(name: 'due_date')
  final DateTime? dueDate;
  @JsonKey(name: 'completed_at')
  final DateTime? completedAt;
  final String? notes;
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;

  WorkOrder({
    required this.id,
    required this.idTenant,
    required this.title,
    this.description,
    required this.type,
    required this.priority,
    required this.status,
    this.assignedTo,
    this.assignedToName,
    this.dueDate,
    this.completedAt,
    this.notes,
    this.createdAt,
  });

  factory WorkOrder.fromJson(Map<String, dynamic> json) =>
      _$WorkOrderFromJson(json);
  Map<String, dynamic> toJson() => _$WorkOrderToJson(this);

  String get statusLabel {
    switch (status) {
      case WorkOrderStatus.pending:
        return 'Pending';
      case WorkOrderStatus.inProgress:
        return 'In Progress';
      case WorkOrderStatus.completed:
        return 'Completed';
      case WorkOrderStatus.cancelled:
        return 'Cancelled';
    }
  }

  String get priorityLabel {
    switch (priority) {
      case WorkOrderPriority.low:
        return 'Low';
      case WorkOrderPriority.medium:
        return 'Medium';
      case WorkOrderPriority.high:
        return 'High';
      case WorkOrderPriority.urgent:
        return 'Urgent';
    }
  }

  String get typeLabel {
    switch (type) {
      case WorkOrderType.fencing:
        return 'Fencing';
      case WorkOrderType.maintenance:
        return 'Maintenance';
      case WorkOrderType.veterinary:
        return 'Veterinary';
      case WorkOrderType.feeding:
        return 'Feeding';
      case WorkOrderType.general:
        return 'General';
    }
  }

  bool get isOverdue =>
      dueDate != null &&
      dueDate!.isBefore(DateTime.now()) &&
      status != WorkOrderStatus.completed &&
      status != WorkOrderStatus.cancelled;
}
