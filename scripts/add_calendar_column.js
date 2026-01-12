
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
            const currentHeader = lines[0].trim();
            let newHeader = currentHeader;

            // Check if Calendar already exists
            if (!currentHeader.toLowerCase().includes('calendar')) {
                // Insert Calendar after Type
                if (currentHeader.includes(',Type,')) {
                    newHeader = currentHeader.replace(',Type,', ',Type,Calendar,');
                } else if (currentHeader.endsWith(',Type')) {
                    newHeader = currentHeader + ',Calendar';
                } else {
                    // Fallback or if languages are already appended without Calendar
                    // e.g., Date,Name,Type,am...
                    // Regex to find position after Type
                    const typeMatch = currentHeader.match(/(Type)/i);
                    if (typeMatch) {
                        const idx = typeMatch.index + typeMatch[0].length;
                        newHeader = currentHeader.slice(0, idx) + ',Calendar' + currentHeader.slice(idx);
                    }
                }

                lines[0] = newHeader;
                fs.writeFileSync(filePath, lines.join('\n'));
                console.log(`Added Calendar column to ${file}`);
            } else {
                console.log(`Skipping ${file} - already has Calendar`);
            }
        }
    }
});
