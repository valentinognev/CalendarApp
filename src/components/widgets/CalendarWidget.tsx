import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/AppContext';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, isWeekend, addMinutes, subMinutes, parse } from 'date-fns';
import { getLocale } from '../../utils/dateLocales';
import { HDate } from '@hebcal/core';
import { EventModal } from '../events/EventModal';
import { fetchJewishHolidays, type JewishHoliday } from '../../services/JewishHolidayService';
import { fetchMuslimHolidays, getHijriDate, type MuslimHoliday } from '../../services/MuslimHolidayService';
import { fetchCountryList, fetchNationalHolidays, type NationalHoliday } from '../../services/NationalHolidayService';
import { fetchSunsetTimes, getSunsetTime } from '../../services/SunsetService';

const SIZE_MAP: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
};

const NAME_SIZE_MAP: Record<string, string> = {
    sm: 'text-[0.7rem]',
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
    const { settings, currentDate, getEventsForDate, location, direction, viewMode } = useAppStore();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [jewishHolidays, setJewishHolidays] = useState<JewishHoliday[]>([]);
    const [muslimHolidays, setMuslimHolidays] = useState<MuslimHoliday[]>([]);
    const [nationalHolidays, setNationalHolidays] = useState<NationalHoliday[]>([]);
    const [countryCalendarType, setCountryCalendarType] = useState<'gregorian' | 'jewish' | 'muslim'>('gregorian');
    const [sunsetMap, setSunsetMap] = useState<Map<number, Record<string, string>>>(new Map());

    useEffect(() => {
        const loadData = async () => {
            const [jHolidays, mHolidays, sunsets] = await Promise.all([
                fetchJewishHolidays(),
                fetchMuslimHolidays(),
                fetchSunsetTimes()
            ]);
            setJewishHolidays(jHolidays);
            setMuslimHolidays(mHolidays);
            if (sunsets.size > 0) setSunsetMap(sunsets);
        };
        loadData();
    }, [location, settings.activeCalendars]);

    // Load National Holidays when country changes
    useEffect(() => {
        const loadNationalHolidays = async () => {
            if (!settings.country) return;
            const countries = await fetchCountryList();
            const countryInfo = countries.find(c => c.country === settings.country);
            if (countryInfo) {
                const holidays = await fetchNationalHolidays(countryInfo.filename);
                setNationalHolidays(holidays);
                setCountryCalendarType(countryInfo.calendarType);
            }
        };
        loadNationalHolidays();
    }, [settings.country]);

    const currentLocale = getLocale(settings.language);
    const weekStartParams = { weekStartsOn: settings.weekStart as 0 | 1, locale: currentLocale };

    const renderCalendarGrid = () => {
        let startDate: Date;
        let endDate: Date;
        const monthStart = startOfMonth(currentDate);

        if (viewMode === 'week') {
            startDate = startOfWeek(currentDate, weekStartParams);
            endDate = endOfWeek(currentDate, weekStartParams);
        } else {
            const monthEnd = endOfMonth(currentDate);
            startDate = startOfWeek(monthStart, weekStartParams);
            endDate = endOfWeek(monthEnd, weekStartParams);
        }

        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
        const weekDays = eachDayOfInterval({
            start: startOfWeek(currentDate, weekStartParams),
            end: endOfWeek(currentDate, weekStartParams)
        });

        // Corner Styles
        const topLeft = 'top-2 left-2';
        const topRight = 'top-2 right-2';

        return (
            <div className="flex flex-col h-full animate-in fade-in duration-500 border-t border-border pt-4">
                {/* Header Row */}
                <div className="grid grid-cols-7 mb-2 pb-1">
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
                <div className={`grid grid-cols-7 gap-2 flex-grow ${viewMode === 'week' ? 'grid-rows-1' : `grid-rows-${calendarDays.length / 7}`}`}>
                    {calendarDays.map((day) => {
                        const isCurrentMonth = viewMode === 'week' ? true : isSameMonth(day, monthStart);
                        const isDayToday = isToday(day);
                        const isDayWeekend = isWeekend(day);
                        const dayEvents = getEventsForDate(day);

                        const shouldHighlightWeekend =
                            (settings.highlightWeekend === 'both' && isDayWeekend) ||
                            (settings.highlightWeekend === 'sat' && day.getDay() === 6) ||
                            (settings.highlightWeekend === 'sun' && day.getDay() === 0) ||
                            (settings.highlightWeekend === 'fri' && day.getDay() === 5) ||
                            (settings.highlightWeekend === 'fri-sat' && (day.getDay() === 5 || day.getDay() === 6));

                        // --- Calendar Data Processing ---
                        const activeCals = settings.activeCalendars;
                        const calendarData: { type: 'jewish' | 'muslim' | 'national', dayStr: string, holiday?: string, style: string, corner: string }[] = [];

                        // 1. Jewish Calendar
                        const isIsrael = settings.country === 'Israel';
                        let shabbatTime = '';
                        let isOfficial = false;

                        if (activeCals.includes('jewish')) {
                            const hdate = new HDate(day);
                            const jDayStr = hdate.renderGematriya().split(' ')[0].replace(/'/g, '');
                            const isRoshChodesh = hdate.getDate() === 1;

                            let jMatch = jewishHolidays.find(h => h.month === hdate.getMonthName() && h.day === hdate.getDate());
                            let jName = '';

                            if (jMatch) {
                                // Regional Handling: Skip Diaspora-only second days if in Israel
                                const isDiasporaOnly = ['Passover 2', 'Passover 8', 'Shavuot 2', 'Sukkot 2', 'Simchat Torah'].includes(jMatch.names['en']) &&
                                    !(isIsrael && jMatch.names['en'] === 'Sukkot 2');

                                // Special case: Simchat Torah in Diaspora is Tishrei 23, but in Israel it's Tishrei 22 (merged with Shemini Atzeret)
                                if (isIsrael && jMatch.names['en'] === 'Simchat Torah' && hdate.getMonthName() === 'Tishrei' && hdate.getDate() === 23) {
                                    jMatch = undefined; // Don't show Diaspora Simchat Torah in Israel
                                } else if (isIsrael && jMatch.names['en'] === 'Shemini Atzeret' && hdate.getMonthName() === 'Tishrei' && hdate.getDate() === 22) {
                                    // It's both in Israel
                                    isOfficial = true;
                                    jName = settings.language === 'he' ? 'שמיני עצרת ושימחת תורה' : 'Shemini Atzeret & Simchat Torah';
                                } else if (isIsrael && isDiasporaOnly) {
                                    jMatch = undefined; // Skip the second day
                                }

                                if (jMatch) {
                                    isOfficial = jMatch.official || isOfficial;
                                    if (!jName) {
                                        jName = jMatch.names[settings.language] || jMatch.names['en'] || (jMatch as any).nameEn || '';
                                    }
                                }
                            }

                            if (!jMatch && isRoshChodesh) {
                                if (settings.language === 'ru') jName = 'Рош Ходеш';
                                else if (settings.language === 'he') jName = 'ראש חודש';
                                else jName = 'Rosh Chodesh';
                            }

                            // Style
                            let jStyle = 'text-gray-500 opacity-60 font-serif text-lg';
                            if (jMatch?.type === 'holiday') jStyle = 'text-red-500 font-bold text-lg';
                            else if (jMatch?.type === 'chol_hamoed') jStyle = 'text-orange-500 font-bold';
                            else if (isRoshChodesh) jStyle = 'text-cyan-600 font-bold';

                            calendarData.push({
                                type: 'jewish',
                                dayStr: jDayStr,
                                holiday: jName,
                                style: jStyle,
                                corner: direction === 'rtl' ? topLeft : topRight
                            });

                            // Shabbat Times
                            if (location) {
                                const dayOfWeek = day.getDay();
                                const sunsetStr = getSunsetTime(day, location.lat, sunsetMap);
                                if (sunsetStr) {
                                    const sunsetDate = parse(sunsetStr, 'HH:mm', day);
                                    if (dayOfWeek === 5) {
                                        const candles = subMinutes(sunsetDate, 18);
                                        shabbatTime = `🕯️ ${format(candles, 'HH:mm')}`;
                                    } else if (dayOfWeek === 6) {
                                        const havdalah = addMinutes(sunsetDate, 42);
                                        shabbatTime = `✨ ${format(havdalah, 'HH:mm')}`;
                                    }
                                }
                            }
                        }

                        // 2. Muslim Calendar
                        if (activeCals.includes('muslim')) {
                            const hDate = getHijriDate(day);
                            const mMatch = muslimHolidays.find(h => h.month === hDate.month && h.day === hDate.day);
                            let mName = '';
                            if (mMatch) {
                                mName = mMatch.names[settings.language] || mMatch.names['en'] || '';
                                if (mMatch.official) isOfficial = true; // Mark official if any calendar says so
                            }

                            let mStyle = 'text-emerald-600/60 font-serif text-sm';
                            if (mMatch?.type === 'holiday') mStyle = 'text-emerald-500 font-bold';

                            calendarData.push({
                                type: 'muslim',
                                dayStr: `${hDate.day}`, // Just number for cleaner UI?
                                holiday: mName,
                                style: mStyle,
                                corner: direction === 'rtl' ? topLeft : topRight
                            });
                        }

                        // 3. National Holidays
                        const nMatch = nationalHolidays.find(h => {
                            const effectiveCal = h.calendarType || countryCalendarType;

                            if (effectiveCal === 'jewish') {
                                // Match Hebrew Date
                                const hdate = new HDate(day);
                                const jDateStr = `${hdate.getDate()} ${hdate.getMonthName()}`;
                                return h.date === jDateStr;
                            } else if (effectiveCal === 'muslim') {
                                // Match Muslim Date
                                const hDate = getHijriDate(day);
                                // Check if we already have it in local var? No, block scoped.
                                // Just re-calc or lift up. Re-calc is cheap enough.
                                return h.date === `${hDate.day} ${hDate.month}`;
                            } else {
                                // Gregorian
                                return h.date === format(day, 'yyyy-MM-dd');
                            }
                        });

                        if (nMatch) {
                            // National holidays are usually official
                            isOfficial = true;
                            calendarData.push({
                                dayStr: '',
                                holiday: nMatch.names[settings.language] || nMatch.names['en'] || nMatch.name,
                                style: 'text-purple-400 font-bold',
                                corner: ''
                            } as any);
                        }

                        // Combine Holidays for bottom display and deduplicate
                        const holidayNames = calendarData
                            .filter((c): c is typeof c & { holiday: string } => !!c.holiday)
                            .map(c => c.holiday.trim());

                        const allHolidays: string[] = [];
                        const seenCanonical = new Set<string>();

                        const getCanonical = (name: string) => {
                            const low = name.toLowerCase();
                            if (low.includes('independence') || low.includes('atzmaut') || low.includes('עצמאות')) return 'independence_day';
                            if (low.includes('shoah') || low.includes('holocaust') || low.includes('שואה')) return 'yom_hashoah';
                            if (low.includes('zikaron') || low.includes('memorial day') || low.includes('זיכרון')) return 'yom_hazikaron';
                            if (low.includes('rosh hashanah') || low.includes('hashana') || low.includes('ראש השנה')) return 'rosh_hashanah';
                            if (low.includes('yom kippur') || low.includes('kipur') || low.includes('יום כיפור')) return 'yom_kippur';
                            if (low.includes('shavuot') || low.includes('שבועות')) return 'shavuot';
                            if (low.includes('sukkot') || low.includes('סוכות')) return 'sukkot';
                            if (low.includes('passover') || low.includes('pesach') || low.includes('פסח')) return 'passover';
                            if (low.includes('simchat torah') || low.includes('שמחת תורה')) return 'simchat_torah';
                            if (low.includes('shemini atzeret') || low.includes('שמיני עצרת')) return 'shemini_atzeret';
                            if (low.includes('hanukkah') || low.includes('chanukah') || low.includes('חנוכה')) return 'hanukkah';
                            if (low.includes('purim') || low.includes('פורים')) return 'purim';
                            if (low.includes('esther') || low.includes('אסתר')) return 'fast_of_esther';
                            if (low.includes('tammuz') || low.includes('תמוז')) return '17th_of_tammuz';
                            if (low.includes('gedaliah') || low.includes('גדליה')) return 'fast_of_gedaliah';
                            if (low.includes('tevet') || low.includes('טבת')) return 'asara_btevet';
                            if (low.includes('hoshana') || low.includes('הושענא')) return 'hoshana_raba';
                            return low;
                        };

                        holidayNames.forEach(name => {
                            const canonical = getCanonical(name);
                            if (!seenCanonical.has(canonical)) {
                                seenCanonical.add(canonical);
                                allHolidays.push(name);
                            }
                        });


                        return (
                            <div
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={`
                                  p-2.5 rounded-2xl relative flex flex-col transition-all hover:-translate-y-1 hover:bg-surface-hover cursor-pointer group min-h-0
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
                                <span className={`font-bold mb-auto ${SIZE_MAP[settings.dayNumberSize]} ${isDayToday ? 'text-primary' : (isOfficial || shouldHighlightWeekend) ? 'text-red-600 dark:text-red-400' : 'text-text-main'}`}>
                                    {format(day, 'd')}
                                </span>

                                {/* Additional Calendars (Corners) */}
                                {calendarData.map((cal) => (
                                    <span key={cal.type} className={`absolute ${cal.corner} ${cal.style} ${cal.type === 'muslim' && activeCals.includes('jewish') ? 'mt-6' : ''}`}>
                                        {cal.dayStr}
                                    </span>
                                ))}

                                {/* Holidays & Times (Bottom Center) - Relative to root sizing */}
                                <div className="absolute bottom-1.5 left-0 right-0 flex flex-col items-center justify-end pointer-events-none gap-0.5 px-0.5">
                                    {allHolidays.slice(0, 2).map((h, i) => (
                                        <div key={i} className="text-[0.6rem] font-semibold text-center text-sky-400 leading-tight w-full truncate px-0.5">
                                            {h}
                                        </div>
                                    ))}
                                    {shabbatTime && (
                                        <div className="text-[0.65rem] font-mono font-medium text-text-muted bg-surface/90 px-1 rounded-sm shadow-sm backdrop-blur-sm">
                                            {shabbatTime}
                                        </div>
                                    )}
                                </div>

                                {/* Events List */}
                                <div className={`w-full mt-1 flex flex-col gap-0.5 ${settings.dayNumberAlign === 'center' ? 'items-center' : settings.dayNumberAlign === 'right' ? 'items-end' : 'items-start'} ${(allHolidays.length > 0 || shabbatTime) ? 'mb-5' : ''}`}>
                                    {dayEvents.slice(0, 3).map(e => (
                                        <div key={e.id} className="text-[9px] bg-sky-500/10 text-sky-400 px-1 py-0.5 rounded-md truncate max-w-full border border-sky-500/20 leading-none">
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
                </div >
            </div >
        );
    };

    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden mt-2">
            {renderCalendarGrid()}

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
