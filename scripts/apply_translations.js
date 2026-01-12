
import fs from 'fs';
import path from 'path';
import { translations } from './translation_dictionary.js';

const holidaysDir = 'public/UtilityFiles/NationalHolidays';

function processFile(filename) {
    const filePath = path.join(holidaysDir, filename);
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    if (lines.length === 0) return;

    // Parse Header
    const header = lines[0].split(',').map(h => h.trim());

    // Find index of English column (or Name column as source)
    // We already autofilled 'en' column so we can use it, or 'Name'. 
    // Usually 'Name' is the English default in our dataset.
    const nameIdx = header.findIndex(h => h.toLowerCase() === 'name');

    let changed = false;
    const newLines = [lines[0]];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') {
            newLines.push(lines[i]);
            continue;
        }

        const parts = lines[i].split(',');
        // Handle ragged rows just in case, though previous script fixed it
        while (parts.length < header.length) parts.push('');

        const englishName = nameIdx !== -1 ? parts[nameIdx].trim() : '';

        // Normalize name for lookup (remove "Observed" etc if needed, but dictionary keys are exact for now)
        // Try exact match first

        let transEntry = translations[englishName];

        // If not exact match, try fuzzy? (Review dictionary keys: New Year's Day, etc.)
        // Simple heuristic: if includes "New Year's Day", use that key.
        if (!transEntry) {
            // Check keys
            const key = Object.keys(translations).find(k => englishName.toLowerCase().includes(k.toLowerCase()));
            if (key) transEntry = translations[key];
        }

        if (transEntry) {
            // Apply translations
            const updatedParts = parts.map((val, idx) => {
                const colName = header[idx].toLowerCase();
                // Extract base lang code (he-ISR -> he)
                const baseLang = colName.split('-')[0];

                // If it's a language column and we have a translation for it
                if (transEntry[baseLang]) {
                    // Update only if it looks like English (or just overwrite? "thay have to be translated")
                    return transEntry[baseLang];
                }
                return val;
            });
            if (updatedParts.join(',') !== parts.join(',')) {
                changed = true;
                newLines.push(updatedParts.join(','));
                continue;
            }
        }

        newLines.push(parts.join(','));
    }

    if (changed) {
        fs.writeFileSync(filePath, newLines.join('\n'));
        console.log(`Translated ${filename}`);
    }
}

const files = fs.readdirSync(holidaysDir);
files.forEach(f => {
    if (f.endsWith('.csv')) processFile(f);
});
