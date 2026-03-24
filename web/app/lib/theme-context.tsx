'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiFetch } from './api';

const THEMES = [
  { key: 'pasturePrime', label: 'Pasture Prime', icon: '\u{1F33F}', preview: '#2E7D32' },
  { key: 'light', label: 'Light', icon: '\u2600\uFE0F', preview: '#1976D2' },
  { key: 'dark', label: 'Dark', icon: '\u{1F319}', preview: '#4ADE80' },
  { key: 'harvestGold', label: 'Harvest Gold', icon: '\u{1F33E}', preview: '#D4A017' },
  { key: 'system', label: 'Sistema', icon: '\u{1F4BB}', preview: '#888' },
] as const;

type ThemeKey = typeof THEMES[number]['key'];

interface ThemeContextType {
  theme: ThemeKey;
  setTheme: (key: ThemeKey) => void;
  themes: typeof THEMES;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'pasturePrime',
  setTheme: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>('pasturePrime');

  useEffect(() => {
    // Load from localStorage first (instant)
    const stored = localStorage.getItem('ganado-theme') as ThemeKey | null;
    if (stored) applyTheme(stored);
    // Then try API
    apiFetch('/users/me').then((user: any) => {
      if (user?.theme_preference) applyTheme(user.theme_preference as ThemeKey);
    }).catch(() => {});
  }, []);

  function applyTheme(key: ThemeKey) {
    let resolved = key;
    if (key === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', resolved);
    setThemeState(key);
    localStorage.setItem('ganado-theme', key);
  }

  function setTheme(key: ThemeKey) {
    applyTheme(key);
    // Persist to API (fire and forget)
    apiFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ theme_preference: key }),
    }).catch(() => {});
  }

  return (
    <ThemeContext value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext>
  );
}

export const useTheme = () => useContext(ThemeContext);
