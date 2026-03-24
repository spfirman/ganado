import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

final roleListProvider = FutureProvider<List<dynamic>>((ref) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/roles');
  return response.data as List;
});

class RoleListScreen extends ConsumerWidget {
  const RoleListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final roles = ref.watch(roleListProvider);

    return roles.when(
      data: (list) {
        if (list.isEmpty) return Center(child: Text(l10n.noData));
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: list.length,
          itemBuilder: (context, index) {
            final r = list[index] as Map<String, dynamic>;
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                leading: const CircleAvatar(
                    child: Icon(Icons.admin_panel_settings)),
                title: Text(r['name'] ?? '-'),
                subtitle: Text(r['description'] ?? ''),
                trailing: Text(r['code'] ?? '',
                    style: Theme.of(context).textTheme.bodySmall),
              ),
            );
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, _) => Center(child: Text('${l10n.error}: $err')),
    );
  }
}
