import { HDate } from '@hebcal/core';

const d1 = new HDate(new Date('2026-01-25'));
console.log('Day 25:', d1.renderGematriya());

const d2 = new HDate(new Date('2026-02-18')); // 1st of Adar
console.log('Day 1 (Rosh Chodesh):', d2.renderGematriya());
