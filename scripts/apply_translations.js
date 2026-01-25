
import fs from 'fs';
import path from 'path';
import { translations } from './translation_dictionary.js';

const holidaysDir = 'public/UtilityFiles/NationalHolidays';
const jewishDaysPath = 'public/UtilityFiles/JewishSpecialDays.csv';
const muslimDaysPath = 'public/UtilityFiles/MuslimSpecialDays.csv';

const filesToProcess = [
    ...fs.readdirSync(holidaysDir).map(f => path.join(holidaysDir, f)),
    jewishDaysPath,
    muslimDaysPath
];

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    if (lines.length === 0) return;

    // Parse Header
    const header = lines[0].split(',').map(h => h.trim());
    const nameIdx = header.findIndex(h => h.toLowerCase() === 'name' || h.toLowerCase() === 'name_en');

    if (nameIdx === -1) {
        console.warn(`No name column found in ${filePath}`);
        return;
    }

    let changed = false;
    const newLines = [lines[0]];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') {
            newLines.push(lines[i]);
            continue;
        }

        const parts = parseLine(lines[i]);
        while (parts.length < header.length) parts.push('');

        const sourceName = parts[nameIdx].trim();
        let transEntry = translations[sourceName];

        if (!transEntry) {
            // Check keys (case insensitive and fuzzy)
            const key = Object.keys(translations).find(k => sourceName.toLowerCase().includes(k.toLowerCase()));
            if (key) transEntry = translations[key];
        }

        if (transEntry) {
            const updatedParts = parts.map((val, idx) => {
                const colName = header[idx].toLowerCase();
                const baseLang = colName.startsWith('name_') ? colName.replace('name_', '') : colName.split('-')[0];

                if (transEntry[baseLang]) {
                    const targetVal = transEntry[baseLang];
                    const currentVal = val.trim();

                    // If target is Hebrew, and current is not Hebrew, or if they are just different and target is available
                    if (currentVal !== targetVal) {
                        return targetVal;
                    }
                }
                return val;
            });

            const joined = updatedParts.map(p => p.includes(',') ? `"${p}"` : p).join(',');
            if (joined !== lines[i].trim()) {
                changed = true;
                newLines.push(joined);
                continue;
            }
        }

        newLines.push(lines[i]);
    }

    if (changed) {
        fs.writeFileSync(filePath, newLines.join('\n'));
        console.log(`Translated ${path.basename(filePath)}`);
    }
}

// Simple CSV line parser to handle quotes
function parseLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result.map(s => s.trim().replace(/^"|"$/g, ''));
}

filesToProcess.filter(f => f.endsWith('.csv')).forEach(f => {
    processFile(f);
});
