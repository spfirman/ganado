import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

final deviceListProvider = FutureProvider<List<dynamic>>((ref) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/devices');
  return response.data as List;
});

class DeviceListScreen extends ConsumerWidget {
  const DeviceListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final devices = ref.watch(deviceListProvider);

    return devices.when(
      data: (list) {
        if (list.isEmpty) return Center(child: Text(l10n.noData));
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: list.length,
          itemBuilder: (context, index) {
            final d = list[index] as Map<String, dynamic>;
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                leading: const CircleAvatar(child: Icon(Icons.sensors)),
                title: Text(d['name'] ?? d['dev_eui'] ?? 'Dispositivo'),
                subtitle: Text('DevEUI: ${d['dev_eui'] ?? '-'}'),
                trailing: Icon(
                  Icons.circle,
                  size: 12,
                  color: d['active'] == true ? Colors.green : Colors.grey,
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
