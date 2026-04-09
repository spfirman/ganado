import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/breeding/models/breeding_event.dart';
import 'package:ganado_app/features/breeding/providers/breeding_provider.dart';
import 'package:intl/intl.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class BreedingListScreen extends ConsumerStatefulWidget {
  const BreedingListScreen({super.key});

  @override
  ConsumerState<BreedingListScreen> createState() => _BreedingListScreenState();
}

class _BreedingListScreenState extends ConsumerState<BreedingListScreen> {
  String _selectedType = '';

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final breedingEvents = ref.watch(breedingEventListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Breeding Events'),
        elevation: 0,
      ),
      body: breedingEvents.when(
        data: (result) {
          if (result.items.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.pets, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  Text(l10n.noData),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => ref.read(breedingEventListProvider.notifier).refresh(),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Filter chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildFilterChip(
                        label: 'All',
                        isSelected: _selectedType.isEmpty,
                        onPressed: () {
                          setState(() => _selectedType = '');
                          ref
                              .read(breedingEventListProvider.notifier)
                              .clearFilters();
                        },
                      ),
                      const SizedBox(width: 8),
                      _buildFilterChip(
                        label: 'Heat Detection',
                        isSelected: _selectedType == 'heatDetection',
                        onPressed: () {
                          setState(() => _selectedType = 'heatDetection');
                          ref
                              .read(breedingEventListProvider.notifier)
                              .setTypeFilter('heatDetection');
                        },
                      ),
                      const SizedBox(width: 8),
                      _buildFilterChip(
                        label: 'Insemination',
                        isSelected: _selectedType == 'insemination',
                        onPressed: () {
                          setState(() => _selectedType = 'insemination');
                          ref
                              .read(breedingEventListProvider.notifier)
                              .setTypeFilter('insemination');
                        },
                      ),
                      const SizedBox(width: 8),
                      _buildFilterChip(
                        label: 'Calving',
                        isSelected: _selectedType == 'calving',
                        onPressed: () {
                          setState(() => _selectedType = 'calving');
                          ref
                              .read(breedingEventListProvider.notifier)
                              .setTypeFilter('calving');
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Events list
                ...result.items.map((event) => _buildEventCard(context, event)),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Error: $err')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/breeding/new'),
        tooltip: 'New Breeding Event',
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildFilterChip({
    required String label,
    required bool isSelected,
    required VoidCallback onPressed,
  }) {
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => onPressed(),
      backgroundColor: Colors.grey[200],
      selectedColor: Theme.of(context).primaryColor.withOpacity(0.3),
      labelStyle: TextStyle(
        fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
      ),
    );
  }

  Widget _buildEventCard(BuildContext context, BreedingEvent event) {
    final dateFormat = DateFormat('dd/MM/yyyy');
    final pregnancyColor = _getPregnancyStatusColor(event.pregnancyStatus);

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: () => context.go('/breeding/${event.id}'),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Dam info and status
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Dam: ${event.cattleNumber ?? 'Unknown'}',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _eventTypeLabel(event.type),
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: Colors.grey[600],
                              ),
                        ),
                      ],
                    ),
                  ),
                  if (event.pregnancyStatus != null)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: pregnancyColor.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: pregnancyColor),
                      ),
                      child: Text(
                        _pregnancyStatusLabel(event.pregnancyStatus!),
                        style: TextStyle(
                          color: pregnancyColor,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),

              // Date and sire info
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    dateFormat.format(event.eventDate),
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  if (event.sireNumber != null)
                    Text(
                      'Sire: ${event.sireNumber}',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Colors.grey[600],
                          ),
                    ),
                ],
              ),

              // Calving details if applicable
              if (event.type == BreedingEventType.calving)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Row(
                    children: [
                      Icon(Icons.cake, size: 16, color: Colors.green[700]),
                      const SizedBox(width: 6),
                      Text(
                        '${event.calvesCount ?? 1} calf(es)',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Colors.green[700],
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  String _eventTypeLabel(BreedingEventType type) {
    switch (type) {
      case BreedingEventType.heatDetection:
        return 'Heat Detection';
      case BreedingEventType.insemination:
        return 'Insemination';
      case BreedingEventType.naturalBreeding:
        return 'Natural Breeding';
      case BreedingEventType.pregnancyCheck:
        return 'Pregnancy Check';
      case BreedingEventType.calving:
        return 'Calving';
      case BreedingEventType.weaning:
        return 'Weaning';
      case BreedingEventType.abortion:
        return 'Abortion';
    }
  }

  String _pregnancyStatusLabel(PregnancyStatus status) {
    switch (status) {
      case PregnancyStatus.open:
        return 'Open';
      case PregnancyStatus.bred:
        return 'Bred';
      case PregnancyStatus.confirmed:
        return 'Confirmed';
      case PregnancyStatus.late:
        return 'Late';
      case PregnancyStatus.calved:
        return 'Calved';
      case PregnancyStatus.aborted:
        return 'Aborted';
    }
  }

  Color _getPregnancyStatusColor(PregnancyStatus? status) {
    switch (status) {
      case PregnancyStatus.open:
        return Colors.orange;
      case PregnancyStatus.bred:
        return Colors.blue;
      case PregnancyStatus.confirmed:
        return Colors.green;
      case PregnancyStatus.late:
        return Colors.red;
      case PregnancyStatus.calved:
        return Colors.green;
      case PregnancyStatus.aborted:
        return Colors.red;
      case null:
        return Colors.grey;
    }
  }
}
