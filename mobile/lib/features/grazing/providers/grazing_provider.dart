import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/connectivity_service.dart';
import 'package:ganado_app/features/grazing/models/pasture.dart';
import 'package:ganado_app/features/grazing/repositories/grazing_api_repository.dart';
import 'package:ganado_app/shared/models/paged_response.dart';

// ─── Pasture list provider ───
final pastureListProvider = StateNotifierProvider<PastureListNotifier,
    AsyncValue<PagedResponse<Pasture>>>((ref) {
  return PastureListNotifier(ref);
});

class PastureListNotifier
    extends StateNotifier<AsyncValue<PagedResponse<Pasture>>> {
  final Ref _ref;
  String? _status;
  int _page = 1;

  PastureListNotifier(this._ref) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final isOnline = _ref.read(isOnlineProvider);
      if (isOnline) {
        final result = await _ref.read(grazingApiRepositoryProvider).listPastures(
              page: _page,
              status: _status,
            );
        state = AsyncValue.data(result);
      } else {
        throw Exception('Offline mode not yet implemented');
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void filterByStatus(String? status) {
    _status = status;
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

// ─── Single pasture detail ───
final pastureDetailProvider =
    FutureProvider.family<Pasture, String>((ref, id) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(grazingApiRepositoryProvider).getPastureById(id);
  }
  throw Exception('Offline mode not yet implemented');
});

// ─── Create pasture ───
final createPastureProvider =
    FutureProvider.family<Pasture, Map<String, dynamic>>((ref, data) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(grazingApiRepositoryProvider).createPasture(data);
  }
  throw Exception('Offline mode not yet implemented');
});

// ─── Grazing rotation list for pasture ───
final grazingRotationListProvider =
    FutureProvider.family<List<GrazingRotation>, String>((ref, pastureId) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(grazingApiRepositoryProvider).getRotations(pastureId);
  }
  throw Exception('Offline mode not yet implemented');
});

// ─── Create grazing rotation ───
final createRotationProvider = FutureProvider.family<GrazingRotation,
    Map<String, dynamic>>((ref, data) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(grazingApiRepositoryProvider).createRotation(data);
  }
  throw Exception('Offline mode not yet implemented');
});
