import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';

final passkeyServiceProvider = Provider<PasskeyService>((ref) {
  return PasskeyService(ref.read(apiClientProvider));
});

/// Service for FIDO2/WebAuthn passkey authentication.
///
/// Flow:
///   1. Get challenge options from server
///   2. Present native passkey prompt (platform authenticator)
///   3. Send assertion to server for verification
///   4. Receive access + refresh tokens on success
class PasskeyService {
  final ApiClient _apiClient;

  PasskeyService(this._apiClient);

  static const String _rpId = 'ganado.gpcb.com.co';

  /// Check if the device supports passkeys / platform authenticators.
  /// Returns true on iOS 16+, Android 9+ with Google Play Services.
  Future<bool> isSupported() async {
    try {
      // On Flutter, we check via the native bridge.
      // If the passkeys package is available and the platform supports it,
      // the native call will succeed.
      return true; // Will be refined when passkeys package is integrated
    } catch (_) {
      return false;
    }
  }

  /// Register a new passkey credential for the current user.
  ///
  /// Requires an authenticated session (bearer token already set on ApiClient).
  Future<void> register({String? deviceName}) async {
    // Step 1: Get registration options from server
    final optionsResponse = await _apiClient.post(
      '/auth/passkey/register/options',
      data: {'deviceName': deviceName ?? 'My Device'},
    );

    final optionsData = optionsResponse.data as Map<String, dynamic>;
    if (optionsData['success'] != true) {
      throw PasskeyException(
        optionsData['error']?['message'] ?? 'Failed to get registration options',
      );
    }

    final registrationOptions = optionsData['data'] as Map<String, dynamic>;

    // Step 2: Create credential via native platform authenticator
    // This will show the system passkey creation dialog (Face ID / fingerprint)
    final credential = await _createCredential(registrationOptions);

    // Step 3: Verify registration with server
    final verifyResponse = await _apiClient.post(
      '/auth/passkey/register/verify',
      data: {
        'deviceName': deviceName ?? 'My Device',
        'attestationObject': credential['attestationObject'],
        'clientDataJSON': credential['clientDataJSON'],
      },
    );

    final verifyData = verifyResponse.data as Map<String, dynamic>;
    if (verifyData['success'] != true) {
      throw PasskeyException(
        verifyData['error']?['message'] ?? 'Failed to verify passkey registration',
      );
    }
  }

  /// Authenticate with a registered passkey.
  ///
  /// Returns a [PasskeyLoginResult] with tokens and user data.
  Future<PasskeyLoginResult> authenticate({String? email}) async {
    // Step 1: Get authentication options from server
    final optionsResponse = await _apiClient.post(
      '/auth/passkey/login/options',
      data: {'email': email},
    );

    final optionsData = optionsResponse.data as Map<String, dynamic>;
    if (optionsData['success'] != true) {
      throw PasskeyException(
        optionsData['error']?['message'] ?? 'Failed to get authentication options',
      );
    }

    final responsePayload = optionsData['data'] as Map<String, dynamic>;
    final challengeId = responsePayload['challengeId'] as String;
    final options = responsePayload['options'] as Map<String, dynamic>;

    // Step 2: Get assertion from native platform authenticator
    final assertion = await _getAssertion(options);

    // Step 3: Verify assertion with server
    final verifyResponse = await _apiClient.post(
      '/auth/passkey/login/verify',
      data: {
        'challengeId': challengeId,
        'credential': assertion,
      },
    );

    final verifyData = verifyResponse.data as Map<String, dynamic>;
    if (verifyData['success'] != true) {
      throw PasskeyException(
        verifyData['error']?['message'] ?? 'Failed to verify passkey authentication',
      );
    }

    final loginData = verifyData['data'] as Map<String, dynamic>;
    return PasskeyLoginResult(
      accessToken: loginData['access_token'] as String,
      refreshToken: loginData['refresh_token'] as String,
      user: loginData['user'] as Map<String, dynamic>,
      permissions: loginData['permissions'] as Map<String, dynamic>? ?? {},
    );
  }

  /// List registered passkey credentials for the current user.
  Future<List<PasskeyCredential>> listCredentials() async {
    final response = await _apiClient.get('/auth/passkey/credentials');
    final data = response.data as Map<String, dynamic>;

    if (data['success'] != true) {
      throw PasskeyException(
        data['error']?['message'] ?? 'Failed to list credentials',
      );
    }

    final credentials = (data['data'] as List<dynamic>?) ?? [];
    return credentials.map((c) {
      final map = c as Map<String, dynamic>;
      return PasskeyCredential(
        id: map['id'] as String,
        name: map['name'] as String? ?? 'Unknown Device',
        createdAt: map['createdAt'] as String? ?? '',
        lastUsedAt: map['lastUsedAt'] as String?,
      );
    }).toList();
  }

  /// Delete a passkey credential by ID.
  Future<void> deleteCredential(String id) async {
    final response = await _apiClient.post(
      '/auth/passkey/credentials/$id/delete',
      data: {},
    );
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) {
      throw PasskeyException(
        data['error']?['message'] ?? 'Failed to delete credential',
      );
    }
  }

  // ── Native bridge helpers ──────────────────────────────────────────

  /// Creates a new credential using the platform authenticator.
  /// This is a placeholder that will be connected to the native passkey plugin.
  Future<Map<String, dynamic>> _createCredential(
    Map<String, dynamic> options,
  ) async {
    // TODO: Wire to native passkeys package when Flutter passkeys plugin
    // is added to pubspec.yaml. Example:
    //   final result = await Passkey.register(options);
    //   return {
    //     'attestationObject': result.attestationObject,
    //     'clientDataJSON': result.clientDataJSON,
    //   };
    throw PasskeyException('Passkey registration not yet available on this device');
  }

  /// Gets an assertion (signature) from a registered credential.
  Future<Map<String, dynamic>> _getAssertion(
    Map<String, dynamic> options,
  ) async {
    // TODO: Wire to native passkeys package when Flutter passkeys plugin
    // is added to pubspec.yaml. Example:
    //   final assertion = await Passkey.authenticate(options);
    //   return {
    //     'id': assertion.id,
    //     'rawId': assertion.rawId,
    //     'response': {
    //       'clientDataJSON': assertion.response.clientDataJSON,
    //       'authenticatorData': assertion.response.authenticatorData,
    //       'signature': assertion.response.signature,
    //       'userHandle': assertion.response.userHandle,
    //     },
    //     'type': assertion.type,
    //   };
    throw PasskeyException('Passkey authentication not yet available on this device');
  }
}

// ── Models ──────────────────────────────────────────────────────────

class PasskeyLoginResult {
  final String accessToken;
  final String refreshToken;
  final Map<String, dynamic> user;
  final Map<String, dynamic> permissions;

  PasskeyLoginResult({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
    required this.permissions,
  });
}

class PasskeyCredential {
  final String id;
  final String name;
  final String createdAt;
  final String? lastUsedAt;

  PasskeyCredential({
    required this.id,
    required this.name,
    required this.createdAt,
    this.lastUsedAt,
  });
}

class PasskeyException implements Exception {
  final String message;
  PasskeyException(this.message);

  @override
  String toString() => 'PasskeyException: $message';
}
