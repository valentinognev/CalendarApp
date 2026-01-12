export interface MuslimHoliday {
    month: string;
    day: number;
    names: Record<string, string>;
    type: 'holiday' | 'minor';
    official: boolean;
}

export const fetchMuslimHolidays = async (): Promise<MuslimHoliday[]> => {
    try {
        const response = await fetch('/UtilityFiles/MuslimSpecialDays.csv?t=' + Date.now());
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error('Failed to load Muslim holidays CSV:', error);
        return [];
    }
};

// Format: "Ramadan 1, 1447" or similar depending on browser options
const HIJRI_FORMATTER = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});

export const getHijriDate = (date: Date) => {
    // "Ramadan 1, 1447 AH" -> parts
    const parts = HIJRI_FORMATTER.formatToParts(date);
    const month = parts.find(p => p.type === 'month')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';

    return { month, day: parseInt(day, 10), year };
};

const parseCSV = (csvText: string): MuslimHoliday[] => {
    const lines = csvText.split('\n');
    const holidays: MuslimHoliday[] = [];

    if (lines.length < 2) return [];

    // Parse Headers
    const headerLine = lines[0].trim();
    const headers = parseLine(headerLine);

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
        // Month,Day,Type,Official,...names
        const month = parts[0]?.trim();
        const dayStr = parts[1]?.trim();
        const type = parts[2]?.trim();
        const officialStr = parts[3]?.trim();

        if (month && dayStr) {
            const names: Record<string, string> = {};
            for (const [lang, idx] of Object.entries(nameIndexes)) {
                if (parts[idx]) names[lang] = parts[idx].trim();
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

const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else current += char;
    }
    result.push(current);
    return result.map(c => c.replace(/^"|"$/g, '').trim());
};
