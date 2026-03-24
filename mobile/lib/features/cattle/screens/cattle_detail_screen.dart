export 'package:ganado_app/features/cattle/models/cattle.dart' show CattleStatus;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/cattle/models/cattle.dart';
import 'package:ganado_app/features/cattle/providers/cattle_provider.dart';
import 'package:ganado_app/features/cattle/widgets/weight_chart.dart';
import 'package:ganado_app/features/cattle/widgets/medication_list.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class CattleDetailScreen extends ConsumerWidget {
  final String cattleId;

  const CattleDetailScreen({super.key, required this.cattleId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final cattleAsync = ref.watch(cattleDetailProvider(cattleId));

    return cattleAsync.when(
      data: (cattle) => SingleChildScrollView(
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
                        Text(
                          '#${cattle.number}',
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        Chip(
                          label: Text(cattle.status.name.toUpperCase()),
                          backgroundColor: cattle.status == CattleStatus.active
                              ? Colors.green.shade100
                              : Colors.grey.shade200,
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text('Sys: ${cattle.sysNumber}',
                        style: Theme.of(context).textTheme.bodySmall),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Info grid
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _infoRow(l10n.weight, '${cattle.lastWeight} kg'),
                    _infoRow(l10n.gender, cattle.gender?.name ?? '-'),
                    _infoRow(l10n.color, cattle.color?.name ?? '-'),
                    _infoRow(l10n.castrated, cattle.castrated ? 'Si' : 'No'),
                    _infoRow(l10n.eartag,
                        '${cattle.eartagLeft ?? '-'} / ${cattle.eartagRight ?? '-'}'),
                    if (cattle.comments != null)
                      _infoRow(l10n.comments, cattle.comments!),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Action buttons
            Row(
              children: [
                Expanded(
                  child: FilledButton.icon(
                    onPressed: () => _showWeightDialog(context, ref),
                    icon: const Icon(Icons.scale),
                    label: Text(l10n.recordWeight),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _showMedicationDialog(context, ref),
                    icon: const Icon(Icons.medication),
                    label: Text(l10n.addMedication),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => context.go('/cattle/${cattle.id}/edit'),
                icon: const Icon(Icons.edit),
                label: Text(l10n.edit),
              ),
            ),
            const SizedBox(height: 24),

            // Weight history chart
            if (cattle.weightHistory != null &&
                cattle.weightHistory!.isNotEmpty) ...[
              Text(l10n.weight,
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              SizedBox(
                height: 200,
                child: WeightChart(weightHistory: cattle.weightHistory!),
              ),
              const SizedBox(height: 24),
            ],

            // Medication history
            if (cattle.medicationHistory != null &&
                cattle.medicationHistory!.isNotEmpty) ...[
              Text(l10n.medication,
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              MedicationList(medications: cattle.medicationHistory!),
            ],
          ],
        ),
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(child: Text('${l10n.error}: $error')),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
          Text(value),
        ],
      ),
    );
  }

  void _showWeightDialog(BuildContext context, WidgetRef ref) {
    final controller = TextEditingController();
    final l10n = AppLocalizations.of(context)!;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n.recordWeight),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            labelText: '${l10n.weight} (kg)',
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(l10n.cancel),
          ),
          FilledButton(
            onPressed: () {
              final weight = double.tryParse(controller.text);
              if (weight != null && weight > 0) {
                ref.read(recordWeightProvider((
                  cattleId: cattleId,
                  data: {'weight': weight},
                )));
                Navigator.pop(context);
                ref.invalidate(cattleDetailProvider(cattleId));
              }
            },
            child: Text(l10n.save),
          ),
        ],
      ),
    );
  }

  void _showMedicationDialog(BuildContext context, WidgetRef ref) {
    final medicationController = TextEditingController();
    final dosageController = TextEditingController();
    final l10n = AppLocalizations.of(context)!;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n.addMedication),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: medicationController,
              decoration: InputDecoration(labelText: l10n.medication),
              autofocus: true,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: dosageController,
              decoration: const InputDecoration(labelText: 'Dosis'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(l10n.cancel),
          ),
          FilledButton(
            onPressed: () {
              if (medicationController.text.isNotEmpty) {
                ref.read(addMedicationProvider((
                  cattleId: cattleId,
                  data: {
                    'medication': medicationController.text,
                    'dosage': dosageController.text,
                  },
                )));
                Navigator.pop(context);
                ref.invalidate(cattleDetailProvider(cattleId));
              }
            },
            child: Text(l10n.save),
          ),
        ],
      ),
    );
  }
}

