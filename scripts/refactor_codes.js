
import fs from 'fs';
import path from 'path';
import languageMap from './language_map.js';

const holidayDir = 'public/UtilityFiles/NationalHolidays';
const languageListPath = 'public/UtilityFiles/LanguageList.csv';
const countryDataPath = 'public/UtilityFiles/CountryData.csv';

// 1. Update LanguageList.csv
if (fs.existsSync(languageListPath)) {
    const lines = fs.readFileSync(languageListPath, 'utf-8').split('\n');
    const newLines = lines.map(line => {
        if (!line.trim()) return line;
        const parts = line.split(',');
        const code = parts[0].trim();
        if (languageMap[code]) {
            parts[0] = languageMap[code];
            return parts.join(',');
        }
        return line;
    });
    fs.writeFileSync(languageListPath, newLines.join('\n'));
    console.log('Updated LanguageList.csv');
}

// 2. Update CountryData.csv
if (fs.existsSync(countryDataPath)) {
    const lines = fs.readFileSync(countryDataPath, 'utf-8').split('\n');
    const newLines = [];
    const header = lines[0];
    newLines.push(header);

    // Header: Country,LanguageCode,HolidayFile,CalendarType
    // Indices: 0, 1, 2, 3

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
            newLines.push(line);
            continue;
        }
        const parts = line.split(',').map(s => s.trim());
        const langCode = parts[1];

        if (languageMap[langCode]) {
            parts[1] = languageMap[langCode];
        }
        newLines.push(parts.join(','));
    }
    fs.writeFileSync(countryDataPath, newLines.join('\n'));
    console.log('Updated CountryData.csv');
}

// 3. Update Holiday CSV Headers
const files = fs.readdirSync(holidayDir);
files.forEach(file => {
    if (!file.endsWith('.csv')) return;
    const filePath = path.join(holidayDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    if (lines.length === 0) return;

    const header = lines[0].split(',').map(s => s.trim());
    const newHeader = header.map(col => {
        // Check if this column name is a language code in our map
        if (languageMap[col]) {
            return languageMap[col];
        }
        return col;
    });

    if (newHeader.join(',') !== header.join(',')) {
        lines[0] = newHeader.join(',');
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log(`Updated header in ${file}`);
    }
});
