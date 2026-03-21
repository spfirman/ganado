"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nService = exports.SUPPORTED_LOCALES = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
exports.SUPPORTED_LOCALES = ['en', 'es', 'es-CO', 'es-CO-paisa', 'es-MX-chido', 'x-piglatin', 'ik', 'esu'];
const LOCALE_ALIASES = {
    'es-paisa': 'es-CO-paisa',
    paisa: 'es-CO-paisa',
    'es-mexicano': 'es-MX-chido',
    mexicano: 'es-MX-chido',
    chido: 'es-MX-chido',
};
let I18nService = class I18nService {
    constructor() {
        this.translations = new Map();
        this.loadTranslations();
    }
    resolveLocale(locale) {
        return LOCALE_ALIASES[locale] || locale;
    }
    loadTranslations() {
        const localesDir = path.join(__dirname, 'locales');
        for (const locale of exports.SUPPORTED_LOCALES) {
            if (locale === 'x-piglatin')
                continue;
            const filePath = path.join(localesDir, `${locale}.json`);
            try {
                if (fs.existsSync(filePath)) {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    this.translations.set(locale, data);
                }
            }
            catch { }
        }
        const es = this.translations.get('es') || {};
        const esCO = this.translations.get('es-CO') || {};
        this.translations.set('es-CO', { ...es, ...esCO });
        const esCOPaisa = this.translations.get('es-CO-paisa') || {};
        this.translations.set('es-CO-paisa', { ...es, ...esCO, ...esCOPaisa });
        const esMXChido = this.translations.get('es-MX-chido') || {};
        this.translations.set('es-MX-chido', { ...es, ...esMXChido });
        const en = this.translations.get('en') || {};
        const pigLatin = {};
        for (const [key, value] of Object.entries(en)) {
            pigLatin[key] = this.toPigLatin(value);
        }
        this.translations.set('x-piglatin', pigLatin);
    }
    translate(key, locale = 'es') {
        const resolved = this.resolveLocale(locale);
        const messages = this.translations.get(resolved) || this.translations.get('es') || {};
        return messages[key] || key;
    }
    getTranslations(locale) {
        const resolved = this.resolveLocale(locale);
        return this.translations.get(resolved) || this.translations.get('es') || {};
    }
    getSupportedLocales() {
        const names = {
            en: { code: 'en', name: 'English', nativeName: 'English' },
            es: { code: 'es', name: 'Spanish', nativeName: 'Espanol' },
            'es-CO': { code: 'es-CO', name: 'Spanish (Colombia)', nativeName: 'Espanol (Colombia)' },
            'es-CO-paisa': { code: 'es-CO-paisa', name: 'Spanish (Paisa)', nativeName: 'Espanol (Paisa)' },
            'es-MX-chido': { code: 'es-MX-chido', name: 'Spanish (Mexican Extreme)', nativeName: 'Español Mexicano (¡A Toda Madre!)' },
            'x-piglatin': { code: 'x-piglatin', name: 'Pig Latin', nativeName: 'Pig Latin' },
            ik: { code: 'ik', name: 'Inupiaq', nativeName: 'Inupiaq' },
            esu: { code: 'esu', name: "Yup'ik", nativeName: "Yup'ik (Central Alaskan)" },
        };
        return exports.SUPPORTED_LOCALES.map((code) => names[code] || { code, name: code, nativeName: code });
    }
    isSupported(locale) {
        const resolved = this.resolveLocale(locale);
        return exports.SUPPORTED_LOCALES.includes(resolved);
    }
    toPigLatin(text) {
        if (!text)
            return text;
        const VOWELS = 'aeiouAEIOU';
        return text.replace(/\S+/g, (word) => {
            if (/^\d+$/.test(word) || (/^[A-Z_]+$/.test(word) && word.length > 1))
                return word;
            const leadMatch = word.match(/^([^a-zA-Z]*)/);
            const trailMatch = word.match(/([^a-zA-Z]*)$/);
            const lead = leadMatch ? leadMatch[1] : '';
            const trail = trailMatch ? trailMatch[1] : '';
            const core = word.slice(lead.length, trail.length > 0 ? word.length - trail.length : undefined);
            if (!core || !/[a-zA-Z]/.test(core))
                return word;
            const wasCap = core[0] === core[0].toUpperCase() && core[0] !== core[0].toLowerCase();
            let result;
            if (VOWELS.includes(core[0])) {
                result = core.toLowerCase() + 'way';
            }
            else {
                let i = 0;
                while (i < core.length && !VOWELS.includes(core[i]))
                    i++;
                result =
                    i >= core.length
                        ? core.toLowerCase() + 'ay'
                        : core.slice(i).toLowerCase() + core.slice(0, i).toLowerCase() + 'ay';
            }
            if (wasCap)
                result = result.charAt(0).toUpperCase() + result.slice(1);
            return lead + result + trail;
        });
    }
};
exports.I18nService = I18nService;
exports.I18nService = I18nService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], I18nService);
//# sourceMappingURL=i18n.service.js.map