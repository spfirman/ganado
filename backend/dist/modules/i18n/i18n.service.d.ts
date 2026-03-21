export declare const SUPPORTED_LOCALES: string[];
export declare class I18nService {
    private translations;
    constructor();
    private resolveLocale;
    private loadTranslations;
    translate(key: string, locale?: string): string;
    getTranslations(locale: string): Record<string, string>;
    getSupportedLocales(): {
        code: string;
        name: string;
        nativeName: string;
    }[];
    isSupported(locale: string): boolean;
    toPigLatin(text: string): string;
}
