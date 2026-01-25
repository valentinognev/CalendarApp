
import { format, startOfDay, getDayOfYear } from 'date-fns';

const sunsetData = new Map();
// Simulating CSV row for Day 25 at Lat 31 (Israel)
// Based on earlier grep: 25,17:26,17:28
sunsetData.set(25, {
    Lat_31: "17:26",
    Lat_30: "17:28"
});

const now = new Date("2026-01-25T22:55:00");
const currentTime = format(now, 'HH:mm');
const effectiveLat = 31;
const doy = getDayOfYear(now);
const row = sunsetData.get(doy);
const sunsetStr = row ? row[`Lat_${effectiveLat}`] : null;

console.log("Current Time:", currentTime);
console.log("Sunset Time:", sunsetStr);

if (sunsetStr) {
    const isAfter7AM = currentTime >= '07:00';
    const isBeforeSunset = currentTime < sunsetStr;
    const targetTheme = (isAfter7AM && isBeforeSunset) ? 'light' : 'dark';
    console.log("Is After 7 AM:", isAfter7AM);
    console.log("Is Before Sunset:", isBeforeSunset);
    console.log("Target Theme:", targetTheme);
}
