import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/feed/models/feed.dart';
import 'package:ganado_app/shared/models/paged_response.dart';

final feedApiRepositoryProvider = Provider<FeedApiRepository>((ref) {
  return FeedApiRepository(ref.read(apiClientProvider));
});

class FeedApiRepository {
  final ApiClient _api;

  FeedApiRepository(this._api);

  // ─── Feed type endpoints ───
  Future<PagedResponse<FeedType>> listFeedTypes({
    int page = 1,
    int limit = 20,
    String? category,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (category != null) params['category'] = category;

    final response = await _api.get('/feed-types', queryParameters: params);
    return PagedResponse.fromJson(
      response.data as Map<String, dynamic>,
      FeedType.fromJson,
    );
  }

  Future<FeedType> getFeedTypeById(String id) async {
    final response = await _api.get('/feed-types/$id');
    return FeedType.fromJson(response.data as Map<String, dynamic>);
  }

  Future<FeedType> createFeedType(Map<String, dynamic> data) async {
    final response = await _api.post('/feed-types', data: data);
    return FeedType.fromJson(response.data as Map<String, dynamic>);
  }

  Future<FeedType> updateFeedType(
    String id,
    Map<String, dynamic> data,
  ) async {
    final response = await _api.patch('/feed-types/$id', data: data);
    return FeedType.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> deleteFeedType(String id) async {
    await _api.delete('/feed-types/$id');
  }

  // ─── Feeding record endpoints ───
  Future<PagedResponse<FeedingRecord>> listFeedingRecords({
    int page = 1,
    int limit = 20,
    DateTime? fromDate,
    DateTime? toDate,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (fromDate != null) params['from_date'] = fromDate.toIso8601String();
    if (toDate != null) params['to_date'] = toDate.toIso8601String();

    final response =
        await _api.get('/feeding-records', queryParameters: params);
    return PagedResponse.fromJson(
      response.data as Map<String, dynamic>,
      FeedingRecord.fromJson,
    );
  }

  Future<FeedingRecord> createFeedingRecord(
    Map<String, dynamic> data,
  ) async {
    final response = await _api.post('/feeding-records', data: data);
    return FeedingRecord.fromJson(response.data as Map<String, dynamic>);
  }

  Future<FeedingSummary> getFeedingSummary({
    DateTime? fromDate,
    DateTime? toDate,
  }) async {
    final params = <String, dynamic>{};
    if (fromDate != null) params['from_date'] = fromDate.toIso8601String();
    if (toDate != null) params['to_date'] = toDate.toIso8601String();

    final response = await _api.get('/feeding-records/summary',
        queryParameters: params);
    return FeedingSummary.fromJson(response.data as Map<String, dynamic>);
  }
}
