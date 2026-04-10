import { useCallback, useEffect, useState } from 'react';

// Type definitions
interface Translations {
  [locale: string]: {
    [key: string]: string;
  };
}

// Translations database (embedded for simplicity; can be loaded from JSON files)
const translations: Translations = {
  en: {
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
  es: {
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
  },
};

const LOCALE_KEY = 'ganado.i18n.locale';
const SUPPORTED_LOCALES = ['en', 'es'];

interface UseI18nReturn {
  t: (key: string, params?: Record<string, string>) => string;
  locale: string;
  setLocale: (locale: string) => void;
}

export function useI18n(): UseI18nReturn {
  const [locale, setLocaleState] = useState<string>('es');
  const [mounted, setMounted] = useState(false);

  // Initialize locale from localStorage or device locale
  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCALE_KEY);

    if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
      setLocaleState(savedLocale);
    } else {
      // Detect device locale
      const deviceLocale = navigator.language.split('-')[0];
      if (SUPPORTED_LOCALES.includes(deviceLocale)) {
        setLocaleState(deviceLocale);
      }
    }

    setMounted(true);
  }, []);

  // Translation function
  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      let value = translations[locale]?.[key];

      // Fallback to Spanish if not found
      if (!value && locale !== 'es') {
        value = translations['es']?.[key];
      }

      // Fallback to key itself if not found
      value = value ?? key;

      // Parameter substitution
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          value = value!.replaceAll(`{${paramKey}}`, paramValue);
        });
      }

      return value;
    },
    [locale]
  );

  // Update locale and persist
  const setLocale = useCallback((newLocale: string) => {
    if (SUPPORTED_LOCALES.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem(LOCALE_KEY, newLocale);
    }
  }, []);

  return {
    t,
    locale,
    setLocale,
  };
}

// Context for global i18n state (optional, for more complex setups)
import { createContext, useContext, ReactNode } from 'react';

interface I18nContextType {
  t: (key: string, params?: Record<string, string>) => string;
  locale: string;
  setLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const i18n = useI18n();

  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18nContext(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18nContext must be used within I18nProvider');
  }
  return context;
}
