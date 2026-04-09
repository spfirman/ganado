import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/breeding/models/breeding_event.dart';
import 'package:ganado_app/features/breeding/providers/breeding_provider.dart';
import 'package:intl/intl.dart';

class BreedingDetailScreen extends ConsumerWidget {
  final String eventId;

  const BreedingDetailScreen({super.key, required this.eventId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final eventAsync = ref.watch(breedingEventDetailProvider(eventId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Breeding Event'),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => context.go('/breeding/$eventId/edit'),
          ),
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () => _showDeleteDialog(context, ref),
          ),
        ],
      ),
      body: eventAsync.when(
        data: (event) => SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with dam and sire info
              _buildHeader(context, event),
              const SizedBox(height: 16),

              // Event type and date
              _buildEventInfo(context, event),
              const SizedBox(height: 16),

              // Pregnancy timeline if applicable
              if (event.type != BreedingEventType.calving &&
                  event.expectedCalvingDate != null)
                _buildPregnancyTimeline(context, event),

              // Calving details if applicable
              if (event.type == BreedingEventType.calving ||
                  event.actualCalvingDate != null)
                _buildCalvingDetails(context, event),

              // Calf information if applicable
              if (event.calfId != null || event.calfBirthWeight != null)
                _buildCalfInfo(context, event),

              // Insemination details if applicable
              if (event.inseminationType != null)
                _buildInseminationDetails(context, event),

              // Notes
              if (event.notes != null && event.notes!.isNotEmpty)
                _buildNotesSection(context, event),

              const SizedBox(height: 32),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Error: $err')),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, BreedingEvent event) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor.withOpacity(0.1),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(12),
          bottomRight: Radius.circular(12),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Dam: ${event.cattleNumber ?? "Unknown"}',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 8),
          if (event.sireNumber != null)
            Text(
              'Sire: ${event.sireNumber}',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
          if (event.pregnancyStatus != null) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: _getPregnancyStatusColor(event.pregnancyStatus)
                    .withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                _pregnancyStatusLabel(event.pregnancyStatus!),
                style: TextStyle(
                  color:
                      _getPregnancyStatusColor(event.pregnancyStatus),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildEventInfo(BuildContext context, BreedingEvent event) {
    final dateFormat = DateFormat('EEEE, dd MMMM yyyy');
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Event Details',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 12),
          _infoRow('Type', _eventTypeLabel(event.type)),
          _infoRow('Date', dateFormat.format(event.eventDate)),
          if (event.technician != null)
            _infoRow('Technician', event.technician!),
        ],
      ),
    );
  }

  Widget _buildPregnancyTimeline(BuildContext context, BreedingEvent event) {
    final dateFormat = DateFormat('dd/MM/yyyy');
    final daysPregnant =
        DateTime.now().difference(event.eventDate).inDays;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Pregnancy Timeline',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey[300]!),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              children: [
                _infoRow(
                  'Breeding Date',
                  dateFormat.format(event.eventDate),
                ),
                const SizedBox(height: 8),
                _infoRow(
                  'Expected Calving',
                  event.expectedCalvingDate != null
                      ? dateFormat.format(event.expectedCalvingDate!)
                      : 'Not set',
                ),
                const SizedBox(height: 8),
                _infoRow(
                  'Days Since Breeding',
                  '$daysPregnant days',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCalvingDetails(BuildContext context, BreedingEvent event) {
    if (event.type != BreedingEventType.calving &&
        event.actualCalvingDate == null) {
      return const SizedBox.shrink();
    }

    final dateFormat = DateFormat('dd/MM/yyyy');
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Calving Details',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.green[300]!),
              borderRadius: BorderRadius.circular(8),
              color: Colors.green[50],
            ),
            child: Column(
              children: [
                if (event.actualCalvingDate != null)
                  _infoRow(
                    'Calving Date',
                    dateFormat.format(event.actualCalvingDate!),
                  ),
                if (event.calvingDifficulty != null) ...[
                  const SizedBox(height: 8),
                  _infoRow('Difficulty', event.calvingDifficulty!),
                ],
                if (event.calvesCount != null) ...[
                  const SizedBox(height: 8),
                  _infoRow('Number of Calves', '${event.calvesCount}'),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCalfInfo(BuildContext context, BreedingEvent event) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Calf Information',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.blue[300]!),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              children: [
                if (event.calfId != null)
                  _infoRow('Calf ID', event.calfId!),
                if (event.calfGender != null) ...[
                  const SizedBox(height: 8),
                  _infoRow('Gender', event.calfGender!),
                ],
                if (event.calfBirthWeight != null) ...[
                  const SizedBox(height: 8),
                  _infoRow(
                    'Birth Weight',
                    '${event.calfBirthWeight!.toStringAsFixed(1)} kg',
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInseminationDetails(BuildContext context, BreedingEvent event) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Insemination Details',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.purple[300]!),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              children: [
                _infoRow('Type', event.inseminationType ?? 'N/A'),
                if (event.semenBatch != null) ...[
                  const SizedBox(height: 8),
                  _infoRow('Semen Batch', event.semenBatch!),
                ],
                if (event.technician != null) ...[
                  const SizedBox(height: 8),
                  _infoRow('Technician', event.technician!),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotesSection(BuildContext context, BreedingEvent event) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Notes',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              event.notes ?? '',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        Text(value),
      ],
    );
  }

  Future<void> _showDeleteDialog(BuildContext context, WidgetRef ref) {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Breeding Event'),
        content: const Text('Are you sure you want to delete this event?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              try {
                await ref
                    .read(deleteBreedingEventProvider(eventId).future);
                if (context.mounted) {
                  Navigator.pop(context);
                  context.go('/breeding');
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error: $e')),
                  );
                }
              }
            },
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
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
