import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/grazing/models/pasture.dart';
import 'package:ganado_app/shared/models/paged_response.dart';

final grazingApiRepositoryProvider = Provider<GrazingApiRepository>((ref) {
  return GrazingApiRepository(ref.read(apiClientProvider));
});

class GrazingApiRepository {
  final ApiClient _api;

  GrazingApiRepository(this._api);

  // ─── Pasture endpoints ───
  Future<PagedResponse<Pasture>> listPastures({
    int page = 1,
    int limit = 20,
    String? status,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (status != null) params['status'] = status;

    final response = await _api.get('/pastures', queryParameters: params);
    return PagedResponse.fromJson(
      response.data as Map<String, dynamic>,
      Pasture.fromJson,
    );
  }

  Future<Pasture> getPastureById(String id) async {
    final response = await _api.get('/pastures/$id');
    return Pasture.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Pasture> createPasture(Map<String, dynamic> data) async {
    final response = await _api.post('/pastures', data: data);
    return Pasture.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Pasture> updatePasture(String id, Map<String, dynamic> data) async {
    final response = await _api.patch('/pastures/$id', data: data);
    return Pasture.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> deletePasture(String id) async {
    await _api.delete('/pastures/$id');
  }

  // ─── Grazing rotation endpoints ───
  Future<List<GrazingRotation>> getRotations(String pastureId) async {
    final response =
        await _api.get('/pastures/$pastureId/rotations');
    return (response.data as List)
        .map((e) => GrazingRotation.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<GrazingRotation>> listAllRotations({
    int page = 1,
    int limit = 20,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    final response =
        await _api.get('/grazing-rotations', queryParameters: params);
    return (response.data as List)
        .map((e) => GrazingRotation.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<GrazingRotation> createRotation(
    Map<String, dynamic> data,
  ) async {
    final response = await _api.post('/grazing-rotations', data: data);
    return GrazingRotation.fromJson(response.data as Map<String, dynamic>);
  }
}
