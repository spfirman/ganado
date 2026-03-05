import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/auth/auth_repository.dart';
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

      final sessionStorage = _ref.read(sessionStorageProvider);
      await sessionStorage.saveTokens(
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      );
      await sessionStorage.saveUser(result.user);
      await sessionStorage.savePermissions(result.permissions);

      state = AuthState(
        status: AuthStatus.authenticated,
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
}
