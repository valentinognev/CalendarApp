import fs from 'fs';
import path from 'path';

const outputPath = path.resolve('public/UtilityFiles/JewishSpecialDays.csv');

// 50 Common Languages (ISO 639-1)
const LANGUAGES = [
    'en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'pt', 'ru', 'ur',
    'id', 'de', 'ja', 'sw', 'mr', 'te', 'tr', 'ta', 'pa', 'ko',
    'vi', 'it', 'th', 'fa', 'pl', 'uk', 'ro', 'nl', 'el', 'hu',
    'sv', 'cs', 'da', 'fi', 'he', 'no', 'sk', 'hr', 'bg', 'sl',
    'lt', 'lv', 'et', 'sr', 'ca', 'ms', 'fil', 'am', 'gu', 'kn'
];

// Base Holiday Data (Month, Day, Type, Official, English Name)
const HOLIDAYS = [
    { month: 'Nisan', day: 15, type: 'holiday', official: true, name: 'Passover 1' },
    { month: 'Nisan', day: 16, type: 'holiday', official: true, name: 'Passover 2' },
    { month: 'Nisan', day: 21, type: 'holiday', official: true, name: 'Passover 7' },
    { month: 'Nisan', day: 22, type: 'holiday', official: true, name: 'Passover 8' },
    { month: 'Iyyar', day: 5, type: 'minor', official: false, name: 'Yom HaAtzmaut' },
    { month: 'Sivan', day: 6, type: 'holiday', official: true, name: 'Shavuot 1' },
    { month: 'Sivan', day: 7, type: 'holiday', official: true, name: 'Shavuot 2' },
    { month: 'Tishrei', day: 1, type: 'holiday', official: true, name: 'Rosh Hashanah 1' },
    { month: 'Tishrei', day: 2, type: 'holiday', official: true, name: 'Rosh Hashanah 2' },
    { month: 'Tishrei', day: 10, type: 'holiday', official: true, name: 'Yom Kippur' },
    { month: 'Tishrei', day: 15, type: 'holiday', official: true, name: 'Sukkot 1' },
    { month: 'Tishrei', day: 16, type: 'holiday', official: true, name: 'Sukkot 2' },
    { month: 'Tishrei', day: 22, type: 'holiday', official: true, name: 'Shemini Atzeret' },
    { month: 'Tishrei', day: 23, type: 'holiday', official: true, name: 'Simchat Torah' },
    { month: 'Kislev', day: 25, type: 'minor', official: false, name: 'Hanukkah 1' },
    { month: 'Adar', day: 14, type: 'minor', official: false, name: 'Purim' },
    { month: 'Adar I', day: 14, type: 'minor', official: false, name: 'Purim Katan' },
    { month: 'Adar II', day: 14, type: 'minor', official: false, name: 'Purim' },
    { month: 'Av', day: 9, type: 'fast', official: false, name: 'Tisha B\'Av' },
    { month: 'Tishrei', day: 3, type: 'fast', official: false, name: 'Fast of Gedaliah' },
    { month: 'Tevet', day: 10, type: 'fast', official: false, name: 'Asara B\'Tevet' },
    { month: 'Tamuz', day: 17, type: 'fast', official: false, name: '17th of Tammuz' },
    { month: 'Adar', day: 13, type: 'fast', official: false, name: 'Fast of Esther' },
    { month: 'Adar II', day: 13, type: 'fast', official: false, name: 'Fast of Esther' }
];

