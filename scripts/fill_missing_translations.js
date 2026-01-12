
import fs from 'fs';
import path from 'path';

const holidaysDir = 'public/UtilityFiles/NationalHolidays';
const targetFile = process.argv[2]; // Optional: passed filename like "Israel.csv"

function processFile(filename) {
    const filePath = path.join(holidaysDir, filename);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    if (lines.length === 0) return;

    const header = lines[0].split(',').map(h => h.trim());
    const nameIdx = header.findIndex(h => h.toLowerCase() === 'name');
    const enIdx = header.findIndex(h => h.toLowerCase() === 'en');

    // Identify translation columns (all 2-letter codes, excluding 'en' if we treat it special, but actually it's just another column)
    // Actually we iterate all columns that are language codes.
    // Simpler: Iterate all columns. If header is a lang code (len=2), and value is empty, fill with fallback.

    // We can use the language list if needed, or just heuristic (len=2 + specific codes like fil/zh).
    // Let's rely on checking if the value is empty.

    let changed = false;
    const newLines = [lines[0]]; // Keep header

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') {
            newLines.push(lines[i]);
            continue;
        }

        const parts = lines[i].split(',');

        // Ensure row has enough columns
        while (parts.length < header.length) {
            parts.push('');
        }

        // Helper to get fallback
        const nameVal = nameIdx !== -1 ? parts[nameIdx] : '';
        const enVal = enIdx !== -1 ? parts[enIdx] : '';
        const fallback = enVal || nameVal || 'Holiday'; // Absolute fallback

        // We need to preserve the struct, just fill empty parts.
        // But be careful about which columns we touch. 
        // We only want to touch LANGUAGE columns. 
        // Date(0), Name(1), Type(2), Calendar(3) are metadata.
        // Assuming strict structure: Date,Name,Type,Calendar, ... languages ...

        const metadataCols = ['date', 'name', 'type', 'calendar'];

        const updatedParts = parts.map((val, idx) => {
            const colName = header[idx].toLowerCase();
            if (metadataCols.includes(colName)) return val;

            // It's a language column (presumably)
            if (!val || val.trim() === '') {
                return fallback;
            }
            return val;
        });

        if (updatedParts.join(',') !== parts.join(',')) {
            changed = true;
        }
        newLines.push(updatedParts.join(','));
    }

    if (changed) {
        fs.writeFileSync(filePath, newLines.join('\n'));
        console.log(`Updated ${filename}: Filled missing translations.`);
    } else {
        console.log(`No missing translations in ${filename}.`);
    }
}

if (targetFile) {
    if (path.basename(targetFile) !== targetFile) {
        // Handle full path input
        processFile(path.basename(targetFile));
    } else {
        processFile(targetFile);
    }
} else {
    // Process all
    const files = fs.readdirSync(holidaysDir);
    files.forEach(f => {
        if (f.endsWith('.csv')) processFile(f);
    });
}
