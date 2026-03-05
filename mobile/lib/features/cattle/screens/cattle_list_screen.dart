import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/cattle/providers/cattle_provider.dart';
import 'package:ganado_app/features/cattle/widgets/cattle_card.dart';
import 'package:ganado_app/shared/widgets/search_bar.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class CattleListScreen extends ConsumerWidget {
  const CattleListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final cattleList = ref.watch(cattleListProvider);

    return Column(
      children: [
        AppSearchBar(
          onSearch: (query) =>
              ref.read(cattleListProvider.notifier).setSearch(query),
        ),
        Expanded(
          child: cattleList.when(
            data: (result) {
              if (result.items.isEmpty) {
                return Center(child: Text(l10n.noData));
              }
              return RefreshIndicator(
                onRefresh: () =>
                    ref.read(cattleListProvider.notifier).refresh(),
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: result.items.length,
                  itemBuilder: (context, index) {
                    final cattle = result.items[index];
                    return CattleCard(
                      cattle: cattle,
                      onTap: () => context.go('/cattle/${cattle.id}'),
                    );
                  },
                ),
              );
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('${l10n.error}: $error'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () =>
                        ref.read(cattleListProvider.notifier).load(),
                    child: Text(l10n.retry),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
