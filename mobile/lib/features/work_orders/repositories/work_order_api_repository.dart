import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/work_orders/models/work_order.dart';
import 'package:ganado_app/shared/models/paged_response.dart';

final workOrderApiRepositoryProvider =
    Provider<WorkOrderApiRepository>((ref) {
  return WorkOrderApiRepository(ref.read(apiClientProvider));
});

class WorkOrderApiRepository {
  final ApiClient _api;

  WorkOrderApiRepository(this._api);

  Future<PagedResponse<WorkOrder>> list({
    int page = 1,
    int limit = 20,
    String? status,
    String? priority,
    String? type,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (status != null) params['status'] = status;
    if (priority != null) params['priority'] = priority;
    if (type != null) params['type'] = type;

    final response = await _api.get('/work-orders', queryParameters: params);
    return PagedResponse.fromJson(
      response.data as Map<String, dynamic>,
      WorkOrder.fromJson,
    );
  }

  Future<WorkOrder> getById(String id) async {
    final response = await _api.get('/work-orders/$id');
    return WorkOrder.fromJson(response.data as Map<String, dynamic>);
  }

  Future<WorkOrder> create(Map<String, dynamic> data) async {
    final response = await _api.post('/work-orders', data: data);
    return WorkOrder.fromJson(response.data as Map<String, dynamic>);
  }

  Future<WorkOrder> update(String id, Map<String, dynamic> data) async {
    final response = await _api.patch('/work-orders/$id', data: data);
    return WorkOrder.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> delete(String id) async {
    await _api.delete('/work-orders/$id');
  }
}
