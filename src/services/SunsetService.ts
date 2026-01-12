import { getDayOfYear } from 'date-fns';

type SunsetMap = Map<number, Record<string, string>>;

let sunsetCache: SunsetMap | null = null;
let isFetching = false;

export const fetchSunsetTimes = async (): Promise<SunsetMap> => {
    if (sunsetCache) return sunsetCache;
    if (isFetching) {
        // Simple wait loop if already fetching (or could return promise)
        // For simplicity, just refetch or wait.
        // In a real app we'd use a shared promise.
        // Let's just return empty until loaded.
        return new Map();
    }

    isFetching = true;
    try {
        const response = await fetch('/SpecialDays/SunsetTimes.csv?t=' + Date.now());
        const text = await response.text();
        sunsetCache = parseSunsetCSV(text);
        return sunsetCache;
    } catch (error) {
        console.error('Failed to load Sunset times:', error);
        return new Map(); // Return empty map on error
    } finally {
        isFetching = false;
    }
};

const parseSunsetCSV = (csvText: string): SunsetMap => {
    const lines = csvText.split('\n');
    const map = new Map<number, Record<string, string>>();

    if (lines.length < 2) return map;

    // Header: DayOfYear,Lat_66,Lat_65...
    const headers = lines[0].trim().split(',');

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',');
        const dayOfYear = parseInt(parts[0], 10);

        if (isNaN(dayOfYear)) continue;

        const rowData: Record<string, string> = {};
        for (let j = 1; j < headers.length; j++) {
            rowData[headers[j]] = parts[j];
        }

        map.set(dayOfYear, rowData);
    }

    return map;
};

export const getSunsetTime = (date: Date, lat: number, sunsetData: SunsetMap): string | null => {
    // 1. Get Day of Year
    // Note: Sunset table is for a leap year (366 days). 
    // If current year is non-leap (365), day 366 (Dec 31) needs handling? 
    // date-fns getDayOfYear returns 1-365 or 366.
    // If we map 1-365 to the 1-366 table, it's close enough.
    // Ideally we map loosely.

    const doy = getDayOfYear(date);
    const row = sunsetData.get(doy);

    if (!row) return null;

    // 2. Clamp match latitude (66 to -66)
    let safeLat = Math.round(lat);
    if (safeLat > 66) safeLat = 66;
    if (safeLat < -66) safeLat = -66;

    const key = `Lat_${safeLat}`;
    return row[key] || null;
};
