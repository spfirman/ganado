import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/health/models/health_event.dart';
import 'package:ganado_app/features/health/providers/health_provider.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class HealthEventDetailScreen extends ConsumerWidget {
  final String eventId;

  const HealthEventDetailScreen({super.key, required this.eventId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final eventAsync = ref.watch(healthEventDetailProvider(eventId));

    return eventAsync.when(
      data: (event) => Scaffold(
        appBar: AppBar(
          title: const Text('Detalles del Evento'),
          actions: [
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () => context.go('/health-events/$eventId/edit'),
            ),
            PopupMenuButton(
              itemBuilder: (context) => [
                PopupMenuItem(
                  child: const Text('Delete'),
                  onTap: () => _showDeleteDialog(context, ref, event),
                ),
              ],
            ),
          ],
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  event.name,
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineMedium,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Cattle: #${event.cattleNumber ?? event.idCattle}',
                                  style: Theme.of(context).textTheme.bodySmall,
                                ),
                              ],
                            ),
                          ),
                          Chip(
                            label: Text(
                              event.status?.toUpperCase() ?? 'PENDING',
                            ),
                            backgroundColor:
                                _getStatusColor(event.status),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Event info card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Event Information',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 12),
                      _infoRow('Type', _getTypeLabel(event.type)),
                      _infoRow('Event Date',
                          _formatDate(event.eventDate)),
                      if (event.description != null)
                        _infoRow('Description', event.description!),
                      if (event.diagnosis != null)
                        _infoRow('Diagnosis', event.diagnosis!),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Medical info card
              if (event.medication != null ||
                  event.dosage != null ||
                  event.veterinarian != null ||
                  event.cost != null)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Medical Details',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 12),
                        if (event.medication != null)
                          _infoRow('Medication', event.medication!),
                        if (event.dosage != null)
                          _infoRow('Dosage', event.dosage!),
                        if (event.veterinarian != null)
                          _infoRow('Veterinarian', event.veterinarian!),
                        if (event.cost != null)
                          _infoRow('Cost', '\$${event.cost?.toStringAsFixed(2) ?? '0.00'}'),
                      ],
                    ),
                  ),
                ),
              const SizedBox(height: 16),

              // Follow-up info
              if (event.followUpDate != null)
                Card(
                  color: Colors.orange.shade50,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Follow-up Required',
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(color: Colors.orange.shade900),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Follow-up Date: ${_formatDate(event.followUpDate!)}',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                ),
              const SizedBox(height: 16),

              // Notes section
              if (event.notes != null && event.notes!.isNotEmpty) ...[
                Text(
                  'Notes',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(event.notes!),
                ),
                const SizedBox(height: 24),
              ],
            ],
          ),
        ),
      ),
      loading: () => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      error: (error, _) => Scaffold(
        body: Center(child: Text('Error: $error')),
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
            ),
          ),
        ],
      ),
    );
  }

  String _getTypeLabel(HealthEventType type) {
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

  void _showDeleteDialog(
    BuildContext context,
    WidgetRef ref,
    HealthEvent event,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Event'),
        content:
            const Text('Are you sure you want to delete this health event?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref
                  .read(deleteHealthEventProvider(event.id).future)
                  .then((_) {
                if (context.mounted) {
                  Navigator.pop(context);
                  context.go('/health-events');
                }
              });
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
