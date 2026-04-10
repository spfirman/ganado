import 'package:flutter/material.dart';
import 'package:intl/intl.dart' as intl;

class AppLocalizations {
  AppLocalizations(this.locale);

  final Locale locale;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  // Localized strings database
  static const Map<String, Map<String, String>> _strings = {
    'en': {
      'app.name': 'Ganado',
      'app.subtitle': 'Cattle Management System',
      'auth.username': 'Username',
      'auth.password': 'Password',
      'auth.login': 'Sign In',
      'auth.loginSubtitle': 'Sign in to your account',
      'auth.signingIn': 'Signing in...',
      'auth.otp.title': 'Two-Factor Authentication',
      'auth.otp.subtitle':
          'Two-factor authentication is required.\nEnter the 6-digit code from your authenticator app.',
      'auth.otp.code': 'Verification code',
      'auth.otp.verify': 'Verify',
      'auth.otp.back': 'Back to sign in',
      'auth.forgotPassword': 'Forgot password?',
      'auth.usernamePlaceholder': 'Enter your username',
      'auth.passwordPlaceholder': 'Enter your password',
      'errors.loginFailed': 'Login failed. Please try again.',
      'errors.invalidCredentials': 'Invalid credentials',
      'errors.networkError': 'Network error. Please try again.',
      'errors.otpInvalid': 'Invalid verification code',
      'errors.otpRequired': 'Please enter the OTP code',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'nav.dashboard': 'Dashboard',
      'nav.herd': 'Herd',
      'nav.health': 'Health',
      'nav.breeding': 'Breeding',
      'nav.pastures': 'Pastures',
      'nav.feed': 'Feed',
      'nav.events': 'Events',
      'nav.tasks': 'Tasks',
      'nav.commerce': 'Commerce',
      'nav.alerts': 'Alerts',
      'nav.settings': 'Settings',
      'nav.animals': 'Animals',
      'nav.market': 'Market',
    },
    'es': {
      'app.name': 'Ganado',
      'app.subtitle': 'Sistema de gestión ganadera',
      'auth.username': 'Usuario',
      'auth.password': 'Contraseña',
      'auth.login': 'Iniciar sesión',
      'auth.loginSubtitle': 'Inicia sesión en tu cuenta',
      'auth.signingIn': 'Iniciando sesión...',
      'auth.otp.title': 'Verificación de dos factores',
      'auth.otp.subtitle':
          'Se requiere autenticación de dos factores.\nIngresa el código de 6 dígitos de tu aplicación autenticadora.',
      'auth.otp.code': 'Código de verificación',
      'auth.otp.verify': 'Verificar',
      'auth.otp.back': 'Volver al inicio de sesión',
      'auth.forgotPassword': '¿Olvidaste tu contraseña?',
      'auth.usernamePlaceholder': 'Ingresa tu usuario',
      'auth.passwordPlaceholder': 'Ingresa tu contraseña',
      'errors.loginFailed': 'Error al iniciar sesión. Intenta de nuevo.',
      'errors.invalidCredentials': 'Credenciales inválidas',
      'errors.networkError': 'Error de red. Intente de nuevo.',
      'errors.otpInvalid': 'Código de verificación inválido',
      'errors.otpRequired': 'Por favor ingresa el código OTP',
      'common.save': 'Guardar',
      'common.cancel': 'Cancelar',
      'common.loading': 'Cargando...',
      'common.error': 'Error',
      'nav.dashboard': 'Panel',
      'nav.herd': 'Rebaño',
      'nav.health': 'Salud',
      'nav.breeding': 'Reproducción',
      'nav.pastures': 'Potreros',
      'nav.feed': 'Alimentación',
      'nav.events': 'Eventos',
      'nav.tasks': 'Tareas',
      'nav.commerce': 'Comercio',
      'nav.alerts': 'Alertas',
      'nav.settings': 'Ajustes',
      'nav.animals': 'Animales',
      'nav.market': 'Mercado',
    }
  };

  // Translation method with parameter substitution
  String t(String key, {Map<String, String>? params}) {
    final languageCode = locale.languageCode;

    // Try current language
    String? value = _strings[languageCode]?[key];

    // Fallback to Spanish
    if (value == null && languageCode != 'es') {
      value = _strings['es']?[key];
    }

    // Fallback to key itself
    value = value ?? key;

    // Parameter substitution
    if (params != null) {
      params.forEach((paramKey, paramValue) {
        value = value!.replaceAll('{$paramKey}', paramValue);
      });
    }

    return value;
  }

  // Getter shortcuts for common strings
  String get appName => t('app.name');
  String get appSubtitle => t('app.subtitle');
  String get username => t('auth.username');
  String get password => t('auth.password');
  String get login => t('auth.login');
  String get loginSubtitle => t('auth.loginSubtitle');
  String get signingIn => t('auth.signingIn');
  String get otpTitle => t('auth.otp.title');
  String get otpSubtitle => t('auth.otp.subtitle');
  String get otpCode => t('auth.otp.code');
  String get otpVerify => t('auth.otp.verify');
  String get otpBack => t('auth.otp.back');
  String get forgotPassword => t('auth.forgotPassword');
  String get usernamePlaceholder => t('auth.usernamePlaceholder');
  String get passwordPlaceholder => t('auth.passwordPlaceholder');
  String get loginFailed => t('errors.loginFailed');
  String get invalidCredentials => t('errors.invalidCredentials');
  String get networkError => t('errors.networkError');
  String get otpInvalid => t('errors.otpInvalid');
  String get otpRequired => t('errors.otpRequired');
  String get save => t('common.save');
  String get cancel => t('common.cancel');
  String get loading => t('common.loading');
  String get error => t('common.error');
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'es'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) {
    return Future.value(AppLocalizations(locale));
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
