import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, isWeekend } from 'date-fns';
import { enUS, ru, he } from 'date-fns/locale';
import { HDate, HebrewCalendar, flags } from '@hebcal/core';

const LOCALE_MAP: Record<string, any> = {
    en: enUS,
    ru: ru,
    he: he
};

const SIZE_MAP: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
};

const NAME_SIZE_MAP: Record<string, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
};

const ALIGN_MAP: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right'
};

// Helper for 'text-align' on grid cells specifically
const TEXT_ALIGN_MAP: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
};

export const CalendarWidget: React.FC = () => {
    const { viewMode, settings, currentDate } = useAppStore();
    const currentLocale = LOCALE_MAP[settings.language];

    // Dynamic Start of Week
    const weekStartParams = { weekStartsOn: settings.weekStart as 0 | 1, locale: currentLocale };

    const renderMonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const startDate = startOfWeek(monthStart, weekStartParams);
        const endDate = endOfWeek(monthEnd, weekStartParams);

        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

        // Generate Week Headers dynamically
        const weekDays = eachDayOfInterval({
            start: startDate,
            end: endOfWeek(startDate, weekStartParams)
        });

        return (
            <div className="flex flex-col h-full animate-in fade-in duration-500 border-t border-border pt-4">
                {/* Header Row */}
                <div className="grid grid-cols-7 mb-4 pb-2">
                    {weekDays.map(day => (
                        <div
                            key={day.toString()}
                            className={`
                                text-text-muted font-semibold uppercase tracking-wider pr-4
                                ${NAME_SIZE_MAP[settings.dayNameSize] || 'text-xs'}
                                ${TEXT_ALIGN_MAP[settings.dayNameAlign]}
                            `}
                        >
                            {format(day, 'EEE', { locale: currentLocale })}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 grid-rows-5 gap-4 flex-grow">
                    {calendarDays.map((day) => {
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isDayToday = isToday(day);
                        const isDayWeekend = isWeekend(day);

                        // Check Weekend Highlight Setting
                        const shouldHighlightWeekend =
                            (settings.highlightWeekend === 'both' && isDayWeekend) ||
                            (settings.highlightWeekend === 'sat' && day.getDay() === 6) ||
                            (settings.highlightWeekend === 'sun' && day.getDay() === 0);

                        // Jewish Date Calculation
                        let jewishDayStr = '';
                        let isRoshChodesh = false;
                        let isHoliday = false;
                        let isErev = false;
                        let isCholHaMoed = false;
                        let holidayName = '';

                        if (settings.showJewishCalendar) {
                            const hdate = new HDate(day);
                            jewishDayStr = hdate.renderGematriya().split(' ')[0].replace(/'/g, ''); // Just the day letter(s)
                            isRoshChodesh = hdate.getDate() === 1;

                            // Holiday Logic
                            const events = HebrewCalendar.getHolidaysOnDate(hdate) || [];
                            if (events.length > 0) {
                                isHoliday = events.some(e => (e.getFlags() & flags.CHAG) !== 0 || e.basename() === "Yom HaAtzma'ut");
                                isErev = events.some(e => (e.getFlags() & flags.EREV) !== 0);
                                isCholHaMoed = events.some(e => (e.getFlags() & flags.CHOL_HAMOED) !== 0);

                                // Get first holiday name (prioritize by importance?)
                                // Simply mapping all might be too long. Let's take the first significant one.
                                // Filter out candle lighting times and parsha? Hebcal returns mainly holidays here.
                                const primaryEvent = events.find(e => (e.getFlags() & flags.CHAG) || (e.getFlags() & flags.CHOL_HAMOED) || (e.getFlags() & flags.EREV)) || events[0];
                                if (primaryEvent) {
                                    holidayName = primaryEvent.render(settings.language === 'he' ? 'he' : 'en');
                                }
                            }
                        }

                        // Badge Style Determination
                        let badgeStyle = 'text-3xl font-bold text-text-muted opacity-60 font-serif'; // Default
                        if (isHoliday) {
                            badgeStyle = 'w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full shadow-md text-xl font-bold z-10';
                        } else if (isCholHaMoed) {
                            badgeStyle = 'w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-md text-xl font-bold z-10';
                        } else if (isErev) {
                            badgeStyle = 'w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full shadow-md text-xl font-bold z-10';
                        } else if (isRoshChodesh) {
                            badgeStyle = 'w-10 h-10 flex items-center justify-center bg-cyan-600 text-white rounded-full shadow-md text-xl font-bold z-10';
                        }

                        return (
                            <div
                                key={day.toString()}
                                className={`
                                  p-4 rounded-2xl relative flex flex-col transition-all hover:-translate-y-1 hover:bg-surface-hover
                                  ${ALIGN_MAP[settings.dayNumberAlign]}
                                  ${isDayToday
                                        ? 'bg-gradient-to-br from-surface to-primary/20 border border-primary shadow-[0_0_15px_var(--color-primary-glow)]'
                                        : shouldHighlightWeekend
                                            ? 'bg-surface-hover border border-border' // Distinct Weekend Style
                                            : 'bg-surface border border-transparent'}
                                  ${!isCurrentMonth ? 'opacity-30' : ''}
                                `}
                            >
                                <span className={`font-bold mb-auto ${SIZE_MAP[settings.dayNumberSize]} ${isDayToday ? 'text-primary' : shouldHighlightWeekend ? 'text-red-600 dark:text-red-400' : 'text-text-main'}`}>
                                    {format(day, 'd')}
                                </span>

                                {/* Jewish Day Number (opposite corner) */}
                                {settings.showJewishCalendar && (
                                    <>
                                        <span className={`absolute ${settings.language === 'he'
                                            ? (settings.dayNumberAlign === 'left' ? 'top-4 left-4' : 'top-4 right-4') // RTL: Start is Right, so put Jewish on Left
                                            : (settings.dayNumberAlign === 'left' ? 'top-4 right-4' : 'top-4 left-4') // LTR: Start is Left, so put Jewish on Right
                                            } ${badgeStyle}`}>
                                            {jewishDayStr}
                                        </span>
                                        {holidayName && (
                                            <div className="mt-auto text-xs font-semibold text-center text-primary/80 leading-tight w-full truncate">
                                                {holidayName}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Optional event dot placeholder */}
                                {isDayToday && <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const start = startOfWeek(currentDate, weekStartParams);
        const end = endOfWeek(currentDate, weekStartParams);
        const days = eachDayOfInterval({ start, end });

        return (
            <div className="grid grid-cols-7 gap-4 h-full animate-in fade-in slide-in-from-right-4 duration-500 border-t border-border pt-4">
                {days.map(day => {
                    const isDayToday = isToday(day);
                    const isDayWeekend = isWeekend(day);

                    const shouldHighlightWeekend =
                        (settings.highlightWeekend === 'both' && isDayWeekend) ||
                        (settings.highlightWeekend === 'sat' && day.getDay() === 6) ||
                        (settings.highlightWeekend === 'sun' && day.getDay() === 0);

                    // Jewish Date Calculation
                    let jewishDayStr = '';
                    let isRoshChodesh = false;
                    if (settings.showJewishCalendar) {
                        const hdate = new HDate(day);
                        jewishDayStr = settings.language === 'he'
                            ? hdate.renderGematriya().split(' ')[0].replace(/'/g, '')
                            : hdate.getDate().toString();
                        isRoshChodesh = hdate.getDate() === 1;
                    }

                    return (
                        <div
                            key={day.toString()}
                            className={`
                                rounded-2xl flex flex-col items-center justify-center p-6 border transition-all relative
                                ${isDayToday
                                    ? 'bg-surface border-primary scale-105 shadow-xl z-10'
                                    : shouldHighlightWeekend
                                        ? 'bg-surface-hover border-border'
                                        : 'bg-surface/50 border-transparent'}
                              `}
                        >
                            <span className={`text-text-muted font-bold uppercase tracking-widest mb-2 ${NAME_SIZE_MAP[settings.dayNameSize] || 'text-xs'} `}>
                                {format(day, 'EEEE', { locale: currentLocale })}
                            </span>
                            <span className={`font-light ${SIZE_MAP[settings.dayNumberSize] === 'text-4xl' ? 'text-6xl' : 'text-4xl'} ${isDayToday ? 'text-primary' : shouldHighlightWeekend ? 'text-red-600 dark:text-red-400' : 'text-text-main'}`}>
                                {format(day, 'd')}
                            </span>

                            {/* Jewish Day Number (opposite corner) */}
                            {settings.showJewishCalendar && (
                                <span className={`absolute ${settings.language === 'he'
                                    ? 'top-4 left-4' // In Week View, items are centered typically, so put Jewish on Left (RTL Start = Right)
                                    : 'top-4 right-4'
                                    }  ${isRoshChodesh
                                        ? 'w-10 h-10 flex items-center justify-center bg-cyan-600 text-white rounded-full shadow-md text-xl font-bold z-10'
                                        : 'text-3xl font-bold text-text-muted opacity-60 font-serif'
                                    }`}>
                                    {jewishDayStr}
                                </span>
                            )}

                            <div className="mt-8 text-xs text-text-muted italic">No events</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden mt-2">
            {viewMode === 'month' ? renderMonthView() : renderWeekView()}
        </div>
    );
};
