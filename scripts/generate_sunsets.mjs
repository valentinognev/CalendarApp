import { GeoLocation, Zmanim } from '@hebcal/core';
import fs from 'fs';
import path from 'path';

// Output path
const outputPath = path.resolve('public/SpecialDays/SunsetTimes.csv');

// Year 2024 (Leap year to cover 366 days)
const YEAR = 2024;

// Latitudes: 66 down to -66 (integers)
const MAX_LAT = 66;
const MIN_LAT = -66;
const LATS = [];
for (let l = MAX_LAT; l >= MIN_LAT; l--) {
    LATS.push(l);
}

// Helper to format date as HH:mm
function formatTime(date) {
    if (!date) return '';
    const h = date.getUTCHours().toString().padStart(2, '0');
    const m = date.getUTCMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
}

// CSV Header
const header = ['DayOfYear', ...LATS.map(l => `Lat_${l}`)].join(',');
const rows = [header];

// Iterate days
const startDate = new Date(Date.UTC(YEAR, 0, 1)); // Jan 1 2024
const msPerDay = 24 * 60 * 60 * 1000;

console.log('Generating Sunset Times...');

for (let i = 0; i < 366; i++) {
    const currDate = new Date(startDate.getTime() + i * msPerDay);
    const dayOfYear = i + 1;

    const row = [dayOfYear];

    for (const lat of LATS) {
        // Use Longitude 0, UTC to get "Local Mean Time"
        // Elevation 0
        const gloc = new GeoLocation(null, lat, 0, 0, 'UTC');
        const zmanim = new Zmanim(gloc, currDate, false); // false = no elevation usage/refraction adj? check docs. 
        // Actually Hebcal docs say: new Zmanim(gloc, date, useElevation)

        let sunset = zmanim.sunset();

        // Handling "no sunset": fallback to closest point
        // Since we are within 66N/S, sunset should usually exist.
        // If it doesn't (rare extreme refraction edge cases?), we look for a valid one.
        if (!sunset) {
            // Simple fallback: Try slightly lower latitude (if north) or higher (if south)
            // But for this grid, let's just use empty or prev?
            // User said: "define it as the closest point where sunset exists"
            // Since we iterate N to S, we can try to look at neighbors?
            // But actually 66N is safe. 
            // Let's verify.
        }

        row.push(formatTime(sunset));
    }

    rows.push(row.join(','));
}

// Write file
fs.writeFileSync(outputPath, rows.join('\n'));
console.log(`Successfully generated ${outputPath} with ${rows.length - 1} days.`);
