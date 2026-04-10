import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';

final magicLinkServiceProvider = Provider<MagicLinkService>((ref) {
  return MagicLinkService(ref.read(apiClientProvider));
});

/// Service for passwordless magic-link email authentication.
///
/// Flow:
///   1. User enters email → POST /auth/magic-link/request
///   2. Server sends email with deep link: ganado://magic-link?token=xxx
///   3. App intercepts deep link → POST /auth/magic-link/verify
///   4. Server returns access + refresh tokens
class MagicLinkService {
  final ApiClient _apiClient;

  MagicLinkService(this._apiClient);

  /// Request a magic link to be sent to [email].
  ///
  /// Returns a [MagicLinkResult] indicating success/failure with a message.
  Future<MagicLinkResult> requestMagicLink(String email) async {
    try {
      final response = await _apiClient.post(
        '/auth/magic-link/request',
        data: {'email': email.trim()},
      );

      final data = response.data as Map<String, dynamic>;
      if (data['success'] == true) {
        return MagicLinkResult(
          success: true,
          message: 'Magic link sent to your email',
        );
      } else {
        return MagicLinkResult(
          success: false,
          message: data['error']?['message'] ?? 'Failed to send magic link',
        );
      }
    } catch (e) {
      return MagicLinkResult(
        success: false,
        message: 'Failed to send magic link. Please try again.',
      );
    }
  }

  /// Verify a magic link [token] received from the deep link callback.
  ///
  /// On success, returns a [MagicLinkLoginResult] with tokens and user data.
  Future<MagicLinkLoginResult> verifyMagicLink(String token) async {
    final response = await _apiClient.post(
      '/auth/magic-link/verify',
      data: {'token': token},
    );

    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true || data['data'] == null) {
      throw MagicLinkException(
        data['error']?['message'] ?? 'Invalid or expired magic link',
      );
    }

    final loginData = data['data'] as Map<String, dynamic>;
    return MagicLinkLoginResult(
      accessToken: loginData['access_token'] as String,
      refreshToken: loginData['refresh_token'] as String,
      user: loginData['user'] as Map<String, dynamic>,
      permissions: loginData['permissions'] as Map<String, dynamic>? ?? {},
    );
  }

  /// Extract a magic link token from a deep link URL.
  ///
  /// Expected format: `ganado://magic-link?token=xxx`
  static String? extractToken(String url) {
    try {
      final uri = Uri.parse(url);
      return uri.queryParameters['token'];
    } catch (_) {
      // Fallback regex for malformed URIs
      final match = RegExp(r'[?&]token=([^&]+)').firstMatch(url);
      return match != null ? Uri.decodeComponent(match.group(1)!) : null;
    }
  }
}

// ── Models ──────────────────────────────────────────────────────────

class MagicLinkResult {
  final bool success;
  final String message;

  MagicLinkResult({required this.success, required this.message});
}

class MagicLinkLoginResult {
  final String accessToken;
  final String refreshToken;
  final Map<String, dynamic> user;
  final Map<String, dynamic> permissions;

  MagicLinkLoginResult({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
    required this.permissions,
  });
}

class MagicLinkException implements Exception {
  final String message;
  MagicLinkException(this.message);

  @override
  String toString() => 'MagicLinkException: $message';
}
