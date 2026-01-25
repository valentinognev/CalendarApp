
export interface NationalHoliday {
    date: string; // YYYY-MM-DD
    name: string;
    names: Record<string, string>;
    type: 'public' | 'observance';
    calendarType?: 'gregorian' | 'jewish' | 'muslim';
}

export interface CountryInfo {
    country: string;
    languageCode: string;
    filename: string;
    calendarType: 'gregorian' | 'jewish' | 'muslim';
    lat?: number;
    long?: number;
}

export const fetchCountryList = async (): Promise<CountryInfo[]> => {
    try {
        const response = await fetch('UtilityFiles/CountryData.csv');
        if (!response.ok) return [];
        const text = await response.text();

        const lines = text.split('\n').filter(line => line.trim() !== '');
        const countries: CountryInfo[] = [];

        // Skip header if exists (Country,LanguageCode,HolidayFile)
        const startIndex = lines[0].startsWith('Country') ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
            const [country, languageCode, filename, calendarType, lat, long] = lines[i].split(',').map(s => s.trim());
            if (country && filename) {
                countries.push({
                    country,
                    languageCode: languageCode || 'en',
                    filename,
                    calendarType: (calendarType as any) || 'gregorian',
                    lat: lat ? parseFloat(lat) : undefined,
                    long: long ? parseFloat(long) : undefined
                });
            }
        }

        // Sort alphabetically by Country Name
        return countries.sort((a, b) => a.country.localeCompare(b.country));
    } catch (error) {
        console.error('Error fetching country list:', error);
        return [];
    }
};

export const fetchNationalHolidays = async (filename: string): Promise<NationalHoliday[]> => {
    try {
        const response = await fetch(`UtilityFiles/NationalHolidays/${filename}`);
        if (!response.ok) return [];
        const text = await response.text();

        const lines = text.split('\n').filter(line => line.trim() !== '');
        const holidays: NationalHoliday[] = [];

        if (lines.length === 0) return [];

        // Parse Header
        const header = lines[0].split(',').map(h => h.trim());
        const dateIdx = 0; // Date is always first
        const nameIdx = header.findIndex(h => h.toLowerCase() === 'name');
        const typeIdx = header.findIndex(h => h.toLowerCase() === 'type');
        // 'Calendar' or 'CalendarType'
        const calIdx = header.findIndex(h => h.toLowerCase().includes('calendar'));

        // Identify language columns
        const langMap: Record<number, string> = {};
        header.forEach((col, idx) => {
            const c = col.toLowerCase();
            // Store if it's not a standard column and looks like a lang code or just extra
            if (idx !== dateIdx && idx !== nameIdx && idx !== typeIdx && idx !== calIdx && c) {
                // Normalize: he-ISR -> he
                langMap[idx] = c.split('-')[0];
            }
        });

        const startIndex = 1;

        for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].split(',').map(s => s.trim());

            if (parts.length > dateIdx) {
                const date = parts[dateIdx];
                const defaultName = nameIdx !== -1 && parts[nameIdx] ? parts[nameIdx].replace(/^"(.*)"$/, '$1') : '';
                const type = typeIdx !== -1 && parts[typeIdx] ? parts[typeIdx].toLowerCase() : 'public';
                const calendarType = calIdx !== -1 && parts[calIdx] ? parts[calIdx].toLowerCase() : undefined;

                const names: Record<string, string> = {};
                if (defaultName) names['en'] = defaultName;

                // Collect translations
                Object.entries(langMap).forEach(([idxStr, langCode]) => {
                    const idx = parseInt(idxStr);
                    if (parts[idx]) {
                        names[langCode] = parts[idx].replace(/^"(.*)"$/, '$1');
                    }
                });

                const name = defaultName || Object.values(names)[0] || '';

                if (date && name) {
                    holidays.push({
                        date,
                        name,
                        names,
                        type: type as 'public' | 'observance',
                        calendarType: (calendarType as any) // 'gregorian' | 'jewish' | 'muslim'
                    });
                }
            }
        }
        return holidays;
    } catch (error) {
        console.error(`Error fetching holidays for ${filename}:`, error);
        return [];
    }
};
