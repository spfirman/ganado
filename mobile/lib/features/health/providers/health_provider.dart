import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/connectivity_service.dart';
import 'package:ganado_app/features/health/models/health_event.dart';
import 'package:ganado_app/features/health/repositories/health_api_repository.dart';
import 'package:ganado_app/shared/models/paged_response.dart';
import 'package:uuid/uuid.dart';

// ─── Health event list provider ───
final healthEventListProvider = StateNotifierProvider<HealthEventListNotifier,
    AsyncValue<PagedResponse<HealthEvent>>>((ref) {
  return HealthEventListNotifier(ref);
});

class HealthEventListNotifier
    extends StateNotifier<AsyncValue<PagedResponse<HealthEvent>>> {
  final Ref _ref;
  String? _cattleId;
  String? _type;
  String? _status;
  int _page = 1;

  HealthEventListNotifier(this._ref) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final isOnline = _ref.read(isOnlineProvider);
      if (isOnline) {
        final result = await _ref.read(healthApiRepositoryProvider).list(
              page: _page,
              cattleId: _cattleId,
              type: _type,
              status: _status,
            );
        state = AsyncValue.data(result);
      } else {
        throw Exception('Offline health events not yet implemented');
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void setFilters({
    String? cattleId,
    String? type,
    String? status,
  }) {
    _cattleId = cattleId;
    _type = type;
    _status = status;
    _page = 1;
    load();
  }

  void clearFilters() {
    _cattleId = null;
    _type = null;
    _status = null;
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

// ─── Single health event detail ───
final healthEventDetailProvider =
    FutureProvider.family<HealthEvent, String>((ref, id) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(healthApiRepositoryProvider).getById(id);
  }
  throw Exception('Offline health event detail not yet implemented');
});

// ─── Health events for specific cattle ───
final healthEventsByCattleProvider =
    FutureProvider.family<List<HealthEvent>, String>((ref, cattleId) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(healthApiRepositoryProvider).getByCattleId(cattleId);
  }
  throw Exception('Offline cattle health events not yet implemented');
});

// ─── Create health event ───
final createHealthEventProvider = FutureProvider.family<HealthEvent,
    Map<String, dynamic>>((ref, data) async {
  final isOnline = ref.read(isOnlineProvider);

  if (isOnline) {
    return ref.read(healthApiRepositoryProvider).create(data);
  } else {
    final id = const Uuid().v4();
    // Return a placeholder event
    return HealthEvent(
      id: id,
      idCattle: data['id_cattle'] ?? '',
      type: HealthEventType.other,
      name: data['name'] ?? '',
      eventDate: DateTime.now(),
    );
  }
});

// ─── Update health event ───
final updateHealthEventProvider = FutureProvider.family<HealthEvent,
    ({String id, Map<String, dynamic> data})>((ref, params) async {
  return ref
      .read(healthApiRepositoryProvider)
      .update(params.id, params.data);
});

// ─── Delete health event ───
final deleteHealthEventProvider = FutureProvider.family<void,
    String>((ref, id) async {
  return ref.read(healthApiRepositoryProvider).delete(id);
});
