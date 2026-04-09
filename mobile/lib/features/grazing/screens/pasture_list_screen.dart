import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/grazing/models/pasture.dart';
import 'package:ganado_app/features/grazing/providers/grazing_provider.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class PastureListScreen extends ConsumerWidget {
  const PastureListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final pastureList = ref.watch(pastureListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Gestión de Pasturas'),
        elevation: 0,
      ),
      body: pastureList.when(
        data: (result) {
          if (result.items.isEmpty) {
            return Center(
              child: Text(l10n.noData),
            );
          }
          return RefreshIndicator(
            onRefresh: () =>
                ref.read(pastureListProvider.notifier).refresh(),
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1,
              ),
              itemCount: result.items.length,
              itemBuilder: (context, index) {
                final pasture = result.items[index];
                return _PastureCard(
                  pasture: pasture,
                  onTap: () => context.go('/pastures/${pasture.id}'),
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
                    ref.read(pastureListProvider.notifier).load(),
                child: Text(l10n.retry),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/pastures/create'),
        child: const Icon(Icons.add),
      ),
    );
  }
}

class _PastureCard extends StatelessWidget {
  final Pasture pasture;
  final VoidCallback onTap;

  const _PastureCard({
    required this.pasture,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final statusColor = _getStatusColor();

    return GestureDetector(
      onTap: onTap,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with name and status
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      pasture.name,
                      style: theme.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      pasture.statusLabel,
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: statusColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Area and grass type
              Text(
                '${pasture.areaHectares} ha',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
              if (pasture.grassType != null)
                Text(
                  pasture.grassType!,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.grey[600],
                  ),
                ),
              const SizedBox(height: 12),

              // Capacity bar
              Text(
                'Capacity: ${pasture.currentCount}/${pasture.capacity}',
                style: theme.textTheme.labelSmall,
              ),
              const SizedBox(height: 4),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: pasture.utilizationPercentage / 100,
                  minHeight: 8,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(
                    _getCapacityColor(),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '${pasture.utilizationPercentage.toStringAsFixed(1)}% utilized',
                style: theme.textTheme.labelSmall?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getStatusColor() {
    switch (pasture.status) {
      case PastureStatus.active:
        return Colors.green;
      case PastureStatus.resting:
        return Colors.orange;
      case PastureStatus.overGrazed:
        return Colors.red;
    }
  }

  Color _getCapacityColor() {
    final utilization = pasture.utilizationPercentage;
    if (utilization <= 70) return Colors.green;
    if (utilization <= 90) return Colors.orange;
    return Colors.red;
  }
}
