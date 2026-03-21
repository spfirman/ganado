import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export const SUPPORTED_LOCALES = ['en', 'es', 'es-CO', 'es-CO-paisa', 'es-MX-chido', 'x-piglatin', 'ik', 'esu'];

/** Maps short/alias locale codes to their canonical SUPPORTED_LOCALES code. */
const LOCALE_ALIASES: Record<string, string> = {
  'es-paisa': 'es-CO-paisa',
  paisa: 'es-CO-paisa',
  'es-mexicano': 'es-MX-chido',
  mexicano: 'es-MX-chido',
  chido: 'es-MX-chido',
};

@Injectable()
export class I18nService {
  private translations: Map<string, Record<string, string>> = new Map();

  constructor() {
    this.loadTranslations();
  }

  /** Resolve alias codes like 'es-paisa' → 'es-CO-paisa'. */
  private resolveLocale(locale: string): string {
    return LOCALE_ALIASES[locale] || locale;
  }

  private loadTranslations(): void {
    const localesDir = path.join(__dirname, 'locales');
    for (const locale of SUPPORTED_LOCALES) {
      if (locale === 'x-piglatin') continue;
      const filePath = path.join(localesDir, `${locale}.json`);
      try {
        if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          this.translations.set(locale, data);
        }
      } catch {}
    }

    const es = this.translations.get('es') || {};
    const esCO = this.translations.get('es-CO') || {};
    this.translations.set('es-CO', { ...es, ...esCO });

    const esCOPaisa = this.translations.get('es-CO-paisa') || {};
    this.translations.set('es-CO-paisa', { ...es, ...esCO, ...esCOPaisa });

    const esMXChido = this.translations.get('es-MX-chido') || {};
    this.translations.set('es-MX-chido', { ...es, ...esMXChido });

    const en = this.translations.get('en') || {};
    const pigLatin: Record<string, string> = {};
    for (const [key, value] of Object.entries(en)) {
      pigLatin[key] = this.toPigLatin(value);
    }
    this.translations.set('x-piglatin', pigLatin);
  }

  translate(key: string, locale: string = 'es'): string {
    const resolved = this.resolveLocale(locale);
    const messages = this.translations.get(resolved) || this.translations.get('es') || {};
    return messages[key] || key;
  }

  getTranslations(locale: string): Record<string, string> {
    const resolved = this.resolveLocale(locale);
    return this.translations.get(resolved) || this.translations.get('es') || {};
  }

  getSupportedLocales() {
    const names: Record<string, { code: string; name: string; nativeName: string }> = {
      en: { code: 'en', name: 'English', nativeName: 'English' },
      es: { code: 'es', name: 'Spanish', nativeName: 'Espanol' },
      'es-CO': { code: 'es-CO', name: 'Spanish (Colombia)', nativeName: 'Espanol (Colombia)' },
      'es-CO-paisa': { code: 'es-CO-paisa', name: 'Spanish (Paisa)', nativeName: 'Espanol (Paisa)' },
      'es-MX-chido': { code: 'es-MX-chido', name: 'Spanish (Mexican Extreme)', nativeName: 'Español Mexicano (¡A Toda Madre!)' },
      'x-piglatin': { code: 'x-piglatin', name: 'Pig Latin', nativeName: 'Pig Latin' },
      ik: { code: 'ik', name: 'Inupiaq', nativeName: 'Inupiaq' },
      esu: { code: 'esu', name: "Yup'ik", nativeName: "Yup'ik (Central Alaskan)" },
    };
    return SUPPORTED_LOCALES.map((code) => names[code] || { code, name: code, nativeName: code });
  }

  isSupported(locale: string): boolean {
    const resolved = this.resolveLocale(locale);
    return SUPPORTED_LOCALES.includes(resolved);
  }

  toPigLatin(text: string): string {
    if (!text) return text;
    const VOWELS = 'aeiouAEIOU';
    return text.replace(/\S+/g, (word: string) => {
      if (/^\d+$/.test(word) || (/^[A-Z_]+$/.test(word) && word.length > 1)) return word;

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
        result =
          i >= core.length
            ? core.toLowerCase() + 'ay'
            : core.slice(i).toLowerCase() + core.slice(0, i).toLowerCase() + 'ay';
      }

      if (wasCap) result = result.charAt(0).toUpperCase() + result.slice(1);
      return lead + result + trail;
    });
  }
}
