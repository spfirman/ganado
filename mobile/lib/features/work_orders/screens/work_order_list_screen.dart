import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/work_orders/models/work_order.dart';
import 'package:ganado_app/features/work_orders/providers/work_order_provider.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class WorkOrderListScreen extends ConsumerStatefulWidget {
  const WorkOrderListScreen({super.key});

  @override
  ConsumerState<WorkOrderListScreen> createState() =>
      _WorkOrderListScreenState();
}

class _WorkOrderListScreenState extends ConsumerState<WorkOrderListScreen> {
  String? _selectedStatus;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final workOrderList = ref.watch(workOrderListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Órdenes de Trabajo'),
        elevation: 0,
      ),
      body: Column(
        children: [
          _buildFilterChips(context),
          Expanded(
            child: workOrderList.when(
              data: (result) {
                if (result.items.isEmpty) {
                  return Center(
                    child: Text(l10n.noData),
                  );
                }
                return RefreshIndicator(
                  onRefresh: () =>
                      ref.read(workOrderListProvider.notifier).refresh(),
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: result.items.length,
                    itemBuilder: (context, index) {
                      final workOrder = result.items[index];
                      return _WorkOrderCard(
                        workOrder: workOrder,
                        onTap: () =>
                            context.go('/work-orders/${workOrder.id}'),
                      );
                    },
                  ),
                );
              },
              loading: () =>
                  const Center(child: CircularProgressIndicator()),
              error: (error, _) => Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('${l10n.error}: $error'),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () =>
                          ref.read(workOrderListProvider.notifier).load(),
                      child: Text(l10n.retry),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/work-orders/create'),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildFilterChips(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          FilterChip(
            label: const Text('All'),
            selected: _selectedStatus == null,
            onSelected: (selected) {
              setState(() => _selectedStatus = null);
              ref
                  .read(workOrderListProvider.notifier)
                  .filterByStatus(null);
            },
          ),
          const SizedBox(width: 8),
          FilterChip(
            label: const Text('Pending'),
            selected: _selectedStatus == WorkOrderStatus.pending.name,
            onSelected: (selected) {
              setState(() => _selectedStatus = WorkOrderStatus.pending.name);
              ref
                  .read(workOrderListProvider.notifier)
                  .filterByStatus(WorkOrderStatus.pending.name);
            },
          ),
          const SizedBox(width: 8),
          FilterChip(
            label: const Text('In Progress'),
            selected: _selectedStatus == WorkOrderStatus.inProgress.name,
            onSelected: (selected) {
              setState(() => _selectedStatus = WorkOrderStatus.inProgress.name);
              ref
                  .read(workOrderListProvider.notifier)
                  .filterByStatus(WorkOrderStatus.inProgress.name);
            },
          ),
          const SizedBox(width: 8),
          FilterChip(
            label: const Text('Completed'),
            selected: _selectedStatus == WorkOrderStatus.completed.name,
            onSelected: (selected) {
              setState(() => _selectedStatus = WorkOrderStatus.completed.name);
              ref
                  .read(workOrderListProvider.notifier)
                  .filterByStatus(WorkOrderStatus.completed.name);
            },
          ),
        ],
      ),
    );
  }
}

class _WorkOrderCard extends StatelessWidget {
  final WorkOrder workOrder;
  final VoidCallback onTap;

  const _WorkOrderCard({
    required this.workOrder,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final priorityColor = _getPriorityColor();

    return GestureDetector(
      onTap: onTap,
      child: Card(
        margin: const EdgeInsets.only(bottom: 12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 4,
                    height: 60,
                    margin: const EdgeInsets.only(right: 12),
                    decoration: BoxDecoration(
                      color: priorityColor,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          workOrder.title,
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          workOrder.typeLabel,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  Chip(
                    label: Text(workOrder.statusLabel),
                    backgroundColor:
                        _getStatusColor().withOpacity(0.2),
                    labelStyle: TextStyle(
                      color: _getStatusColor(),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                    padding: EdgeInsets.zero,
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (workOrder.assignedToName != null)
                    Text(
                      'Assigned to: ${workOrder.assignedToName}',
                      style: theme.textTheme.bodySmall,
                    ),
                  if (workOrder.dueDate != null)
                    Text(
                      _formatDate(workOrder.dueDate!),
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: workOrder.isOverdue
                            ? Colors.red
                            : Colors.grey[600],
                        fontWeight: workOrder.isOverdue
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getPriorityColor() {
    switch (workOrder.priority) {
      case WorkOrderPriority.low:
        return Colors.green;
      case WorkOrderPriority.medium:
        return Colors.orange;
      case WorkOrderPriority.high:
        return Colors.red;
      case WorkOrderPriority.urgent:
        return Colors.red[900]!;
    }
  }

  Color _getStatusColor() {
    switch (workOrder.status) {
      case WorkOrderStatus.pending:
        return Colors.orange;
      case WorkOrderStatus.inProgress:
        return Colors.blue;
      case WorkOrderStatus.completed:
        return Colors.green;
      case WorkOrderStatus.cancelled:
        return Colors.grey;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}
