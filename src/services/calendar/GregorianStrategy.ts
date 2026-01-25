import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';
import type { CalendarStrategy, CalendarDateInfo, CalendarTitle } from './CalendarStrategy';
import { getLocale } from '../../utils/dateLocales';
import { HDate } from '@hebcal/core';
import { JewishStrategy } from './JewishStrategy';

export class GregorianStrategy implements CalendarStrategy {
    id = 'gregorian';

    getTitle(date: Date, localeCode: string): CalendarTitle {
        const locale = getLocale(localeCode);
        const primary = format(date, 'LLLL yyyy', { locale });

        return { primary };
    }

    getGridDays(date: Date, weekStart: 0 | 1, _locale: string): CalendarDateInfo[] {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const startDate = startOfWeek(monthStart, { weekStartsOn: weekStart });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: weekStart });

        const days = eachDayOfInterval({ start: startDate, end: endDate });

        return days.map(d => {
            const hDate = new HDate(d);
            return {
                date: d,
                primaryLabel: format(d, 'd'),
                secondaryLabel: JewishStrategy.getLocalizedDay(hDate, _locale),
                isPrimaryMonth: isSameMonth(d, monthStart),
                isToday: isToday(d)
            };
        });
    }

    navigate(date: Date, direction: 'prev' | 'next'): Date {
        return direction === 'next' ? addMonths(date, 1) : subMonths(date, 1);
    }

    jumpToToday(): Date {
        return new Date();
    }

    formatDate(date: Date, localeCode: string): string {
        const locale = getLocale(localeCode);
        return format(date, 'EEEE, d', { locale });
    }
}
