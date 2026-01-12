import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/AppContext';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, isWeekend, addMinutes, subMinutes, parse } from 'date-fns';
import {
    enUS, ru, he, zhCN, hi, es, fr, ar, bn, pt, id, de, ja, te, tr, ta, ko, vi, it, th, faIR, pl, uk, ro, nl, el, hu, sv, cs, da, fi, nb, sk, hr, bg, sl, lt, lv, et, sr, ca, ms, gu, kn
} from 'date-fns/locale';
import { HDate } from '@hebcal/core';
import { EventModal } from '../events/EventModal';
import { fetchJewishHolidays, type JewishHoliday } from '../../services/JewishHolidayService';
import { fetchSunsetTimes, getSunsetTime } from '../../services/SunsetService';

const LOCALE_MAP: Record<string, any> = {
    en: enUS, zh: zhCN, hi: hi, es: es, fr: fr, ar: ar, bn: bn, pt: pt, ru: ru,
    id: id, de: de, ja: ja, te: te, tr: tr, ta: ta, ko: ko,
    vi: vi, it: it, th: th, fa: faIR, pl: pl, uk: uk, ro: ro, nl: nl, el: el, hu: hu,
    sv: sv, cs: cs, da: da, fi: fi, he: he, no: nb, sk: sk, hr: hr, bg: bg, sl: sl,
    lt: lt, lv: lv, et: et, sr: sr, ca: ca, ms: ms, gu: gu, kn: kn,
    // Fallbacks because date-fns might differ slightly in naming or I'm lazy to find all 50 in import list
    ur: enUS, sw: enUS, mr: enUS, pa: enUS, fil: enUS, am: enUS
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

const TEXT_ALIGN_MAP: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
};

