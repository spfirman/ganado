import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/commerce/sales/models/sale.dart';
import 'package:intl/intl.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

final saleListProvider = FutureProvider<List<Sale>>((ref) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/sales', queryParameters: {'page': 1, 'limit': 50});
  final data = response.data as Map<String, dynamic>;
  return (data['items'] as List)
      .map((e) => Sale.fromJson(e as Map<String, dynamic>))
      .toList();
});

class SaleListScreen extends ConsumerWidget {
  const SaleListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final sales = ref.watch(saleListProvider);

    return Scaffold(
      body: sales.when(
        data: (list) {
          if (list.isEmpty) return Center(child: Text(l10n.noData));
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: list.length,
            itemBuilder: (context, index) {
              final s = list[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  title: Text(s.buyerName ?? '-'),
                  subtitle: Text(
                    '${s.totalAnimals ?? 0} animales  |  \$${s.totalPrice?.toStringAsFixed(0) ?? 0}',
                  ),
                  trailing: s.saleDate != null
                      ? Text(DateFormat('dd/MM/yyyy').format(s.saleDate!),
                          style: Theme.of(context).textTheme.bodySmall)
                      : null,
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('${l10n.error}: $err')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/sales/new'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
