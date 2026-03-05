import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

final userListProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/users', queryParameters: {'page': 1, 'limit': 50});
  return response.data as Map<String, dynamic>;
});

class UserListScreen extends ConsumerWidget {
  const UserListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final users = ref.watch(userListProvider);

    return users.when(
      data: (data) {
        final items = data['items'] as List? ?? [];
        if (items.isEmpty) return Center(child: Text(l10n.noData));
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: items.length,
          itemBuilder: (context, index) {
            final u = items[index] as Map<String, dynamic>;
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                leading: CircleAvatar(
                  child: Text(
                    ((u['first_name'] ?? u['username'] ?? '?') as String)
                        .substring(0, 1)
                        .toUpperCase(),
                  ),
                ),
                title: Text('${u['first_name'] ?? ''} ${u['last_name'] ?? ''}'),
                subtitle: Text(u['username'] ?? ''),
                trailing: Icon(
                  Icons.circle,
                  size: 12,
                  color: u['active'] == true ? Colors.green : Colors.grey,
                ),
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