export const CalendarWidget: React.FC = () => {
    const { viewMode, settings, currentDate, getEventsForDate, location } = useAppStore();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [csvHolidays, setCsvHolidays] = useState<JewishHoliday[]>([]);
    const [sunsetMap, setSunsetMap] = useState<Map<number, Record<string, string>>>(new Map());

    useEffect(() => {
        const loadData = async () => {
            const [holidays, sunsets] = await Promise.all([
                fetchJewishHolidays(),
                fetchSunsetTimes()
            ]);
            setCsvHolidays(holidays);
            setSunsetMap(sunsets);
        };
        loadData();
    }, []);

    const currentLocale = LOCALE_MAP[settings.language] || enUS;
    const weekStartParams = { weekStartsOn: settings.weekStart as 0 | 1, locale: currentLocale };

    const renderMonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const startDate = startOfWeek(monthStart, weekStartParams);
        const endDate = endOfWeek(monthEnd, weekStartParams);

        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
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
                        const dayEvents = getEventsForDate(day);

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
                        let isFast = false;
                        let isOfficial = false;
                        let holidayName = '';
                        let shabbatTime = '';

                        if (settings.showJewishCalendar) {
                            const hdate = new HDate(day);
                            jewishDayStr = hdate.renderGematriya().split(' ')[0].replace(/'/g, '');
                            isRoshChodesh = hdate.getDate() === 1;

                            // Lookup in CSV
                            const monthName = hdate.getMonthName();
                            const dayNum = hdate.getDate();

                            const csvMatch = csvHolidays.find(h => h.month === monthName && h.day === dayNum);

                            if (csvMatch) {
                                isHoliday = csvMatch.type === 'holiday';
                                isFast = csvMatch.type === 'fast';
                                isCholHaMoed = csvMatch.type === 'chol_hamoed';
                                isOfficial = csvMatch.official;

                                // Name based on language (Dynamic Lookup)
                                // Only try to access names if it exists (safety check if service bad)
                                if (csvMatch.names) {
                                    holidayName = csvMatch.names[settings.language] || csvMatch.names['en'] || '';
                                } else {
                                    // Fallback if names map missing
                                    holidayName = (csvMatch as any).nameEn || '';
                                }
                            } else {
                                if (isRoshChodesh) {
                                    if (settings.language === 'ru') holidayName = 'Рош Ходеш';
                                    else if (settings.language === 'he') holidayName = 'ראש חודש';
                                    else holidayName = 'Rosh Chodesh';
                                }
                            }

                            // Shabbat Times via Sunset Table
                            if (location) {
                                const dayOfWeek = day.getDay();
                                const sunsetStr = getSunsetTime(day, location.lat, sunsetMap);

                                if (sunsetStr) {
                                    // Parse sunset time to a Date object on the current day
                                    const sunsetDate = parse(sunsetStr, 'HH:mm', day);

                                    if (dayOfWeek === 5) { // Friday -> Candles (-18m)
                                        const candles = subMinutes(sunsetDate, 18);
                                        shabbatTime = `🕯️ ${format(candles, 'HH:mm')}`;
                                    } else if (dayOfWeek === 6) { // Saturday -> Havdalah (+42m)
                                        const havdalah = addMinutes(sunsetDate, 42);
                                        shabbatTime = `✨ ${format(havdalah, 'HH:mm')}`;
                                    }
                                }
                            }
                        }

                        // Badge Style Determination
                        let badgeStyle = 'text-3xl font-bold text-text-muted opacity-60 font-serif';

                        if (isHoliday) {
                            badgeStyle = 'w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full shadow-md text-xl font-bold z-10';
                        } else if (isCholHaMoed) {
                            badgeStyle = 'w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-md text-xl font-bold z-10';
                        } else if (isFast) {
                            badgeStyle = 'w-10 h-10 flex items-center justify-center bg-amber-700 text-white rounded-full shadow-md text-xl font-bold z-10';
                        } else if (isErev) {
                            badgeStyle = 'w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full shadow-md text-xl font-bold z-10';
                        } else if (isRoshChodesh) {
                            badgeStyle = 'w-10 h-10 flex items-center justify-center bg-cyan-600 text-white rounded-full shadow-md text-xl font-bold z-10';
                        }

                        // Determine space needs
                        // Removed unused variable: const hasJewishContent = ...

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={`
                                  p-4 rounded-2xl relative flex flex-col transition-all hover:-translate-y-1 hover:bg-surface-hover cursor-pointer group
                                  ${ALIGN_MAP[settings.dayNumberAlign]}
                                  ${isDayToday
                                        ? 'bg-gradient-to-br from-surface to-primary/20 border border-primary shadow-[0_0_15px_var(--color-primary-glow)]'
                                        : shouldHighlightWeekend
                                            ? 'bg-surface-hover border border-border'
                                            : 'bg-surface border border-transparent'}
                                  ${!isCurrentMonth ? 'opacity-30' : ''}
                                  ${isOfficial ? 'ring-1 ring-yellow-500/50' : ''} 
                                `}
                            >
                                <span className={`font-bold mb-auto ${SIZE_MAP[settings.dayNumberSize]} ${isDayToday ? 'text-primary' : shouldHighlightWeekend ? 'text-red-600 dark:text-red-400' : 'text-text-main'}`}>
                                    {format(day, 'd')}
                                </span>

                                {/* Jewish Day Number + Holiday Name + Shabbat Time */}
                                {settings.showJewishCalendar && (
                                    <>
                                        <span className={`absolute ${settings.language === 'he'
                                            ? (settings.dayNumberAlign === 'left' ? 'top-4 left-4' : 'top-4 right-4')
                                            : (settings.dayNumberAlign === 'left' ? 'top-4 right-4' : 'top-4 left-4')
                                            } ${badgeStyle}`}>
                                            {jewishDayStr}
                                        </span>
                                        <div className="absolute bottom-1 left-0 right-0 flex flex-col items-center justify-end pointer-events-none gap-0.5">
                                            {holidayName && (
                                                <div className="text-[10px] font-semibold text-center text-primary/80 leading-tight w-full truncate px-1">
                                                    {holidayName}
                                                </div>
                                            )}
                                            {shabbatTime && (
                                                <div className="text-[10px] font-mono font-medium text-text-muted bg-surface/80 px-1 rounded-sm shadow-sm">
                                                    {shabbatTime}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Events List */}
                                <div className={`w-full mt-1 flex flex-col gap-1 ${settings.dayNumberAlign === 'center' ? 'items-center' : settings.dayNumberAlign === 'right' ? 'items-end' : 'items-start'} ${(holidayName || shabbatTime) && settings.showJewishCalendar ? 'mb-6' : ''}`}>
                                    {dayEvents.slice(0, 3).map(e => (
                                        <div key={e.id} className="text-[10px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded-md truncate max-w-full border border-sky-500/20">
                                            {e.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <span className="text-[9px] text-text-muted">+{dayEvents.length - 3} more</span>
                                    )}
                                </div>
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
                    const dayEvents = getEventsForDate(day);

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
                    let isFast = false;
                    let isOfficial = false;
                    let holidayName = '';
                    let shabbatTime = '';

                    if (settings.showJewishCalendar) {
                        const hdate = new HDate(day);
                        jewishDayStr = hdate.renderGematriya().split(' ')[0].replace(/'/g, '');
                        isRoshChodesh = hdate.getDate() === 1;

                        // Lookup in CSV
                        const monthName = hdate.getMonthName();
                        const dayNum = hdate.getDate();

                        const csvMatch = csvHolidays.find(h => h.month === monthName && h.day === dayNum);

                        if (csvMatch) {
                            isHoliday = csvMatch.type === 'holiday';
                            isFast = csvMatch.type === 'fast';
                            isCholHaMoed = csvMatch.type === 'chol_hamoed';
                            isOfficial = csvMatch.official;

                            // Name based on language
                            if (csvMatch.names) {
                                holidayName = csvMatch.names[settings.language] || csvMatch.names['en'] || '';
                            } else {
                                holidayName = (csvMatch as any).nameEn || '';
                            }
                        } else {
                            if (isRoshChodesh) {
                                if (settings.language === 'ru') holidayName = 'Рош Ходеш';
                                else if (settings.language === 'he') holidayName = 'ראש חודש';
                                else holidayName = 'Rosh Chodesh';
                            }
                        }

                        // Shabbat Times via Sunset Table
                        if (location) {
                            const dayOfWeek = day.getDay();
                            const sunsetStr = getSunsetTime(day, location.lat, sunsetMap);

                            if (sunsetStr) {
                                // Parse sunset time to a Date object on the current day
                                const sunsetDate = parse(sunsetStr, 'HH:mm', day);

                                if (dayOfWeek === 5) { // Friday -> Candles (-18m)
                                    const candles = subMinutes(sunsetDate, 18);
                                    shabbatTime = `🕯️ ${format(candles, 'HH:mm')}`;
                                } else if (dayOfWeek === 6) { // Saturday -> Havdalah (+42m)
                                    const havdalah = addMinutes(sunsetDate, 42);
                                    shabbatTime = `✨ ${format(havdalah, 'HH:mm')}`;
                                }
                            }
                        }
                    }

                    // Badge Style Determination
                    let badgeStyle = 'text-3xl font-bold text-text-muted opacity-60 font-serif';
                    if (isHoliday) {
                        badgeStyle = 'w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full shadow-md text-xl font-bold z-10';
                    } else if (isCholHaMoed) {
                        badgeStyle = 'w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-md text-xl font-bold z-10';
                    } else if (isFast) {
                        badgeStyle = 'w-10 h-10 flex items-center justify-center bg-amber-700 text-white rounded-full shadow-md text-xl font-bold z-10';
                    } else if (isErev) {
                        badgeStyle = 'w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full shadow-md text-xl font-bold z-10';
                    } else if (isRoshChodesh) {
                        badgeStyle = 'w-10 h-10 flex items-center justify-center bg-cyan-600 text-white rounded-full shadow-md text-xl font-bold z-10';
                    }

                    // Space check


                    return (
                        <div
                            key={day.toString()}
                            onClick={() => setSelectedDate(day)}
                            className={`
                                rounded-2xl flex flex-col items-center justify-center p-6 border transition-all relative cursor-pointer
                                ${isDayToday
                                    ? 'bg-surface border-primary scale-105 shadow-xl z-10'
                                    : shouldHighlightWeekend
                                        ? 'bg-surface-hover border-border'
                                        : 'bg-surface/50 border-transparent'}
                                ${isOfficial ? 'ring-1 ring-yellow-500/50' : ''}
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
                                <>
                                    <span className={`absolute ${settings.language === 'he'
                                        ? 'top-4 left-4'
                                        : 'top-4 right-4'
                                        } ${badgeStyle}`}>
                                        {jewishDayStr}
                                    </span>
                                    <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center justify-end pointer-events-none gap-1">
                                        {holidayName && (
                                            <div className="text-xs font-semibold text-center text-primary/80 leading-tight w-full truncate px-2">
                                                {holidayName}
                                            </div>
                                        )}
                                        {shabbatTime && (
                                            <div className="text-xs font-mono font-medium text-text-muted bg-surface/80 px-1 rounded-sm shadow-sm">
                                                {shabbatTime}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Custom Events - Week View */}
                            <div className="w-full mt-auto flex flex-col gap-1 items-center max-h-[100px] overflow-y-hidden">
                                {dayEvents.map(e => (
                                    <div key={e.id} className="text-xs bg-sky-500/10 text-sky-400 px-2 py-1 rounded-md w-full text-center truncate border border-sky-500/20">
                                        {e.title}
                                    </div>
                                ))}
                            </div>
                            {dayEvents.length === 0 && <div className="mt-8 text-xs text-text-muted italic">No events</div>}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden mt-2">
            {viewMode === 'month' ? renderMonthView() : renderWeekView()}

            {selectedDate && (
                <EventModal
                    isOpen={!!selectedDate}
                    selectedDate={selectedDate}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>
    );
};
