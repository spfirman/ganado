import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final localeProvider = StateNotifierProvider<LocaleNotifier, Locale>((ref) {
  return LocaleNotifier();
});

class LocaleNotifier extends StateNotifier<Locale> {
  static const String _localeKey = 'ganado.i18n.locale';

  LocaleNotifier() : super(const Locale('es')) {
    _initializeLocale();
  }

  Future<void> _initializeLocale() async {
    final prefs = await SharedPreferences.getInstance();
    final savedLocaleCode = prefs.getString(_localeKey);

    if (savedLocaleCode != null) {
      state = Locale(savedLocaleCode);
    } else {
      // Use device locale if available, otherwise default to Spanish
      final deviceLocale = WidgetsBinding.instance.window.locale;
      if (['en', 'es'].contains(deviceLocale.languageCode)) {
        state = deviceLocale;
      }
    }
  }

  Future<void> setLocale(String languageCode) async {
    if (!['en', 'es'].contains(languageCode)) return;

    state = Locale(languageCode);

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_localeKey, languageCode);
  }

  String get currentLanguageCode => state.languageCode;
}
