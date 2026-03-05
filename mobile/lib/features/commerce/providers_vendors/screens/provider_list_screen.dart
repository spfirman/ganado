import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/commerce/providers_vendors/models/vendor.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

final providerListProvider = FutureProvider<List<Vendor>>((ref) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/providers');
  return (response.data as List)
      .map((e) => Vendor.fromJson(e as Map<String, dynamic>))
      .toList();
});

class ProviderListScreen extends ConsumerWidget {
  const ProviderListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final providers = ref.watch(providerListProvider);

    return Scaffold(
      body: providers.when(
        data: (list) {
          if (list.isEmpty) return Center(child: Text(l10n.noData));
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: list.length,
            itemBuilder: (context, index) {
              final p = list[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  onTap: () => context.go('/providers/${p.id}/edit'),
                  leading: const CircleAvatar(child: Icon(Icons.business)),
                  title: Text(p.name),
                  subtitle: Text('${l10n.nit}: ${p.nit ?? '-'}  |  ${p.phone ?? '-'}'),
                  trailing: p.type != null
                      ? Chip(
                          label: Text(p.type!,
                              style: const TextStyle(fontSize: 10)),
                          visualDensity: VisualDensity.compact,
                        )
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
        onPressed: () => context.go('/providers/new'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
