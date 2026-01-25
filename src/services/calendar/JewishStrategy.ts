import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday } from 'date-fns';
import type { CalendarStrategy, CalendarDateInfo, CalendarTitle } from './CalendarStrategy';
import { HDate } from '@hebcal/core';
import { getLocale } from '../../utils/dateLocales';

export class JewishStrategy implements CalendarStrategy {
    id = 'jewish';

    public static getLocalizedMonthName(monthName: string, localeCode: string): string {
        if (localeCode === 'ru') {
            const JEWISH_MONTHS_RU: Record<string, string> = {
                'Nisan': 'Нисан', 'Iyyar': 'Ияр', 'Sivan': 'Сиван', 'Tamuz': 'Таммуз',
                'Av': 'Ав', 'Elul': 'Элуль', 'Tishrei': 'Тишрей', 'Cheshvan': 'Хешван',
                'Kislev': 'Кислев', 'Tevet': 'Тевет', 'Sh\'vat': 'Шват', 'Adar': 'Адар',
                'Adar I': 'Адар I', 'Adar II': 'Адар II'
            };
            return JEWISH_MONTHS_RU[monthName] || monthName;
        }
        return monthName;
    }

    public static getLocalizedDay(hDate: HDate, localeCode: string): string {
        if (localeCode === 'he') {
            return hDate.renderGematriya().split(' ')[0].replace(/['"׳״]/g, '');
        }
        return hDate.getDate().toString();
    }

    private getHebrewMonthName(hDate: HDate): string {
        const parts = hDate.renderGematriya(true).split(' ');
        const monthPart = parts.slice(1, -1).join(' ');
        const yearPart = parts[parts.length - 1];
        return `${monthPart} ${yearPart}`;
    }

    private getLocalizedTitle(hDate: HDate, localeCode: string): string {
        if (localeCode === 'he') {
            return this.getHebrewMonthName(hDate);
        }
        const monthName = hDate.getMonthName();
        const year = hDate.getFullYear();
        return `${JewishStrategy.getLocalizedMonthName(monthName, localeCode)} ${year}`;
    }

    getTitle(date: Date, localeCode: string): CalendarTitle {
        const hDate = new HDate(date);
        const primary = this.getLocalizedTitle(hDate, localeCode);

        return { primary };
    }

    getGridDays(date: Date, weekStart: 0 | 1, locale: string): CalendarDateInfo[] {
        // 1. Identify the Jewish Month we are viewing
        const anchor = new HDate(date);
        const month = anchor.getMonth();
        const year = anchor.getFullYear();

        // 2. Find Gregorian boundaries of this Jewish Month
        const daysInMonth = HDate.daysInMonth(month, year);
        const startHDate = new HDate(1, month, year);
        const endHDate = new HDate(daysInMonth, month, year);

        const gStart = startHDate.greg(); // Gregorian Start of Jewish Month
        const gEnd = endHDate.greg();     // Gregorian End of Jewish Month

        // 3. Pad to fill the week grid (standard 7-col layout)
        const gridStart = startOfWeek(gStart, { weekStartsOn: weekStart });
        const gridEnd = endOfWeek(gEnd, { weekStartsOn: weekStart });

        // 4. Generate all days
        const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

        return days.map(d => {
            const hDate = new HDate(d);

            // If language is Hebrew, use Gematriya. Otherwise use Arabic numerals.
            const primaryLabel = JewishStrategy.getLocalizedDay(hDate, locale);

            const secondaryLabel = format(d, 'd'); // Gregorian date

            return {
                date: d,
                primaryLabel,
                secondaryLabel,
                isPrimaryMonth: hDate.getMonth() === month,
                isToday: isToday(d)
            };
        });
    }

    navigate(date: Date, direction: 'prev' | 'next'): Date {
        // date is likely the anchors (could be 1st of month, or random)
        const hDate = new HDate(date);
        const m = hDate.getMonth();
        const y = hDate.getFullYear();

        let targetHDate: HDate;

        if (direction === 'next') {
            const startOfCurrent = new HDate(1, m, y);
            const midNextMonth = startOfCurrent.add(35, 'd'); // 29+1 -> 30. +35 is safe.
            targetHDate = new HDate(1, midNextMonth.getMonth(), midNextMonth.getFullYear());

        } else {
            const startOfCurrent = new HDate(1, m, y);
            const midPrevMonth = startOfCurrent.subtract(15, 'd');
            targetHDate = new HDate(1, midPrevMonth.getMonth(), midPrevMonth.getFullYear());
        }

        return targetHDate.greg();
    }

    jumpToToday(): Date {
        return new Date();
    }

    formatDate(date: Date, localeCode: string): string {
        const hDate = new HDate(date);
        const locale = getLocale(localeCode);

        // 1. Get localized weekday (e.g. "Sunday", "Воскресенье", "ראשון")
        const weekday = format(date, 'EEEE', { locale });

        // 2. Get Jewish Date string (כג בשבט תשפ״ו)
        // If language is Hebrew, use Gematriya. Otherwise use Arabic numerals.
        let datePart = '';
        if (localeCode === 'he') {
            const fullGematriya = hDate.renderGematriya(true).split(' ');
            datePart = fullGematriya.slice(0, -1).join(' ');
        } else {
            const monthName = hDate.getMonthName();
            const localizedMonth = JewishStrategy.getLocalizedMonthName(monthName, localeCode);
            datePart = `${hDate.getDate()} ${localizedMonth}`;
        }

        return `${weekday}, ${datePart}`;
    }
}
