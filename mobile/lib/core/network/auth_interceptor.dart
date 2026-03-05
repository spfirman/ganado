import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/auth/auth_provider.dart';
import 'package:ganado_app/core/auth/session_storage.dart';

class AuthInterceptor extends Interceptor {
  final Ref _ref;

  AuthInterceptor(this._ref);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = _ref.read(sessionStorageProvider).accessToken;
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      final sessionStorage = _ref.read(sessionStorageProvider);
      final refreshToken = sessionStorage.refreshToken;

      if (refreshToken != null) {
        try {
          final dio = Dio();
          final response = await dio.post(
            '${err.requestOptions.baseUrl}/auth/refresh',
            data: {'refresh_token': refreshToken},
          );

          final newAccessToken = response.data['access_token'] as String;
          final newRefreshToken = response.data['refresh_token'] as String;

          await sessionStorage.saveTokens(
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          );

          // Retry original request with new token
          err.requestOptions.headers['Authorization'] =
              'Bearer $newAccessToken';
          final retryResponse = await dio.fetch(err.requestOptions);
          return handler.resolve(retryResponse);
        } catch (_) {
          _ref.read(authStateProvider.notifier).logout();
        }
      } else {
        _ref.read(authStateProvider.notifier).logout();
      }
    }
    handler.next(err);
  }
}
