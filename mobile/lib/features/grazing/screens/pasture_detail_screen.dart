import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/grazing/models/pasture.dart';
import 'package:ganado_app/features/grazing/providers/grazing_provider.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class PastureDetailScreen extends ConsumerWidget {
  final String pastureId;

  const PastureDetailScreen({
    required this.pastureId,
    super.key,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final pastureAsync = ref.watch(pastureDetailProvider(pastureId));
    final rotationsAsync =
        ref.watch(grazingRotationListProvider(pastureId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalles de la Pastura'),
      ),
      body: pastureAsync.when(
        data: (pasture) => SingleChildScrollView(
          child: Column(
            children: [
              // Header card
              Container(
                color: Colors.grey[100],
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      pasture.name,
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _InfoColumn(
                          label: 'Area',
                          value: '${pasture.areaHectares} ha',
                        ),
                        _InfoColumn(
                          label: 'Grass Type',
                          value: pasture.grassType ?? 'N/A',
                        ),
                        _InfoColumn(
                          label: 'Status',
                          value: pasture.statusLabel,
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Capacity section
              Padding(
                padding: const EdgeInsets.all(16),
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Capacity Usage',
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _CapacityInfo(
                              label: 'Current',
                              value: pasture.currentCount.toString(),
                            ),
                            _CapacityInfo(
                              label: 'Capacity',
                              value: pasture.capacity.toString(),
                            ),
                            _CapacityInfo(
                              label: 'Utilization',
                              value:
                                  '${pasture.utilizationPercentage.toStringAsFixed(1)}%',
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value:
                                pasture.utilizationPercentage / 100,
                            minHeight: 12,
                            backgroundColor: Colors.grey[300],
                            valueColor: AlwaysStoppedAnimation<Color>(
                              _getCapacityColor(
                                  pasture.utilizationPercentage),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Rotation history
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Rotation History',
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium
                          ?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    rotationsAsync.when(
                      data: (rotations) {
                        if (rotations.isEmpty) {
                          return Text(
                            'No rotations yet',
                            style: Theme.of(context).textTheme.bodySmall,
                          );
                        }
                        return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: rotations.length,
                          itemBuilder: (context, index) {
                            final rotation = rotations[index];
                            return Card(
                              margin:
                                  const EdgeInsets.only(bottom: 8),
                              child: Padding(
                                padding: const EdgeInsets.all(12),
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment
                                              .spaceBetween,
                                      children: [
                                        Text(
                                          'Rotation',
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium
                                              ?.copyWith(
                                            fontWeight:
                                                FontWeight.bold,
                                          ),
                                        ),
                                        Chip(
                                          label: Text(
                                            rotation.isActive
                                                ? 'Active'
                                                : 'Completed',
                                          ),
                                          backgroundColor: rotation
                                                  .isActive
                                              ? Colors.green
                                                  .withOpacity(
                                                  0.2)
                                              : Colors.grey
                                                  .withOpacity(
                                                  0.2),
                                          labelStyle:
                                              TextStyle(
                                            color: rotation
                                                    .isActive
                                                ? Colors.green
                                                : Colors.grey,
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Start: ${_formatDate(rotation.startDate)}',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodySmall,
                                    ),
                                    if (rotation.endDate != null)
                                      Text(
                                        'End: ${_formatDate(rotation.endDate!)}',
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodySmall,
                                      ),
                                    Text(
                                      'Cattle: ${rotation.cattleCount}',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodySmall,
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        );
                      },
                      loading: () =>
                          const CircularProgressIndicator(),
                      error: (error, _) =>
                          Text('Error: $error'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        loading: () =>
            const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Text('Error: $error'),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () =>
            context.go('/pastures/$pastureId/rotation/create'),
        tooltip: 'Start New Rotation',
        child: const Icon(Icons.add),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }

  Color _getCapacityColor(double utilization) {
    if (utilization <= 70) return Colors.green;
    if (utilization <= 90) return Colors.orange;
    return Colors.red;
  }
}

class _InfoColumn extends StatelessWidget {
  final String label;
  final String value;

  const _InfoColumn({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.labelSmall,
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

class _CapacityInfo extends StatelessWidget {
  final String label;
  final String value;

  const _CapacityInfo({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.labelSmall,
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
