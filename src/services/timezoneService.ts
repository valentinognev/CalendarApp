/**
 * Timezone to Coordinate Mapping Service
 * Provides approximate coordinates based on the user's system timezone.
 * Useful for calculating Shabbat times when geolocation is blocked.
 */

export interface Coords {
    lat: number;
    long: number;
}

const TIMEZONE_MAP: Record<string, Coords> = {
    'Asia/Jerusalem': { lat: 31.7683, long: 35.2137 },
    'Europe/Moscow': { lat: 55.7558, long: 37.6173 },
    'America/New_York': { lat: 40.7128, long: -74.0060 },
    'America/Los_Angeles': { lat: 34.0522, long: -118.2437 },
    'Europe/London': { lat: 51.5074, long: -0.1278 },
    'Europe/Paris': { lat: 48.8566, long: 2.3522 },
    'Europe/Berlin': { lat: 52.5200, long: 13.4050 },
    'Asia/Hong_Kong': { lat: 22.3193, long: 114.1694 },
    'Asia/Tokyo': { lat: 35.6762, long: 139.6503 },
    'Australia/Sydney': { lat: -33.8688, long: 151.2093 },
    'America/Sao_Paulo': { lat: -23.5505, long: -46.6333 },
    'Africa/Johannesburg': { lat: -26.2041, long: 28.0473 },
    'Asia/Dubai': { lat: 25.2048, long: 55.2708 },
    'Asia/Singapore': { lat: 1.3521, long: 103.8198 },
    'Europe/Istanbul': { lat: 41.0082, long: 28.9784 },
    'Europe/Rome': { lat: 41.9028, long: 12.4964 },
    'Asia/Seoul': { lat: 37.5665, long: 126.9780 },
    'America/Mexico_City': { lat: 19.4326, long: -99.1332 },
    'America/Toronto': { lat: 43.6532, long: -79.3832 },
    'Europe/Madrid': { lat: 40.4168, long: -3.7038 },
    'Europe/Stockholm': { lat: 59.3293, long: 18.0686 },
    'Asia/Bangkok': { lat: 13.7563, long: 100.5018 },
    'Asia/Kolkata': { lat: 22.5726, long: 88.3639 },
    'America/Chicago': { lat: 41.8781, long: -87.6298 },
};

export const getCoordinatesFromTimezone = (): Coords | null => {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!tz) return null;

        // Direct match
        if (TIMEZONE_MAP[tz]) return TIMEZONE_MAP[tz];

        // Partial match (e.g., if you have 'America/Chicago' but user is 'America/Detroit')
        // We can match the prefix 'America/' or just use a default for the region.
        const region = tz.split('/')[0];
        const regionDefaults: Record<string, Coords> = {
            'Europe': { lat: 50.0, long: 10.0 },
            'America': { lat: 40.0, long: -100.0 },
            'Asia': { lat: 30.0, long: 100.0 },
            'Africa': { lat: 0.0, long: 20.0 },
            'Australia': { lat: -25.0, long: 135.0 }
        };

        return regionDefaults[region] || null;
    } catch (e) {
        return null;
    }
};
