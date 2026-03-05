import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/commerce/purchases/models/purchase.dart';
import 'package:ganado_app/shared/models/paged_response.dart';

final purchaseListProvider = FutureProvider<PagedResponse<Purchase>>((ref) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/purchases', queryParameters: {'page': 1, 'limit': 50});
  return PagedResponse.fromJson(response.data as Map<String, dynamic>, Purchase.fromJson);
});

final purchaseDetailProvider = FutureProvider.family<Purchase, String>((ref, id) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/purchases/$id');
  return Purchase.fromJson(response.data as Map<String, dynamic>);
});
