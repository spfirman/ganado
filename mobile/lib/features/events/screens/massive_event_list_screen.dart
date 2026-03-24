import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/events/providers/event_provider.dart';
import 'package:intl/intl.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class MassiveEventListScreen extends ConsumerWidget {
  const MassiveEventListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final events = ref.watch(massiveEventListProvider);

    return Scaffold(
      body: events.when(
        data: (list) {
          if (list.isEmpty) return Center(child: Text(l10n.noData));
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: list.length,
            itemBuilder: (context, index) {
              final event = list[index];
              final isOpen = event.status == 'open';
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  onTap: () => context.go('/events/${event.id}'),
                  leading: CircleAvatar(
                    backgroundColor: isOpen ? Colors.green : Colors.grey,
                    child: Icon(
                      isOpen ? Icons.event_available : Icons.event_busy,
                      color: Colors.white,
                    ),
                  ),
                  title: Text(event.name),
                  subtitle: Text(event.description ?? ''),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Chip(
                        label: Text(event.status,
                            style: const TextStyle(fontSize: 10)),
                        visualDensity: VisualDensity.compact,
                      ),
                      if (event.createdAt != null)
                        Text(
                          DateFormat('dd/MM/yyyy').format(event.createdAt!),
                          style: Theme.of(context).textTheme.bodySmall,
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
        onPressed: () => _showCreateDialog(context, ref),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showCreateDialog(BuildContext context, WidgetRef ref) {
    final nameCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    final l10n = AppLocalizations.of(context)!;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('${l10n.create} ${l10n.events}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'Nombre')),
            const SizedBox(height: 12),
            TextField(controller: descCtrl, decoration: const InputDecoration(labelText: 'Descripcion'), maxLines: 2),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: Text(l10n.cancel)),
          FilledButton(
            onPressed: () async {
              if (nameCtrl.text.isNotEmpty) {
                await ref.read(apiClientProvider).post('/massive-events', data: {
                  'name': nameCtrl.text.trim(),
                  'description': descCtrl.text.trim().isEmpty ? null : descCtrl.text.trim(),
                });
                ref.invalidate(massiveEventListProvider);
                if (ctx.mounted) Navigator.pop(ctx);
              }
            },
            child: Text(l10n.save),
          ),
        ],
      ),
    );
  }
}
