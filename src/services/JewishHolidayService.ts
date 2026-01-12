export interface JewishHoliday {
    month: string;
    day: number;
    names: Record<string, string>;
    type: 'holiday' | 'fast' | 'minor' | 'erev' | 'rosh_chodesh' | 'chol_hamoed';
    official: boolean;
}

export const fetchJewishHolidays = async (): Promise<JewishHoliday[]> => {
    try {
        const response = await fetch('/SpecialDays/JewishSpecialDays.csv?t=' + Date.now());
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error('Failed to load Jewish holidays CSV:', error);
        return [];
    }
};

const parseCSV = (csvText: string): JewishHoliday[] => {
    const lines = csvText.split('\n');
    const holidays: JewishHoliday[] = [];

    if (lines.length < 2) return [];

    // Parse Headers
    const headerLine = lines[0].trim();
    const headers = parseLine(headerLine);

    // Identify name columns (name_en, name_ru, etc.)
    const nameIndexes: Record<string, number> = {};
    headers.forEach((h, i) => {
        if (h.startsWith('name_')) {
            const lang = h.replace('name_', '');
            nameIndexes[lang] = i;
        }
    });

    // Parse Rows
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = parseLine(line);
        // Script format: Month,Day,Type,Official,name_en,...

        const month = parts[0]?.trim();
        const dayStr = parts[1]?.trim();
        const type = parts[2]?.trim();
        const officialStr = parts[3]?.trim();

        if (month && dayStr) {
            const names: Record<string, string> = {};

            // Extract all languages
            for (const [lang, idx] of Object.entries(nameIndexes)) {
                if (parts[idx]) {
                    names[lang] = parts[idx].trim();
                }
            }

            holidays.push({
                month: month,
                day: parseInt(dayStr, 10),
                names: names,
                type: (type as any) || 'minor',
                official: officialStr?.toLowerCase() === 'true'
            });
        }
    }

    return holidays;
};

// Helper to handle CSV lines with quotes
const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result.map(c => c.replace(/^"|"$/g, '').trim()); // Clean quotes
};
