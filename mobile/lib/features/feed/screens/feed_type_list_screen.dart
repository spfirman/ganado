import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/feed/models/feed.dart';
import 'package:ganado_app/features/feed/providers/feed_provider.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class FeedTypeListScreen extends ConsumerStatefulWidget {
  const FeedTypeListScreen({super.key});

  @override
  ConsumerState<FeedTypeListScreen> createState() =>
      _FeedTypeListScreenState();
}

class _FeedTypeListScreenState extends ConsumerState<FeedTypeListScreen> {
  String? _selectedCategory;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final feedTypeList = ref.watch(feedTypeListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Gestión de Alimento'),
        elevation: 0,
      ),
      body: Column(
        children: [
          _buildCategoryFilter(context),
          Expanded(
            child: feedTypeList.when(
              data: (result) {
                if (result.items.isEmpty) {
                  return Center(
                    child: Text(l10n.noData),
                  );
                }
                return RefreshIndicator(
                  onRefresh: () =>
                      ref.read(feedTypeListProvider.notifier).refresh(),
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: result.items.length,
                    itemBuilder: (context, index) {
                      final feedType = result.items[index];
                      return _FeedTypeCard(feedType: feedType);
                    },
                  ),
                );
              },
              loading: () =>
                  const Center(child: CircularProgressIndicator()),
              error: (error, _) => Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('${l10n.error}: $error'),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () =>
                          ref.read(feedTypeListProvider.notifier).load(),
                      child: Text(l10n.retry),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/feed-types/create'),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildCategoryFilter(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          FilterChip(
            label: const Text('All'),
            selected: _selectedCategory == null,
            onSelected: (selected) {
              setState(() => _selectedCategory = null);
              ref
                  .read(feedTypeListProvider.notifier)
                  .filterByCategory(null);
            },
          ),
          const SizedBox(width: 8),
          ...FeedCategory.values.map((category) {
            final label = category.name.replaceFirst(
              category.name[0],
              category.name[0].toUpperCase(),
            );
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: FilterChip(
                label: Text(label),
                selected: _selectedCategory == category.name,
                onSelected: (selected) {
                  setState(() => _selectedCategory = category.name);
                  ref
                      .read(feedTypeListProvider.notifier)
                      .filterByCategory(category.name);
                },
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _FeedTypeCard extends StatelessWidget {
  final FeedType feedType;

  const _FeedTypeCard({required this.feedType});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        feedType.name,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        feedType.categoryLabel,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Chip(
                  label: Text(
                    feedType.isOutOfStock
                        ? 'Out of Stock'
                        : feedType.isLowStock
                            ? 'Low Stock'
                            : 'In Stock',
                  ),
                  backgroundColor: _getStockColor().withOpacity(0.2),
                  labelStyle: TextStyle(
                    color: _getStockColor(),
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                  padding: EdgeInsets.zero,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Price per ${feedType.unit}',
                      style: theme.textTheme.labelSmall,
                    ),
                    Text(
                      '\$${feedType.pricePerUnit.toStringAsFixed(2)}',
                      style: theme.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      'In Stock',
                      style: theme.textTheme.labelSmall,
                    ),
                    Text(
                      '${feedType.inStock.toStringAsFixed(1)} ${feedType.unit}',
                      style: theme.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            if (feedType.nutritionalInfo != null) ...[
              const SizedBox(height: 8),
              Text(
                'Nutritional Info: ${feedType.nutritionalInfo}',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: Colors.grey[600],
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Color _getStockColor() {
    if (feedType.isOutOfStock) return Colors.red;
    if (feedType.isLowStock) return Colors.orange;
    return Colors.green;
  }
}
