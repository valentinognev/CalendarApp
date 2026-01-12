import type { Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Helper to create a minimal locale with custom day/month names
// We fall back to enUS for everything else to strictly avoid crashes
const createCustomLocale = (code: string, days: string[], daysShort: string[], months: string[], monthsShort: string[]): Locale => {
    return {
        ...enUS,
        code: code,
        localize: {
            ...enUS.localize,
            month: (n: number, options?: any) => {
                if (options?.width === 'abbreviated') return monthsShort[n];
                return months[n];
            },
            day: (n: number, options?: any) => {
                if (options?.width === 'short' || options?.width === 'abbreviated') return daysShort[n];
                return days[n];
            }
        } as any // Cast to avoid complex type matching for now
    };
};

// 1. Urdu (ur)
const urDays = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
const urMonths = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
export const ur = createCustomLocale('ur', urDays, urDays, urMonths, urMonths);

// 2. Swahili (sw)
const swDays = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'];
const swDaysShort = ['J2', 'J3', 'J4', 'J5', 'Alh', 'Ij', 'J1'];
const swMonths = ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'];
const swMonthsShort = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'];
export const sw = createCustomLocale('sw', swDays, swDaysShort, swMonths, swMonthsShort);

// 3. Marathi (mr)
const mrDays = ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const mrMonths = ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];
export const mr = createCustomLocale('mr', mrDays, mrDays, mrMonths, mrMonths);

// 4. Punjabi (pa) - Gurmukhi
const paDays = ['ਐਤਵਾਰ', 'ਸੋਮਵਾਰ', 'ਮੰਗਲਵਾਰ', 'ਬੁੱਧਵਾਰ', 'ਵੀਰਵਾਰ', 'ਸ਼ੁੱਕਰਵਾਰ', 'ਸ਼ਨੀਵਾਰ'];
const paMonths = ['ਜਨਵਰੀ', 'ਫ਼ਰਵਰੀ', 'ਮਾਰਚ', 'ਅਪ੍ਰੈਲ', 'ਮਈ', 'ਜੂਨ', 'ਜੁਲਾਈ', 'ਅਗਸਤ', 'ਸਤੰਬਰ', 'ਅਕਤੂਬਰ', 'ਨਵੰਬਰ', 'ਦਸੰਬਰ'];
export const pa = createCustomLocale('pa', paDays, paDays, paMonths, paMonths);

// 5. Amharic (am)
const amDays = ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'];
const amMonths = ['ጃንዋሪ', 'ፌብሩዋሪ', 'ማርች', 'አፕሪል', 'ሜይ', 'ጁን', 'ጁላይ', 'ኦገስት', 'ሴፕቴምበር', 'ኦክቶበር', 'ኖቬምበር', 'ዲሴምበር'];
export const am = createCustomLocale('am', amDays, amDays, amMonths, amMonths);

// 6. Filipino (fil)
const filDays = ['Linggo', 'Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado'];
const filDaysShort = ['Lin', 'Lun', 'Mar', 'Miy', 'Huw', 'Biy', 'Sab'];
const filMonths = ['Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo', 'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre'];
const filMonthsShort = ['Ene', 'Peb', 'Mar', 'Abr', 'May', 'Hun', 'Hul', 'Ago', 'Set', 'Okt', 'Nob', 'Dis'];
export const fil = createCustomLocale('fil', filDays, filDaysShort, filMonths, filMonthsShort);
