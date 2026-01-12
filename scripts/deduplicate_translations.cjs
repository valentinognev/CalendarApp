const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/translations.ts');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const lines = data.split('\n');
    const newLines = [];
    let currentLang = null;
    let seenKeys = new Set();

    // Regex to detect start of a language block: e.g. "    en: {"
    const langStartRegex = /^\s+([a-z]{2,3}(?:-[A-Z]{2})?):\s*\{/;
    // Regex to detect end of a language block: "    },"
    const langEndRegex = /^\s+\},/;
    // Regex to detect a key-value pair: "        key: 'value',"
    const keyRegex = /^\s+([a-zA-Z0-9_]+):/;

    for (const line of lines) {
        // Check for block start
        const langMatch = line.match(langStartRegex);
        if (langMatch) {
            currentLang = langMatch[1];
            seenKeys = new Set();
            newLines.push(line);
            continue;
        }

        // Check for block end
        if (currentLang && langEndRegex.test(line)) {
            currentLang = null;
            seenKeys = new Set();
            newLines.push(line);
            continue;
        }

        // If inside a block, check for keys
        if (currentLang) {
            const keyMatch = line.match(keyRegex);
            if (keyMatch) {
                const key = keyMatch[1];
                if (seenKeys.has(key)) {
                    // Duplicate key, skip this line
                    // console.log(`Removing duplicate key '${key}' in language '${currentLang}'`);
                    continue;
                }
                seenKeys.add(key);
            }
        }

        newLines.push(line);
    }

    const output = newLines.join('\n');
    fs.writeFile(filePath, output, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Translations deduplicated successfully.');
        }
    });
});
