import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/connectivity_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class OfflineIndicator extends ConsumerWidget {
  const OfflineIndicator({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isOnline = ref.watch(isOnlineProvider);
    final l10n = AppLocalizations.of(context)!;

    if (isOnline) return const SizedBox.shrink();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 16),
      color: Theme.of(context).colorScheme.error,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.cloud_off,
            size: 16,
            color: Theme.of(context).colorScheme.onError,
          ),
          const SizedBox(width: 8),
          Text(
            l10n.offline,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onError,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
