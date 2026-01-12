
import fs from 'fs';
import path from 'path';

const holidaysDir = 'public/UtilityFiles/NationalHolidays';
const languageListPath = 'public/UtilityFiles/LanguageList.csv';

// 1. Load Master Language List
const langContent = fs.readFileSync(languageListPath, 'utf-8');
const langLines = langContent.split('\n').filter(l => l.trim() !== '');
const masterLanguages = [];

// Skip header if present (LanguageCode)
const startIndex = langLines[0].toLowerCase().includes('languagecode') ? 1 : 0;
for (let i = startIndex; i < langLines.length; i++) {
    // Parse CSV line: Code,Name
    const parts = langLines[i].split(',');
    const code = parts[0].trim();
    if (code) masterLanguages.push(code);
}

console.log(`Loaded ${masterLanguages.length} master languages.`);

// 2. Process Holiday Files
const files = fs.readdirSync(holidaysDir);

files.forEach(file => {
    if (file.endsWith('.csv')) {
        const filePath = path.join(holidaysDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        if (lines.length > 0) {
            const headerLine = lines[0].trim();
            const currentHeader = headerLine.split(',').map(h => h.trim());

            // Identify missing languages
            const missingLangs = masterLanguages.filter(lang => !currentHeader.includes(lang));

            if (missingLangs.length === 0) {
                // console.log(`Skipping ${file} - all languages present.`);
                return;
            }

            // Create new header
            // We append missing languages at the end
            const newHeader = headerLine + ',' + missingLangs.join(',');

            // Update all lines
            const newLines = [];
            newLines.push(newHeader);

            const addedColCount = missingLangs.length;
            const emptySuffix = ','.repeat(addedColCount); // e.g. ",,,"

            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '') continue;
                newLines.push(lines[i].trim() + emptySuffix);
            }

            fs.writeFileSync(filePath, newLines.join('\n'));
            console.log(`Updated ${file}: Added ${missingLangs.length} missing languages.`);
        }
    }
});
