import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export const SUPPORTED_LOCALES = [
  'en', 'es', 'es-CO', 'es-CO-paisa',
  'x-piglatin', 'ik', 'esu',
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
}

const LOCALE_NAMES: Record<string, LocaleInfo> = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español' },
  'es-CO': { code: 'es-CO', name: 'Spanish (Colombia)', nativeName: 'Español (Colombia)' },
  'es-CO-paisa': { code: 'es-CO-paisa', name: 'Spanish (Paisa)', nativeName: 'Español (Paisa)' },
  'x-piglatin': { code: 'x-piglatin', name: 'Pig Latin', nativeName: 'Pig Latin' },
  ik: { code: 'ik', name: 'Iñupiaq', nativeName: 'Iñupiaq' },
  esu: { code: 'esu', name: "Yup'ik", nativeName: "Yup'ik (Central Alaskan)" },
};

@Injectable()
export class I18nService {
  private translations: Map<string, Record<string, string>> = new Map();

  constructor() {
    this.loadTranslations();
  }

  private loadTranslations(): void {
    const localesDir = path.join(__dirname, 'locales');
    for (const locale of SUPPORTED_LOCALES) {
      if (locale === 'x-piglatin') continue; // Generated at runtime
      const filePath = path.join(localesDir, `${locale}.json`);
      try {
        if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          this.translations.set(locale, data);
        }
      } catch {
        // Skip missing files
      }
    }

    // Cascade loading for Colombian Spanish
    const es = this.translations.get('es') || {};
    const esCO = this.translations.get('es-CO') || {};
    this.translations.set('es-CO', { ...es, ...esCO });

    const esCOPaisa = this.translations.get('es-CO-paisa') || {};
    this.translations.set('es-CO-paisa', { ...es, ...esCO, ...esCOPaisa });

    // Generate Pig Latin from English
    const en = this.translations.get('en') || {};
    const pigLatin: Record<string, string> = {};
    for (const [key, value] of Object.entries(en)) {
      pigLatin[key] = this.toPigLatin(value);
    }
    this.translations.set('x-piglatin', pigLatin);
  }

  translate(key: string, locale: string = 'es'): string {
    const messages = this.translations.get(locale) || this.translations.get('es') || {};
    return messages[key] || key;
  }

  getTranslations(locale: string): Record<string, string> {
    return this.translations.get(locale) || this.translations.get('es') || {};
  }

  getSupportedLocales(): LocaleInfo[] {
    return SUPPORTED_LOCALES.map((code) => LOCALE_NAMES[code] || { code, name: code, nativeName: code });
  }

  isSupported(locale: string): boolean {
    return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
  }

  private toPigLatin(text: string): string {
    if (!text) return text;
    const VOWELS = 'aeiouAEIOU';
    return text.replace(/\S+/g, (word) => {
      if (/^\d+$/.test(word) || /^[A-Z_]+$/.test(word) && word.length > 1) return word;
      const leadMatch = word.match(/^([^a-zA-Z]*)/);
      const trailMatch = word.match(/([^a-zA-Z]*)$/);
      const lead = leadMatch ? leadMatch[1] : '';
      const trail = trailMatch ? trailMatch[1] : '';
      const core = word.slice(lead.length, trail.length > 0 ? word.length - trail.length : undefined);
      if (!core || !/[a-zA-Z]/.test(core)) return word;
      const wasCap = core[0] === core[0].toUpperCase() && core[0] !== core[0].toLowerCase();
      let result: string;
      if (VOWELS.includes(core[0])) {
        result = core.toLowerCase() + 'way';
      } else {
        let i = 0;
        while (i < core.length && !VOWELS.includes(core[i])) i++;
        result = i >= core.length ? core.toLowerCase() + 'ay' : core.slice(i).toLowerCase() + core.slice(0, i).toLowerCase() + 'ay';
      }
      if (wasCap) result = result.charAt(0).toUpperCase() + result.slice(1);
      return lead + result + trail;
    });
  }
}
