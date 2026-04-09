import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/health/models/health_event.dart';
import 'package:ganado_app/shared/models/paged_response.dart';

final healthApiRepositoryProvider = Provider<HealthApiRepository>((ref) {
  return HealthApiRepository(ref.read(apiClientProvider));
});

class HealthApiRepository {
  final ApiClient _api;

  HealthApiRepository(this._api);

  Future<PagedResponse<HealthEvent>> list({
    int page = 1,
    int limit = 20,
    String? cattleId,
    String? type,
    String? status,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (cattleId != null && cattleId.isNotEmpty) params['cattle_id'] = cattleId;
    if (type != null && type.isNotEmpty) params['type'] = type;
    if (status != null && status.isNotEmpty) params['status'] = status;
    if (dateFrom != null) params['date_from'] = dateFrom.toIso8601String();
    if (dateTo != null) params['date_to'] = dateTo.toIso8601String();

    final response = await _api.get('/health-events', queryParameters: params);
    return PagedResponse.fromJson(
      response.data as Map<String, dynamic>,
      HealthEvent.fromJson,
    );
  }

  Future<HealthEvent> getById(String id) async {
    final response = await _api.get('/health-events/$id');
    return HealthEvent.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<HealthEvent>> getByCattleId(String cattleId) async {
    final response =
        await _api.get('/cattle/$cattleId/health-events');
    return (response.data as List)
        .map((e) => HealthEvent.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<HealthEvent> create(Map<String, dynamic> data) async {
    final response = await _api.post('/health-events', data: data);
    return HealthEvent.fromJson(response.data as Map<String, dynamic>);
  }

  Future<HealthEvent> update(String id, Map<String, dynamic> data) async {
    final response = await _api.patch('/health-events/$id', data: data);
    return HealthEvent.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> delete(String id) async {
    await _api.delete('/health-events/$id');
  }
}
