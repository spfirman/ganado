import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/cattle/models/cattle.dart';
import 'package:ganado_app/shared/models/paged_response.dart';

final cattleApiRepositoryProvider = Provider<CattleApiRepository>((ref) {
  return CattleApiRepository(ref.read(apiClientProvider));
});

class CattleApiRepository {
  final ApiClient _api;

  CattleApiRepository(this._api);

  Future<PagedResponse<Cattle>> list({
    int page = 1,
    int limit = 20,
    String? search,
    String? status,
    String? gender,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (search != null && search.isNotEmpty) params['search'] = search;
    if (status != null) params['status'] = status;
    if (gender != null) params['gender'] = gender;

    final response = await _api.get('/cattle', queryParameters: params);
    return PagedResponse.fromJson(
      response.data as Map<String, dynamic>,
      Cattle.fromJson,
    );
  }

  Future<Cattle> getById(String id) async {
    final response = await _api.get('/cattle/$id');
    return Cattle.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<Cattle>> search(String query) async {
    final response =
        await _api.get('/cattle/search', queryParameters: {'q': query});
    return (response.data as List)
        .map((e) => Cattle.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Cattle> create(Map<String, dynamic> data) async {
    final response = await _api.post('/cattle', data: data);
    return Cattle.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Cattle> update(String id, Map<String, dynamic> data) async {
    final response = await _api.patch('/cattle/$id', data: data);
    return Cattle.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> delete(String id) async {
    await _api.delete('/cattle/$id');
  }

  Future<CattleWeightHistory> recordWeight(
    String id,
    Map<String, dynamic> data,
  ) async {
    final response = await _api.post('/cattle/$id/weight', data: data);
    return CattleWeightHistory.fromJson(
        response.data as Map<String, dynamic>);
  }

  Future<CattleMedicationHistory> addMedication(
    String id,
    Map<String, dynamic> data,
  ) async {
    final response = await _api.post('/cattle/$id/medications', data: data);
    return CattleMedicationHistory.fromJson(
        response.data as Map<String, dynamic>);
  }

  Future<void> bulkUpdateStatus(Map<String, dynamic> data) async {
    await _api.patch('/cattle/bulk-status', data: data);
  }

  Future<List<dynamic>> importExcel(String filePath) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(filePath),
    });
    final response = await _api.upload('/cattle/import', formData: formData);
    return response.data as List;
  }
}
