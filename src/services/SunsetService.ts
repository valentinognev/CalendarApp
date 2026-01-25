
import { getDayOfYear } from 'date-fns';

type SunsetMap = Map<number, Record<string, string>>;

let sunsetCache: SunsetMap | null = null;
let sunsetFetchPromise: Promise<SunsetMap> | null = null;

export const fetchSunsetTimes = async (): Promise<SunsetMap> => {
    if (sunsetCache) return sunsetCache;
    if (sunsetFetchPromise) return sunsetFetchPromise;

    sunsetFetchPromise = (async () => {
        try {
            // Using relative path as requested by user
            const response = await fetch('UtilityFiles/SunsetTimes.csv?t=' + Date.now());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const text = await response.text();
            sunsetCache = parseSunsetCSV(text);
            return sunsetCache;
        } catch (error) {
            console.error('Failed to load Sunset times:', error);
            return new Map();
        } finally {
            sunsetFetchPromise = null;
        }
    })();

    return sunsetFetchPromise;
};

const parseSunsetCSV = (csvText: string): SunsetMap => {
    const lines = csvText.split('\n');
    const map = new Map<number, Record<string, string>>();

    if (lines.length < 2) return map;

    // Header: DayOfYear,Lat_66,Lat_65...
    // Trim each header to be safe
    const headers = lines[0].trim().split(',').map(h => h.trim());

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',');
        const dayOfYear = parseInt(parts[0], 10);

        if (isNaN(dayOfYear)) continue;

        const rowData: Record<string, string> = {};
        for (let j = 1; j < headers.length; j++) {
            rowData[headers[j]] = parts[j] ? parts[j].trim() : '';
        }

        map.set(dayOfYear, rowData);
    }

    return map;
};

export const getSunsetTime = (date: Date, lat: number, sunsetData: SunsetMap): string | null => {
    if (!sunsetData || sunsetData.size === 0) return null;

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
