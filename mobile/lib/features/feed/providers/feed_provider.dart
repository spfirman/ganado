import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/connectivity_service.dart';
import 'package:ganado_app/features/feed/models/feed.dart';
import 'package:ganado_app/features/feed/repositories/feed_api_repository.dart';
import 'package:ganado_app/shared/models/paged_response.dart';

// ─── Feed type list provider ───
final feedTypeListProvider = StateNotifierProvider<FeedTypeListNotifier,
    AsyncValue<PagedResponse<FeedType>>>((ref) {
  return FeedTypeListNotifier(ref);
});

class FeedTypeListNotifier
    extends StateNotifier<AsyncValue<PagedResponse<FeedType>>> {
  final Ref _ref;
  String? _category;
  int _page = 1;

  FeedTypeListNotifier(this._ref) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final isOnline = _ref.read(isOnlineProvider);
      if (isOnline) {
        final result = await _ref.read(feedApiRepositoryProvider).listFeedTypes(
              page: _page,
              category: _category,
            );
        state = AsyncValue.data(result);
      } else {
        throw Exception('Offline mode not yet implemented');
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void filterByCategory(String? category) {
    _category = category;
    _page = 1;
    load();
  }

  void nextPage() {
    _page++;
    load();
  }

  Future<void> refresh() async {
    _page = 1;
    await load();
  }
}

// ─── Feeding record list provider ───
final feedingRecordListProvider = StateNotifierProvider<
    FeedingRecordListNotifier,
    AsyncValue<PagedResponse<FeedingRecord>>>((ref) {
  return FeedingRecordListNotifier(ref);
});

class FeedingRecordListNotifier
    extends StateNotifier<AsyncValue<PagedResponse<FeedingRecord>>> {
  final Ref _ref;
  DateTime? _fromDate;
  DateTime? _toDate;
  int _page = 1;

  FeedingRecordListNotifier(this._ref) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final isOnline = _ref.read(isOnlineProvider);
      if (isOnline) {
        final result =
            await _ref.read(feedApiRepositoryProvider).listFeedingRecords(
                  page: _page,
                  fromDate: _fromDate,
                  toDate: _toDate,
                );
        state = AsyncValue.data(result);
      } else {
        throw Exception('Offline mode not yet implemented');
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void filterByDateRange(DateTime? fromDate, DateTime? toDate) {
    _fromDate = fromDate;
    _toDate = toDate;
    _page = 1;
    load();
  }

  void nextPage() {
    _page++;
    load();
  }

  Future<void> refresh() async {
    _page = 1;
    await load();
  }
}

// ─── Create feed type ───
final createFeedTypeProvider =
    FutureProvider.family<FeedType, Map<String, dynamic>>((ref, data) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(feedApiRepositoryProvider).createFeedType(data);
  }
  throw Exception('Offline mode not yet implemented');
});

// ─── Create feeding record ───
final createFeedingRecordProvider = FutureProvider.family<FeedingRecord,
    Map<String, dynamic>>((ref, data) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(feedApiRepositoryProvider).createFeedingRecord(data);
  }
  throw Exception('Offline mode not yet implemented');
});

// ─── Feeding summary provider ───
final feedingSummaryProvider = FutureProvider.family<FeedingSummary,
    ({DateTime? fromDate, DateTime? toDate})>((ref, params) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(feedApiRepositoryProvider).getFeedingSummary(
          fromDate: params.fromDate,
          toDate: params.toDate,
        );
  }
  throw Exception('Offline mode not yet implemented');
});
