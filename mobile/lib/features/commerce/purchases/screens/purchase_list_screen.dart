import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/commerce/purchases/providers/purchase_provider.dart';
import 'package:intl/intl.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class PurchaseListScreen extends ConsumerWidget {
  const PurchaseListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final purchases = ref.watch(purchaseListProvider);

    return Scaffold(
      body: purchases.when(
        data: (result) {
          if (result.items.isEmpty) return Center(child: Text(l10n.noData));
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: result.items.length,
            itemBuilder: (context, index) {
              final p = result.items[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  onTap: () => context.go('/purchases/${p.id}'),
                  title: Text(p.providerName ?? 'Proveedor desconocido'),
                  subtitle: Text(
                    '${p.totalAnimals ?? 0} animales  |  ${p.totalWeight?.toStringAsFixed(1) ?? 0} kg',
                  ),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      if (p.purchaseDate != null)
                        Text(
                          DateFormat('dd/MM/yyyy').format(p.purchaseDate!),
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      Chip(
                        label: Text(p.status ?? 'draft',
                            style: const TextStyle(fontSize: 10)),
                        visualDensity: VisualDensity.compact,
                        padding: EdgeInsets.zero,
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('${l10n.error}: $err')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/purchases/new'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
