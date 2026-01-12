import {
    enUS, ru, he, zhCN, es, fr, de, pt, it, ja, ko, hi, tr, nl,
    sv, pl, vi, th, uk, ar, id, nb, fi, da, cs, hu, ro, el, sk, hr, faIR, bn,
    te, ta, kn, gu, ms, sr, lt, lv, et, ca, bg, sl
} from 'date-fns/locale';

import {
    ur, sw, mr, pa, am, fil
} from './customDateLocales';

// Explicitly mapping supported languages to their date-fns locale
// If a language is not here, it will require a fallback in the consumer
export const LOCALE_MAP: Record<string, any> = {
    en: enUS, ru, he, zh: zhCN, es, fr, de, pt, it, ja, ko, hi, tr, nl,
    sv, pl, vi, th, uk, ar, id, no: nb, fi, da, cs, hu, ro, el, sk, hr, fa: faIR, bn,
    te, ta, kn, gu, ms, sr, lt, lv, et, ca, bg, sl,
    // Custom Locales
    ur, sw, mr, pa, am, fil,
    // Add generic mappings for dialects if needed
    'pt-BR': pt,
};

export const getLocale = (langCode: string) => {
    return LOCALE_MAP[langCode] || enUS;
};
