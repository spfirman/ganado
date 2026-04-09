import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/breeding/models/breeding_event.dart';
import 'package:ganado_app/shared/models/paged_response.dart';

final breedingApiRepositoryProvider = Provider<BreedingApiRepository>((ref) {
  return BreedingApiRepository(ref.read(apiClientProvider));
});

class BreedingApiRepository {
  final ApiClient _api;

  BreedingApiRepository(this._api);

  /// Get paginated list of breeding events with optional filters
  Future<PagedResponse<BreedingEvent>> list({
    int page = 1,
    int limit = 20,
    String? cattleId,
    String? type,
    String? pregnancyStatus,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (cattleId != null && cattleId.isNotEmpty) params['cattle_id'] = cattleId;
    if (type != null && type.isNotEmpty) params['type'] = type;
    if (pregnancyStatus != null && pregnancyStatus.isNotEmpty) {
      params['pregnancy_status'] = pregnancyStatus;
    }

    final response = await _api.get('/breeding-events', queryParameters: params);
    return PagedResponse.fromJson(
      response.data as Map<String, dynamic>,
      BreedingEvent.fromJson,
    );
  }

  /// Get a single breeding event by ID
  Future<BreedingEvent> getById(String id) async {
    final response = await _api.get('/breeding-events/$id');
    return BreedingEvent.fromJson(response.data as Map<String, dynamic>);
  }

  /// Create a new breeding event
  Future<BreedingEvent> create(Map<String, dynamic> data) async {
    final response = await _api.post('/breeding-events', data: data);
    return BreedingEvent.fromJson(response.data as Map<String, dynamic>);
  }

  /// Update an existing breeding event
  Future<BreedingEvent> update(String id, Map<String, dynamic> data) async {
    final response = await _api.patch('/breeding-events/$id', data: data);
    return BreedingEvent.fromJson(response.data as Map<String, dynamic>);
  }

  /// Delete a breeding event
  Future<void> delete(String id) async {
    await _api.delete('/breeding-events/$id');
  }

  /// Get complete breeding history for a specific cattle
  Future<List<BreedingEvent>> getCattleBreedingHistory(String cattleId) async {
    final response = await _api.get('/cattle/$cattleId/breeding-history');
    return (response.data as List)
        .map((e) => BreedingEvent.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
