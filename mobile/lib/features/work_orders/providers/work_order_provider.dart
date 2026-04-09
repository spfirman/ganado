import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/connectivity_service.dart';
import 'package:ganado_app/features/work_orders/models/work_order.dart';
import 'package:ganado_app/features/work_orders/repositories/work_order_api_repository.dart';
import 'package:ganado_app/shared/models/paged_response.dart';

// ─── Work order list provider ───
final workOrderListProvider = StateNotifierProvider<WorkOrderListNotifier,
    AsyncValue<PagedResponse<WorkOrder>>>((ref) {
  return WorkOrderListNotifier(ref);
});

class WorkOrderListNotifier
    extends StateNotifier<AsyncValue<PagedResponse<WorkOrder>>> {
  final Ref _ref;
  String? _status;
  String? _priority;
  int _page = 1;

  WorkOrderListNotifier(this._ref) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final isOnline = _ref.read(isOnlineProvider);
      if (isOnline) {
        final result = await _ref.read(workOrderApiRepositoryProvider).list(
              page: _page,
              status: _status,
              priority: _priority,
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

  void filterByPriority(String? priority) {
    _priority = priority;
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

// ─── Single work order detail ───
final workOrderDetailProvider =
    FutureProvider.family<WorkOrder, String>((ref, id) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(workOrderApiRepositoryProvider).getById(id);
  }
  throw Exception('Offline mode not yet implemented');
});

// ─── Create work order ───
final createWorkOrderProvider =
    FutureProvider.family<WorkOrder, Map<String, dynamic>>((ref, data) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(workOrderApiRepositoryProvider).create(data);
  }
  throw Exception('Offline mode not yet implemented');
});

// ─── Update work order status ───
final updateWorkOrderStatusProvider = FutureProvider.family<
    WorkOrder,
    ({String id, WorkOrderStatus status})>((ref, params) async {
  final isOnline = ref.read(isOnlineProvider);
  if (isOnline) {
    return ref.read(workOrderApiRepositoryProvider).update(params.id, {
      'status': params.status.name,
    });
  }
  throw Exception('Offline mode not yet implemented');
});
