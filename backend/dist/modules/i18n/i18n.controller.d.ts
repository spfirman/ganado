import { I18nService } from './i18n.service';
export declare class I18nController {
    private readonly i18nService;
    constructor(i18nService: I18nService);
    getLanguages(): {
        success: boolean;
        data: {
            code: string;
            name: string;
            nativeName: string;
        }[];
    };
    getTranslations(locale?: string): {
        success: boolean;
        data: {
            locale: string;
            translations: Record<string, string>;
        };
    };
}
