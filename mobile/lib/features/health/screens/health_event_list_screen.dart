import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/health/models/health_event.dart';
import 'package:ganado_app/features/health/providers/health_provider.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class HealthEventListScreen extends ConsumerWidget {
  const HealthEventListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final healthEventList = ref.watch(healthEventListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Eventos de Salud'),
      ),
      body: Column(
        children: [
          // Filter chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
            child: Row(
              children: [
                FilterChip(
                  label: const Text('All'),
                  onSelected: (selected) {
                    if (selected) {
                      ref
                          .read(healthEventListProvider.notifier)
                          .clearFilters();
                    }
                  },
                ),
                const SizedBox(width: 8),
                ...HealthEventType.values.map((type) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(_getTypeLabel(type, l10n)),
                      onSelected: (selected) {
                        if (selected) {
                          ref.read(healthEventListProvider.notifier).setFilters(
                                type: type.name,
                              );
                        }
                      },
                    ),
                  );
                }).toList(),
              ],
            ),
          ),
          // Event list
          Expanded(
            child: healthEventList.when(
              data: (result) {
                if (result.items.isEmpty) {
                  return Center(child: Text(l10n.noData));
                }
                return RefreshIndicator(
                  onRefresh: () =>
                      ref.read(healthEventListProvider.notifier).refresh(),
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: result.items.length,
                    itemBuilder: (context, index) {
                      final event = result.items[index];
                      return _HealthEventCard(
                        event: event,
                        onTap: () =>
                            context.go('/health-events/${event.id}'),
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
                          ref.read(healthEventListProvider.notifier).load(),
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
        onPressed: () => context.go('/health-events/new'),
        child: const Icon(Icons.add),
      ),
    );
  }

  String _getTypeLabel(HealthEventType type, AppLocalizations l10n) {
    switch (type) {
      case HealthEventType.vaccination:
        return 'Vaccination';
      case HealthEventType.deworming:
        return 'Deworming';
      case HealthEventType.treatment:
        return 'Treatment';
      case HealthEventType.injury:
        return 'Injury';
      case HealthEventType.disease:
        return 'Disease';
      case HealthEventType.checkup:
        return 'Checkup';
      case HealthEventType.surgery:
        return 'Surgery';
      case HealthEventType.other:
        return 'Other';
    }
  }
}

class _HealthEventCard extends StatelessWidget {
  final HealthEvent event;
  final VoidCallback onTap;

  const _HealthEventCard({
    required this.event,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Type and status row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      _getTypeIcon(event.type),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              event.name,
                              style: theme.textTheme.titleMedium
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            ),
                            Text(
                              '#${event.cattleNumber ?? event.idCattle}',
                              style: theme.textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  Chip(
                    label: Text(
                      event.status?.toUpperCase() ?? 'PENDING',
                      style: const TextStyle(fontSize: 12),
                    ),
                    backgroundColor: _getStatusColor(event.status),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              // Date and medication
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _formatDate(event.eventDate),
                    style: theme.textTheme.bodySmall,
                  ),
                  if (event.medication != null)
                    Text(
                      event.medication!,
                      style: theme.textTheme.bodySmall
                          ?.copyWith(fontStyle: FontStyle.italic),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _getTypeIcon(HealthEventType type) {
    IconData iconData;
    switch (type) {
      case HealthEventType.vaccination:
        iconData = Icons.vaccines;
      case HealthEventType.deworming:
        iconData = Icons.medication;
      case HealthEventType.treatment:
        iconData = Icons.medical_services;
      case HealthEventType.injury:
        iconData = Icons.warning;
      case HealthEventType.disease:
        iconData = Icons.sick;
      case HealthEventType.checkup:
        iconData = Icons.health_and_safety;
      case HealthEventType.surgery:
        iconData = Icons.local_hospital;
      case HealthEventType.other:
        iconData = Icons.info;
    }
    return Icon(iconData, size: 24);
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'completed':
        return Colors.green.shade100;
      case 'scheduled':
        return Colors.blue.shade100;
      case 'followup_required':
        return Colors.orange.shade100;
      default:
        return Colors.grey.shade100;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
