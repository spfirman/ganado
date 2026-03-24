import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/connectivity_service.dart';
import 'package:ganado_app/features/cattle/models/cattle.dart';
import 'package:ganado_app/features/cattle/repositories/cattle_api_repository.dart';
import 'package:ganado_app/features/cattle/repositories/cattle_local_repository.dart';
import 'package:ganado_app/shared/models/paged_response.dart';
import 'package:uuid/uuid.dart';

// ─── Cattle list provider ───
final cattleListProvider = StateNotifierProvider<CattleListNotifier,
    AsyncValue<PagedResponse<Cattle>>>((ref) {
  return CattleListNotifier(ref);
});

class CattleListNotifier
    extends StateNotifier<AsyncValue<PagedResponse<Cattle>>> {
  final Ref _ref;
  String _search = '';
  int _page = 1;

  CattleListNotifier(this._ref) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final isOnline = _ref.read(isOnlineProvider);
      if (isOnline || kIsWeb) {
        final result = await _ref.read(cattleApiRepositoryProvider).list(
              page: _page,
              search: _search.isNotEmpty ? _search : null,
            );
        // Cache to local DB (skip on web — no SQLite)
        if (!kIsWeb) {
          await _ref.read(cattleLocalRepositoryProvider).upsertMany(result.items);
        }
        state = AsyncValue.data(result);
      } else {
        // Offline: load from local DB (mobile only)
        final local = await _ref.read(cattleLocalRepositoryProvider).getAll();
        state = AsyncValue.data(PagedResponse(
          items: [],
          total: local.length,
          page: 1,
          limit: 50,
        ));
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void setSearch(String query) {
    _search = query;
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

// ─── Single cattle detail ───
final cattleDetailProvider =
    FutureProvider.family<Cattle, String>((ref, id) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline || kIsWeb) {
    final cattle = await ref.read(cattleApiRepositoryProvider).getById(id);
    if (!kIsWeb) {
      await ref.read(cattleLocalRepositoryProvider).upsert(cattle);
    }
    return cattle;
  }
  // Offline fallback would need model conversion
  throw Exception('Offline cattle detail not yet implemented');
});

// ─── Create cattle ───
final createCattleProvider =
    FutureProvider.family<Cattle, Map<String, dynamic>>((ref, data) async {
  final isOnline = ref.read(isOnlineProvider);

  if (isOnline || kIsWeb) {
    return ref.read(cattleApiRepositoryProvider).create(data);
  } else {
    final localRepo = ref.read(cattleLocalRepositoryProvider);
    final id = const Uuid().v4();
    await localRepo.createOffline(data, id);
    return Cattle(
      id: id,
      idTenant: '',
      sysNumber: '',
      number: data['number'] ?? '',
    );
  }
});

// ─── Record weight ───
final recordWeightProvider = FutureProvider.family<CattleWeightHistory,
    ({String cattleId, Map<String, dynamic> data})>((ref, params) async {
  return ref
      .read(cattleApiRepositoryProvider)
      .recordWeight(params.cattleId, params.data);
});

// ─── Add medication ───
final addMedicationProvider = FutureProvider.family<CattleMedicationHistory,
    ({String cattleId, Map<String, dynamic> data})>((ref, params) async {
  return ref
      .read(cattleApiRepositoryProvider)
      .addMedication(params.cattleId, params.data);
});
