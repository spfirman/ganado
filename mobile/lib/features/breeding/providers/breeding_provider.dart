import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/connectivity_service.dart';
import 'package:ganado_app/features/breeding/models/breeding_event.dart';
import 'package:ganado_app/features/breeding/repositories/breeding_api_repository.dart';
import 'package:ganado_app/shared/models/paged_response.dart';

// ─── Breeding event list provider ───
final breedingEventListProvider = StateNotifierProvider<
    BreedingEventListNotifier,
    AsyncValue<PagedResponse<BreedingEvent>>>((ref) {
  return BreedingEventListNotifier(ref);
});

class BreedingEventListNotifier
    extends StateNotifier<AsyncValue<PagedResponse<BreedingEvent>>> {
  final Ref _ref;
  String _cattleFilter = '';
  String _typeFilter = '';
  String _pregnancyStatusFilter = '';
  int _page = 1;

  BreedingEventListNotifier(this._ref) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final isOnline = _ref.read(isOnlineProvider);
      if (isOnline) {
        final result = await _ref.read(breedingApiRepositoryProvider).list(
              page: _page,
              cattleId: _cattleFilter.isNotEmpty ? _cattleFilter : null,
              type: _typeFilter.isNotEmpty ? _typeFilter : null,
              pregnancyStatus:
                  _pregnancyStatusFilter.isNotEmpty ? _pregnancyStatusFilter : null,
            );
        state = AsyncValue.data(result);
      } else {
        state = AsyncValue.error('Offline mode not yet supported', StackTrace.current);
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void setCattleFilter(String cattleId) {
    _cattleFilter = cattleId;
    _page = 1;
    load();
  }

  void setTypeFilter(String type) {
    _typeFilter = type;
    _page = 1;
    load();
  }

  void setPregnancyStatusFilter(String status) {
    _pregnancyStatusFilter = status;
    _page = 1;
    load();
  }

  void clearFilters() {
    _cattleFilter = '';
    _typeFilter = '';
    _pregnancyStatusFilter = '';
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

// ─── Single breeding event detail ───
final breedingEventDetailProvider =
    FutureProvider.family<BreedingEvent, String>((ref, id) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(breedingApiRepositoryProvider).getById(id);
  }
  throw Exception('Offline breeding event detail not yet implemented');
});

// ─── Create or update breeding event ───
final createBreedingEventProvider = FutureProvider.family<BreedingEvent,
    Map<String, dynamic>>((ref, data) async {
  final isOnline = ref.read(isOnlineProvider);
  if (!isOnline) {
    throw Exception('Cannot create breeding event while offline');
  }
  final result = await ref.read(breedingApiRepositoryProvider).create(data);
  ref.invalidate(breedingEventListProvider);
  return result;
});

final updateBreedingEventProvider = FutureProvider.family<
    BreedingEvent,
    ({
      String eventId,
      Map<String, dynamic> data,
    })>((ref, params) async {
  final isOnline = ref.read(isOnlineProvider);
  if (!isOnline) {
    throw Exception('Cannot update breeding event while offline');
  }
  final result = await ref
      .read(breedingApiRepositoryProvider)
      .update(params.eventId, params.data);
  ref.invalidate(breedingEventListProvider);
  ref.invalidate(breedingEventDetailProvider(params.eventId));
  return result;
});

// ─── Breeding history by cattle ───
final breedingHistoryByCattleProvider =
    FutureProvider.family<List<BreedingEvent>, String>((ref, cattleId) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref
        .read(breedingApiRepositoryProvider)
        .getCattleBreedingHistory(cattleId);
  }
  throw Exception('Offline breeding history not yet implemented');
});

// ─── Delete breeding event ───
final deleteBreedingEventProvider =
    FutureProvider.family<void, String>((ref, eventId) async {
  final isOnline = ref.read(isOnlineProvider);
  if (!isOnline) {
    throw Exception('Cannot delete breeding event while offline');
  }
  await ref.read(breedingApiRepositoryProvider).delete(eventId);
  ref.invalidate(breedingEventListProvider);
  ref.invalidate(breedingEventDetailProvider(eventId));
});
