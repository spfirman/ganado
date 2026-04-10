import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/auth/auth_exceptions.dart';
import 'package:ganado_app/core/auth/auth_repository.dart';
import 'package:ganado_app/core/auth/magic_link_service.dart';
import 'package:ganado_app/core/auth/passkey_service.dart';
import 'package:ganado_app/core/auth/session_storage.dart';

enum AuthStatus { unknown, authenticated, unauthenticated }

class AuthState {
  final AuthStatus status;
  final Map<String, dynamic>? user;
  final Map<String, dynamic>? permissions;
  final String? errorMessage;
  final bool isLoading;

  const AuthState({
    this.status = AuthStatus.unknown,
    this.user,
    this.permissions,
    this.errorMessage,
    this.isLoading = false,
  });

  AuthState copyWith({
    AuthStatus? status,
    Map<String, dynamic>? user,
    Map<String, dynamic>? permissions,
    String? errorMessage,
    bool? isLoading,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      permissions: permissions ?? this.permissions,
      errorMessage: errorMessage,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  String get displayName {
    if (user == null) return '';
    final first = user!['first_name'] ?? '';
    final last = user!['last_name'] ?? '';
    return '$first $last'.trim();
  }

  String get username => user?['username'] ?? '';
  String? get tenantId => user?['tenant_id'];
}

final authStateProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});

class AuthNotifier extends StateNotifier<AuthState> {
  final Ref _ref;

  AuthNotifier(this._ref) : super(const AuthState());

  Future<void> checkAuthStatus() async {
    final sessionStorage = _ref.read(sessionStorageProvider);
    await sessionStorage.initialize();

    if (sessionStorage.hasTokens) {
      final user = await sessionStorage.getUser();
      final permissions = await sessionStorage.getPermissions();
      state = AuthState(
        status: AuthStatus.authenticated,
        user: user,
        permissions: permissions,
      );
    } else {
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  /// Standard username + password login.
  Future<void> login({
    required String username,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final repository = _ref.read(authRepositoryProvider);
      final result = await repository.login(
        username: username,
        password: password,
      );

      await _saveSession(
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        permissions: result.permissions,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  /// Magic link login — called after the deep link is intercepted and token extracted.
  Future<void> loginWithMagicLink(String token) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final magicLinkService = _ref.read(magicLinkServiceProvider);
      final result = await magicLinkService.verifyMagicLink(token);

      await _saveSession(
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        permissions: result.permissions,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  /// Passkey (FIDO2/WebAuthn) login.
  Future<void> loginWithPasskey({String? email}) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final passkeyService = _ref.read(passkeyServiceProvider);
      final result = await passkeyService.authenticate(email: email);

      await _saveSession(
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        permissions: result.permissions,
      );
    } catch (e) {
      // Don't set error if user simply cancelled the prompt
      final msg = e.toString();
      if (msg.contains('cancelled') || msg.contains('NotAllowedError')) {
        state = state.copyWith(isLoading: false);
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: msg,
        );
      }
    }
  }

  /// Verify OTP code after login requires OTP
  Future<void> loginWithOtp({
    required String tempToken,
    required String code,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final repository = _ref.read(authRepositoryProvider);
      final result = await repository.verifyOtp(
        tempToken: tempToken,
        code: code,
      );

      await _saveSession(
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        permissions: result.permissions,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
      rethrow;
    }
  }

  Future<void> logout() async {
    final sessionStorage = _ref.read(sessionStorageProvider);
    final refreshToken = sessionStorage.refreshToken;

    try {
      if (refreshToken != null) {
        final repository = _ref.read(authRepositoryProvider);
        await repository.logout(refreshToken);
      }
    } catch (_) {
      // Ignore logout API errors
    }

    await sessionStorage.clearAll();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  // ── Private helpers ────────────────────────────────────────────────

  Future<void> _saveSession({
    required String accessToken,
    required String refreshToken,
    required Map<String, dynamic> user,
    required Map<String, dynamic> permissions,
  }) async {
    final sessionStorage = _ref.read(sessionStorageProvider);
    await sessionStorage.saveTokens(
      accessToken: accessToken,
      refreshToken: refreshToken,
    );
    await sessionStorage.saveUser(user);
    await sessionStorage.savePermissions(permissions);

    state = AuthState(
      status: AuthStatus.authenticated,
      user: user,
      permissions: permissions,
    );
  }
}
