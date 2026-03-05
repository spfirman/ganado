import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/brands/models/brand.dart';

final brandListProvider = FutureProvider<List<Brand>>((ref) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/brands');
  return (response.data as List)
      .map((e) => Brand.fromJson(e as Map<String, dynamic>))
      .toList();
});

final createBrandProvider =
    FutureProvider.family<Brand, ({String name, String? imagePath})>(
        (ref, params) async {
  final api = ref.read(apiClientProvider);
  final formData = FormData.fromMap({
    'name': params.name,
    if (params.imagePath != null)
      'file': await MultipartFile.fromFile(params.imagePath!),
  });
  final response = await api.upload('/brands', formData: formData);
  return Brand.fromJson(response.data as Map<String, dynamic>);
});
