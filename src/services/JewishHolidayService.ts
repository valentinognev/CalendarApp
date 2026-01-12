export interface JewishHoliday {
    month: string;
    day: number;
    nameEn: string;
    nameRu: string;
    nameHe: string;
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

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',');
        // Handle potential extra commas in names/notes by not strictly checking length, but ensuring main fields exist
        const month = parts[0]?.trim();
        const dayStr = parts[1]?.trim();
        const nameEn = parts[2]?.trim();
        const nameRu = parts[3]?.trim();
        const nameHe = parts[4]?.trim();
        const type = parts[5]?.trim();
        const officialStr = parts[6]?.trim();

        if (month && dayStr) {
            holidays.push({
                month: month,
                day: parseInt(dayStr, 10),
                nameEn: nameEn || '',
                nameRu: nameRu || '',
                nameHe: nameHe || '',
                type: (type as any) || 'minor',
                official: officialStr?.toLowerCase() === 'true'
            });
        }
    }

    return holidays;
};
