import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

const String _localeKey = 'app_locale';

/// All locales supported by the application.
const List<Locale> supportedLocales = [
  Locale('es'),
  Locale('en'),
  Locale('pt'),
  Locale('fr'),
  Locale('de'),
  Locale('zh'),
  Locale('hi'),
  Locale('ar'),
  Locale('ru'),
  Locale('ja'),
];

/// Human-readable native names for each supported locale.
const Map<String, String> localeNativeNames = {
  'es': 'Español',
  'en': 'English',
  'pt': 'Português',
  'fr': 'Français',
  'de': 'Deutsch',
  'zh': '中文',
  'hi': 'हिन्दी',
  'ar': 'العربية',
  'ru': 'Русский',
  'ja': '日本語',
};

/// Provider for [SharedPreferences] — must be overridden in main().
final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError(
    'sharedPreferencesProvider must be overridden with a valid instance.',
  );
});

/// Notifier that manages the current app locale.
///
/// On creation it reads the persisted locale from [SharedPreferences].
/// When no locale has been saved, it resolves the device locale and falls
/// back to Spanish ('es') if the device locale is not supported.
class LocaleNotifier extends StateNotifier<Locale> {
  final SharedPreferences _prefs;

  LocaleNotifier(this._prefs) : super(const Locale('es')) {
    _init();
  }

  void _init() {
    final saved = _prefs.getString(_localeKey);
    if (saved != null && supportedLocales.any((l) => l.languageCode == saved)) {
      state = Locale(saved);
    } else {
      // Use the device locale if it is one of our supported locales.
      final deviceLocale = ui.PlatformDispatcher.instance.locale;
      if (supportedLocales.any(
        (l) => l.languageCode == deviceLocale.languageCode,
      )) {
        state = Locale(deviceLocale.languageCode);
      } else {
        state = const Locale('es');
      }
    }
  }

  /// Change the current locale and persist the choice.
  Future<void> setLocale(Locale locale) async {
    if (!supportedLocales.contains(locale)) return;
    state = locale;
    await _prefs.setString(_localeKey, locale.languageCode);
  }
}

/// Riverpod provider that exposes the current [Locale].
final localeProvider = StateNotifierProvider<LocaleNotifier, Locale>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return LocaleNotifier(prefs);
});
