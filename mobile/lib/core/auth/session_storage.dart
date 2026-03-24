import 'dart:convert';

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final sessionStorageProvider = Provider<SessionStorage>((ref) {
  return SessionStorage();
});

/// Abstraction over storage that uses SharedPreferences on web
/// (fast, no encryption overhead) and FlutterSecureStorage on mobile
/// (encrypted, slower but appropriate for native apps).
class SessionStorage {
  static const _accessTokenKey = 'access_token';
  static const _refreshTokenKey = 'refresh_token';
  static const _userKey = 'user';
  static const _permissionsKey = 'permissions';

  // Mobile: encrypted storage
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  // Web: SharedPreferences (fast, no encryption overhead — HTTPS handles security)
  SharedPreferences? _prefs;

  String? _cachedAccessToken;
  String? _cachedRefreshToken;

  String? get accessToken => _cachedAccessToken;
  String? get refreshToken => _cachedRefreshToken;

  Future<void> initialize() async {
    if (kIsWeb) {
      _prefs = await SharedPreferences.getInstance();
      _cachedAccessToken = _prefs!.getString(_accessTokenKey);
      _cachedRefreshToken = _prefs!.getString(_refreshTokenKey);
    } else {
      _cachedAccessToken = await _secureStorage.read(key: _accessTokenKey);
      _cachedRefreshToken = await _secureStorage.read(key: _refreshTokenKey);
    }
  }

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    _cachedAccessToken = accessToken;
    _cachedRefreshToken = refreshToken;
    if (kIsWeb) {
      await _prefs!.setString(_accessTokenKey, accessToken);
      await _prefs!.setString(_refreshTokenKey, refreshToken);
    } else {
      await _secureStorage.write(key: _accessTokenKey, value: accessToken);
      await _secureStorage.write(key: _refreshTokenKey, value: refreshToken);
    }
  }

  Future<void> saveUser(Map<String, dynamic> user) async {
    final data = jsonEncode(user);
    if (kIsWeb) {
      await _prefs!.setString(_userKey, data);
    } else {
      await _secureStorage.write(key: _userKey, value: data);
    }
  }

  Future<Map<String, dynamic>?> getUser() async {
    final String? data;
    if (kIsWeb) {
      data = _prefs!.getString(_userKey);
    } else {
      data = await _secureStorage.read(key: _userKey);
    }
    if (data == null) return null;
    return jsonDecode(data) as Map<String, dynamic>;
  }

  Future<void> savePermissions(Map<String, dynamic> permissions) async {
    final data = jsonEncode(permissions);
    if (kIsWeb) {
      await _prefs!.setString(_permissionsKey, data);
    } else {
      await _secureStorage.write(key: _permissionsKey, value: data);
    }
  }

  Future<Map<String, dynamic>?> getPermissions() async {
    final String? data;
    if (kIsWeb) {
      data = _prefs!.getString(_permissionsKey);
    } else {
      data = await _secureStorage.read(key: _permissionsKey);
    }
    if (data == null) return null;
    return jsonDecode(data) as Map<String, dynamic>;
  }

  Future<void> clearAll() async {
    _cachedAccessToken = null;
    _cachedRefreshToken = null;
    if (kIsWeb) {
      await _prefs!.remove(_accessTokenKey);
      await _prefs!.remove(_refreshTokenKey);
      await _prefs!.remove(_userKey);
      await _prefs!.remove(_permissionsKey);
    } else {
      await _secureStorage.deleteAll();
    }
  }

  bool get hasTokens => _cachedAccessToken != null;
}
