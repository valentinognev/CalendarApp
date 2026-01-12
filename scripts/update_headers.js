
import fs from 'fs';
import path from 'path';

const dir = 'public/UtilityFiles/NationalHolidays';
const languages = [
    'am', 'ar', 'bn', 'bg', 'ca', 'zh', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fil', 'fi', 'fr', 'de', 'el', 'gu', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'kn', 'ko', 'lv', 'lt', 'ms', 'mr', 'no', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sr', 'sk', 'sl', 'es', 'sw', 'sv', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'vi'
];

const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.csv')) {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        if (lines.length > 0) {
            // Check if already updated (check for 'am,ar')
            if (lines[0].includes('am,ar')) {
                console.log(`Skipping ${file} - already updated`);
                return;
            }

            const currentHeader = lines[0].trim();
            // Append all language codes to the header
            const newHeader = currentHeader + ',' + languages.join(',');

            lines[0] = newHeader;

            // For rows, we technically don't need to add commas if our parser handles out of bounds,
            // but for CSV correctness we usually should. 
            // However, typical CSV parsers (and mine) might handle missing trailing commas.
            // My code: `const parts = lines[i].split(',')`. If split gives fewer parts, `parts[idx]` is undefined.
            // So updating just header is safe for my parser.
            // But excel/editors might complain.
            // Let's just update the header.

            fs.writeFileSync(filePath, lines.join('\n'));
            console.log(`Updated header for ${file}`);
        }
    }
});