// Translations Dictionary (Simplified for this script - using English as fallback for missing)
// In a real scenario, we'd fetch these from a translation API.
// For this task, I'll provide translations for key holidays in key languages and fallback to English.
const TRANSLATIONS = {
    'Rosh Hashanah': {
        en: 'Rosh Hashanah', ru: 'Рош а-Шана', he: 'ראש השנה', es: 'Rosh Hashanah', fr: 'Roch Hachana', de: 'Rosch ha-Schana',
        uk: 'Рош га-Шана', pl: 'Rosz ha-Szana', it: 'Rosh haShana'
    },
    'Yom Kippur': {
        en: 'Yom Kippur', ru: 'Йом Кипур', he: 'יום כיפור', es: 'Yom Kipur', fr: 'Yom Kippour', de: 'Jom Kippur',
        uk: 'Йом-Кіпур', pl: 'Jom Kippur', it: 'Yom Kippur'
    },
    'Passover': {
        en: 'Passover', ru: 'Песах', he: 'פסח', es: 'Pésaj', fr: 'Pessa\'h', de: 'Pessach',
        uk: 'Песах', pl: 'Pascha', it: 'Pesach'
    },
    'Shavuot': {
        en: 'Shavuot', ru: 'Шавуот', he: 'שבועות', es: 'Shavuot', fr: 'Chavouot', de: 'Schawuot',
        uk: 'Шавуот', pl: 'Szawuot', it: 'Shavuot'
    },
    'Sukkot': {
        en: 'Sukkot', ru: 'Суккот', he: 'סוכות', es: 'Sucot', fr: 'Souccot', de: 'Sukkot',
        uk: 'Суккот', pl: 'Sukkot', it: 'Sukkot'
    },
    'Hanukkah': {
        en: 'Hanukkah', ru: 'Ханука', he: 'חנוכה', es: 'Jánuca', fr: 'Hanoucca', de: 'Chanukka',
        uk: 'Ханука', pl: 'Chanuka', it: 'Chanukkah'
    },
    'Purim': {
        en: 'Purim', ru: 'Пурим', he: 'פורים', es: 'Purim', fr: 'Pourim', de: 'Purim',
        uk: 'Пурим', pl: 'Purim', it: 'Purim'
    },
    'Tisha B\'Av': {
        en: 'Tisha B\'Av', ru: '9 Ава', he: 'תשעה באב', es: 'Tisha b\'Av', fr: 'Tisha Beav', de: 'Tisch’a beAv',
        uk: '9 Ава', pl: 'Tisza be-Aw', it: 'Tisha BeAv'
    }
};

// Generate Rows
const rows = [];
// Header: Month,Day,Type,Official,name_en,name_ru,...
const header = ['Month', 'Day', 'Type', 'Official', ...LANGUAGES.map(l => `name_${l}`)].join(',');
rows.push(header);

for (const h of HOLIDAYS) {
    const row = [h.month, h.day, h.type, h.official];

    // Determine base name for lookup (e.g., "Passover 1" -> "Passover")
    // Very simple loose matching
    let baseKey = null;
    if (h.name.includes('Passover')) baseKey = 'Passover';
    else if (h.name.includes('Rosh Hashanah')) baseKey = 'Rosh Hashanah';
    else if (h.name.includes('Yom Kippur')) baseKey = 'Yom Kippur';
    else if (h.name.includes('Shavuot')) baseKey = 'Shavuot';
    else if (h.name.includes('Sukkot')) baseKey = 'Sukkot';
    else if (h.name.includes('Hanukkah')) baseKey = 'Hanukkah';
    else if (h.name.includes('Purim')) baseKey = 'Purim';
    else if (h.name.includes('Tisha')) baseKey = 'Tisha B\'Av';

    for (const lang of LANGUAGES) {
        let name = h.name; // Default to English name in struct
        if (baseKey && TRANSLATIONS[baseKey] && TRANSLATIONS[baseKey][lang]) {
            // If we have a translation for the base name, use it.
            // If the original name had a suffix (e.g. " 1"), append it/keep it? 
            // For now, just use the specific translation if exact, or append number?
            // "Passover 1" -> "Pesach 1"?
            const trans = TRANSLATIONS[baseKey][lang];
            const suffix = h.name.replace(baseKey, '').trim();
            name = suffix ? `${trans} ${suffix}` : trans;
        } else if (lang === 'he' && TRANSLATIONS[baseKey] && TRANSLATIONS[baseKey].he) {
            // Fallback for hebrew specifically if not handled above
            const trans = TRANSLATIONS[baseKey].he;
            name = trans; // Simplification
        }

        // Escape commas
        if (name.includes(',')) name = `"${name}"`;
        row.push(name);
    }
    rows.push(row.join(','));
}

fs.writeFileSync(outputPath, rows.join('\n'));
console.log(`Generated ${outputPath} with ${LANGUAGES.length} languages.`);
