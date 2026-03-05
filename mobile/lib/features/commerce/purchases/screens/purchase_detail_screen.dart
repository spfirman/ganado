import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/commerce/purchases/providers/purchase_provider.dart';
import 'package:intl/intl.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PurchaseDetailScreen extends ConsumerWidget {
  final String purchaseId;

  const PurchaseDetailScreen({super.key, required this.purchaseId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final purchase = ref.watch(purchaseDetailProvider(purchaseId));

    return purchase.when(
      data: (p) => SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(p.providerName ?? '-',
                        style: Theme.of(context).textTheme.headlineSmall),
                    const SizedBox(height: 8),
                    _row(l10n.status, p.status ?? '-'),
                    _row('${l10n.total} Animales', '${p.totalAnimals ?? 0}'),
                    _row(l10n.weight, '${p.totalWeight?.toStringAsFixed(1) ?? 0} kg'),
                    _row(l10n.price, '\$${p.totalPrice?.toStringAsFixed(0) ?? 0}'),
                    if (p.purchaseDate != null)
                      _row(l10n.date,
                          DateFormat('dd/MM/yyyy').format(p.purchaseDate!)),
                    if (p.comments != null) _row(l10n.comments, p.comments!),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () =>
                        context.go('/purchases/$purchaseId/edit'),
                    icon: const Icon(Icons.edit),
                    label: Text(l10n.edit),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton.icon(
                    onPressed: () =>
                        context.go('/receptions/$purchaseId'),
                    icon: const Icon(Icons.move_down),
                    label: Text(l10n.receiveAnimals),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, _) => Center(child: Text('${l10n.error}: $err')),
    );
  }

  Widget _row(String label, String value) {
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
}
