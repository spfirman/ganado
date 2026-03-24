import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/sync/sync_engine.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class SyncStatusBanner extends ConsumerWidget {
  const SyncStatusBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pendingCount = ref.watch(pendingSyncCountProvider);
    final l10n = AppLocalizations.of(context)!;

    return pendingCount.when(
      data: (count) {
        if (count == 0) return const SizedBox.shrink();
        return Material(
          color: Theme.of(context).colorScheme.tertiaryContainer,
          child: InkWell(
            onTap: () => ref.read(syncEngineProvider).syncAll(),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              child: Row(
                children: [
                  const Icon(Icons.sync, size: 18),
                  const SizedBox(width: 8),
                  Expanded(child: Text(l10n.pendingSync(count))),
                  const Icon(Icons.chevron_right, size: 18),
                ],
              ),
            ),
          ),
        );
      },
      loading: () => const SizedBox.shrink(),
      error: (_, __) => const SizedBox.shrink(),
    );
  }
}
