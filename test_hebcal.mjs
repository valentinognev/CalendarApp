import { HDate } from '@hebcal/core';

const d1 = new Date(2026, 3, 14); // April 14, 2026
const h1 = new HDate(d1);
console.log(`April 14 2026: ${h1.getDate()} ${h1.getMonthName()}`);

const d2 = new Date(2026, 3, 22); // April 22, 2026
const h2 = new HDate(d2);
console.log(`April 22 2026: ${h2.getDate()} ${h2.getMonthName()}`);
