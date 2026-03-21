import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/config/app_config.dart';
import 'package:ganado_app/core/sync/sync_engine.dart';
import 'package:ganado_app/core/network/connectivity_service.dart';
import 'package:ganado_app/features/settings/presentation/widgets/language_selector.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final isOnline = ref.watch(isOnlineProvider);
    final pendingSync = ref.watch(pendingSyncCountProvider);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Connection status
        Card(
          child: ListTile(
            leading: Icon(
              isOnline ? Icons.cloud_done : Icons.cloud_off,
              color: isOnline ? Colors.green : Colors.red,
            ),
            title: Text(isOnline ? 'Conectado' : l10n.offline),
            subtitle: Text('API: ${AppConfig.current.apiBaseUrl}'),
          ),
        ),
        const SizedBox(height: 8),

        // Sync status
        Card(
          child: ListTile(
            leading: const Icon(Icons.sync),
            title: Text('Sincronizacion'),
            subtitle: pendingSync.when(
              data: (count) => Text(
                count > 0 ? l10n.pendingSync(count) : l10n.syncComplete,
              ),
              loading: () => Text(l10n.loading),
              error: (_, __) => Text(l10n.error),
            ),
            trailing: FilledButton(
              onPressed: () => ref.read(syncEngineProvider).syncAll(),
              child: Text(l10n.syncing),
            ),
          ),
        ),
        const SizedBox(height: 8),

        // Language selector
        const LanguageSelector(),
        const SizedBox(height: 8),

        // App info
        Card(
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.info_outline),
                title: const Text('Ganado App'),
                subtitle: const Text('Version 0.1.0+1'),
              ),
              ListTile(
                leading: const Icon(Icons.dns),
                title: const Text('Entorno'),
                subtitle: Text(AppConfig.current.environment.name),
              ),
              ListTile(
                leading: const Icon(Icons.router),
                title: const Text('MQTT Broker'),
                subtitle: Text(
                  '${AppConfig.current.mqttBrokerHost}:${AppConfig.current.mqttBrokerPort}',
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
