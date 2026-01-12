
import fs from 'fs';
import path from 'path';

const countryDataPath = 'public/UtilityFiles/CountryData.csv';
const holidaysDir = 'public/UtilityFiles/NationalHolidays';

// 1. Load Country Defaults
const countryDefaults = {};
const countryDataContent = fs.readFileSync(countryDataPath, 'utf-8');
const countryLines = countryDataContent.split('\n').filter(l => l.trim() !== '');

// Skip header (Country,LanguageCode,HumanReadableFilename,CalendarType - or similar)
// Check header to find indices
const cHeader = countryLines[0].split(',').map(s => s.trim().toLowerCase());
const fileIdx = cHeader.findIndex(h => h.includes('filename') || h.includes('file'));
const calIdx = cHeader.findIndex(h => h.includes('calendar'));

if (fileIdx === -1 || calIdx === -1) {
    console.error("Could not find Filename or CalendarType in CountryData.csv");
    process.exit(1);
}

for (let i = 1; i < countryLines.length; i++) {
    const parts = countryLines[i].split(',').map(s => s.trim());
    if (parts.length > Math.max(fileIdx, calIdx)) {
        const filename = parts[fileIdx];
        const calendar = parts[calIdx] || 'gregorian';
        countryDefaults[filename] = calendar.toLowerCase();
    }
}

// 2. Process Holiday Files
const files = fs.readdirSync(holidaysDir);

files.forEach(file => {
    if (file.endsWith('.csv')) {
        const filePath = path.join(holidaysDir, file);
        const defaultCal = countryDefaults[file] || 'gregorian'; // Default to gregorian if not found

        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        if (lines.length > 0) {
            const header = lines[0].split(',').map(h => h.trim());
            const calColIdx = header.findIndex(h => h.toLowerCase() === 'calendar');

            if (calColIdx === -1) {
                console.log(`Skipping ${file} - no Calendar column in header`);
                return;
            }

            let changed = false;
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '') continue;

                // Be careful with split if there are quoted commas (our current simple CSVs don't have them yet)
                const parts = lines[i].split(',');

                // Ensure row has enough parts to reach Calendar column
                // If parts.length <= calColIdx, we need to extend
                while (parts.length <= calColIdx) {
                    parts.push('');
                }

                const currentCal = parts[calColIdx].trim();

                if (!currentCal) {
                    parts[calColIdx] = defaultCal;
                    lines[i] = parts.join(',');
                    changed = true;
                }
            }

            if (changed) {
                fs.writeFileSync(filePath, lines.join('\n'));
                console.log(`Populated ${file} with default calendar: ${defaultCal}`);
            }
        }
    }
});
