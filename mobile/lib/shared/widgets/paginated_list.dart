import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PaginatedList<T> extends StatefulWidget {
  final Future<PaginatedResult<T>> Function(int page, int limit) fetchPage;
  final Widget Function(BuildContext context, T item) itemBuilder;
  final int pageSize;

  const PaginatedList({
    super.key,
    required this.fetchPage,
    required this.itemBuilder,
    this.pageSize = 20,
  });

  @override
  State<PaginatedList<T>> createState() => _PaginatedListState<T>();
}

class _PaginatedListState<T> extends State<PaginatedList<T>> {
  final List<T> _items = [];
  int _currentPage = 1;
  bool _isLoading = false;
  bool _hasMore = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadPage();
  }

  Future<void> _loadPage() async {
    if (_isLoading || !_hasMore) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final result = await widget.fetchPage(_currentPage, widget.pageSize);
      setState(() {
        _items.addAll(result.items);
        _hasMore = result.items.length >= widget.pageSize;
        _currentPage++;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _refresh() async {
    setState(() {
      _items.clear();
      _currentPage = 1;
      _hasMore = true;
    });
    await _loadPage();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    if (_items.isEmpty && _isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_items.isEmpty && _error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_error!),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadPage,
              child: Text(l10n.retry),
            ),
          ],
        ),
      );
    }

    if (_items.isEmpty) {
      return Center(child: Text(l10n.noData));
    }

    return RefreshIndicator(
      onRefresh: _refresh,
      child: ListView.builder(
        itemCount: _items.length + (_hasMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == _items.length) {
            _loadPage();
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: CircularProgressIndicator(),
              ),
            );
          }
          return widget.itemBuilder(context, _items[index]);
        },
      ),
    );
  }
}

class PaginatedResult<T> {
  final List<T> items;
  final int total;

  PaginatedResult({required this.items, required this.total});
}
