import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/events/providers/event_provider.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class MassiveEventDetailScreen extends ConsumerWidget {
  final String eventId;

  const MassiveEventDetailScreen({super.key, required this.eventId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final event = ref.watch(massiveEventDetailProvider(eventId));
    final simpleEvents = ref.watch(simpleEventsByMassiveProvider(eventId));

    return event.when(
      data: (ev) => SingleChildScrollView(
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
                    Text(ev.name, style: Theme.of(context).textTheme.headlineSmall),
                    if (ev.description != null) ...[
                      const SizedBox(height: 8),
                      Text(ev.description!),
                    ],
                    const SizedBox(height: 8),
                    Chip(label: Text(ev.status)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: FilledButton.icon(
                    onPressed: () => context.go('/events/$eventId/apply'),
                    icon: const Icon(Icons.check_circle),
                    label: Text(l10n.applyEvent),
                  ),
                ),
                if (ev.status == 'open') ...[
                  const SizedBox(width: 12),
                  OutlinedButton.icon(
                    onPressed: () async {
                      await ref.read(apiClientProvider).patch('/massive-events/$eventId/close');
                      ref.invalidate(massiveEventDetailProvider(eventId));
                      ref.invalidate(massiveEventListProvider);
                    },
                    icon: const Icon(Icons.close),
                    label: Text(l10n.closeEvent),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 24),
            Text(l10n.simpleEvents, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            simpleEvents.when(
              data: (list) {
                if (list.isEmpty) return Text(l10n.noData);
                return Column(
                  children: list
                      .map((se) => Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            child: ListTile(
                              title: Text(se.name),
                              subtitle: Text(se.type),
                              trailing: const Icon(Icons.chevron_right),
                            ),
                          ))
                      .toList(),
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => Text('${l10n.error}: $err'),
            ),
          ],
        ),
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, _) => Center(child: Text('${l10n.error}: $err')),
    );
  }
}
