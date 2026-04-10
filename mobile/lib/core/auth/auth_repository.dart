import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/auth/auth_exceptions.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:dio/dio.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.read(apiClientProvider));
});

class AuthRepository {
  final ApiClient _apiClient;

  AuthRepository(this._apiClient);

  Future<LoginResult> login({
    required String username,
    required String password,
  }) async {
    try {
      final response = await _apiClient.post(
        '/auth/login',
        data: {
          'company_username': 'gpcb_ranch',
          'username': username,
          'password': password,
        },
      );

      final data = response.data as Map<String, dynamic>;
      return LoginResult(
        accessToken: data['access_token'] as String,
        refreshToken: data['refresh_token'] as String,
        expiresIn: data['expires_in'] as int,
        user: data['user'] as Map<String, dynamic>,
        permissions: data['permissions'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      // Check if OTP is required
      if (e.response?.statusCode == 403) {
        final data = e.response?.data as Map<String, dynamic>?;
        if (data?['error'] == 'otp_required') {
          final tempToken = data?['temp_token'] as String?;
          if (tempToken != null) {
            throw OtpRequiredError(
              tempToken: tempToken,
              message: data?['message'] ?? 'OTP verification required',
            );
          }
        }
      }
      rethrow;
    }
  }

  Future<void> logout(String refreshToken) async {
    await _apiClient.post(
      '/auth/logout',
      data: {'refresh_token': refreshToken},
    );
  }

  /// Verify OTP code and complete login
  Future<LoginResult> verifyOtp({
    required String tempToken,
    required String code,
  }) async {
    final response = await _apiClient.post(
      '/auth/otp/verify',
      data: {
        'temp_token': tempToken,
        'code': code,
      },
    );

    final data = response.data as Map<String, dynamic>;
    return LoginResult(
      accessToken: data['access_token'] as String,
      refreshToken: data['refresh_token'] as String,
      expiresIn: data['expires_in'] as int,
      user: data['user'] as Map<String, dynamic>,
      permissions: data['permissions'] as Map<String, dynamic>,
    );
  }
}

class LoginResult {
  final String accessToken;
  final String refreshToken;
  final int expiresIn;
  final Map<String, dynamic> user;
  final Map<String, dynamic> permissions;

  LoginResult({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresIn,
    required this.user,
    required this.permissions,
  });
}
