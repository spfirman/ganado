export declare const SUPPORTED_LOCALES: readonly ["en", "es", "es-CO", "es-CO-paisa", "x-piglatin", "ik", "esu"];
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export interface LocaleInfo {
    code: string;
    name: string;
    nativeName: string;
}
export declare class I18nService {
    private translations;
    constructor();
    private loadTranslations;
    translate(key: string, locale?: string): string;
    getTranslations(locale: string): Record<string, string>;
    getSupportedLocales(): LocaleInfo[];
    isSupported(locale: string): boolean;
    private toPigLatin;
}
