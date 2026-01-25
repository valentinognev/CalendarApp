import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { addWeeks, subWeeks, isSameDay, startOfDay, format } from 'date-fns';
import { getLanguageDirection } from '../services/LanguageService';
import { getCoordinatesFromTimezone } from '../services/timezoneService';
import { fetchSunsetTimes, getSunsetTime } from '../services/SunsetService';
import { CalendarStrategyFactory } from '../services/calendar/CalendarStrategyFactory';

type ViewMode = 'month' | 'week';
export type Language = string; // Support dynamic languages
export type Theme = 'dark' | 'light';
export type Direction = 'ltr' | 'rtl';
export type Alignment = 'left' | 'center' | 'right';
export type Size = 'sm' | 'md' | 'lg' | 'xl';
export type WeekendMode = 'sat' | 'sun' | 'both' | 'none' | 'fri' | 'fri-sat';

export type Recurrence = 'none' | 'weekly' | 'monthly' | 'yearly';

export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // ISO string
    recurrence: Recurrence;
}

export interface CustomTheme {
    primary: string;
    background: string;
    surface: string;
}

export const IMAGE_CATEGORIES = [
    'Nature', 'Science', 'Technology', 'People', 'Cars', 'Architecture',
    'Abstract', 'Animals', 'Space', 'Ocean', 'Forest', 'City',
    'Food', 'Interiors', 'Art', 'Travel', 'Sports', 'Music', 'Business', 'Minimalism'
];

export interface Settings {
    language: Language;
    theme: Theme;
    weekStart: 0 | 1; // 0 = Sunday, 1 = Monday
    highlightWeekend: WeekendMode;
    dayNumberSize: Size;
    dayNumberAlign: Alignment;
    primaryDayNumberStyle: 'sans' | 'serif';
    secondaryDayNumberStyle: 'sans' | 'serif';
    dayNameSize: Size; // sm, md, lg
    dayNameAlign: Alignment;
    timeFormat: '12' | '24';
    activeCalendars: string[]; // e.g., 'jewish', 'muslim'
    country: string; // For National Holidays
    calendarSystem: 'gregorian' | 'jewish' | 'muslim'; // Primary Calendar System

    // New Features
    performanceMode: 'high' | 'lite';
    customDarkTheme?: CustomTheme;
    customLightTheme?: CustomTheme;
    imageSource: 'category' | 'local';
    imageCategories: string[]; // Changed to array
    localImagePath: string;
    imageChangeFrequency: number; // in milliseconds

    // Location
    manualLocation: boolean;
    lat: number;
    long: number;
    manualCity: string;
    manualCountry: string;
    autoTheme: boolean;
}

const DEFAULT_SETTINGS: Settings = {
    language: 'en',
    theme: 'dark',
    weekStart: 1,
    highlightWeekend: 'both',
    dayNumberSize: 'lg',
    dayNumberAlign: 'left',
    primaryDayNumberStyle: 'sans',
    secondaryDayNumberStyle: 'serif',
    dayNameSize: 'sm',
    dayNameAlign: 'center',
    timeFormat: '24',
    activeCalendars: [],
    country: 'United States', // Default
    calendarSystem: 'gregorian',

    // New Defaults
    performanceMode: 'high',
    imageSource: 'category',
    imageCategories: ['Nature'], // Default array
    localImagePath: '',
    imageChangeFrequency: 3600000, // 1 hour
    manualLocation: false,
    lat: 31.0461, // Default to Israel
    long: 34.8516,
    manualCity: '',
    manualCountry: '',
    autoTheme: false
};

interface AppState {
    viewMode: ViewMode;
    isSplit: boolean;
    settings: Settings;
    today: Date;
    currentDate: Date;
    events: CalendarEvent[];
    toggleView: () => void;
    toggleSplit: () => void;
    updateSettings: (newSettings: Partial<Settings>) => void;
    navigate: (direction: 'prev' | 'next') => void;
    jumpToToday: () => void;
    addEvent: (event: CalendarEvent) => void;
    deleteEvent: (id: string) => void;
    getEventsForDate: (date: Date) => CalendarEvent[];
    location: { lat: number; long: number } | null;
    direction: Direction;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [isSplit, setIsSplit] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [today, setToday] = useState(startOfDay(new Date()));
    const [direction, setDirection] = useState<Direction>('ltr');
    const [location, setLocation] = useState<{ lat: number; long: number } | null>(null);

    const [settings, setSettings] = useState<Settings>(() => {
        try {
            const saved = localStorage.getItem('calendar_settings');
            let initialSettings = saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;

            // Check URL Parameters for overrides (CLI-like usage)
            const params = new URLSearchParams(window.location.search);
            if (params.get('lite') === 'true' || params.get('performance') === 'lite') {
                initialSettings.performanceMode = 'lite';
            }

            return initialSettings;
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    });

    const [events, setEvents] = useState<CalendarEvent[]>(() => {
        try {
            const saved = localStorage.getItem('calendar_events');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('calendar_settings', JSON.stringify(settings));

        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }

        if (settings.performanceMode === 'lite') {
            document.documentElement.classList.add('lite-mode');
        } else {
            document.documentElement.classList.remove('lite-mode');
        }

        const updateDir = async () => {
            const dir = await getLanguageDirection(settings.language);
            setDirection(dir);
            document.documentElement.setAttribute('dir', dir);
        };
        updateDir();

        document.documentElement.setAttribute('lang', settings.language);

    }, [settings]);

    useEffect(() => {
        localStorage.setItem('calendar_events', JSON.stringify(events));
    }, [events]);

    const [sunsetMap, setSunsetMap] = useState<Map<number, Record<string, string>>>(new Map());

    useEffect(() => {
        const loadSunsets = async () => {
            const map = await fetchSunsetTimes();
            setSunsetMap(map);
        };
        loadSunsets();
    }, []);

    // auto-theme and auto-refresh 'today' every minute
    useEffect(() => {
        const refresh = () => {
            const now = new Date();
            const startOfToday = startOfDay(now);

            // 1. Refresh today
            if (startOfToday.getTime() !== today.getTime()) {
                setToday(startOfToday);
                setCurrentDate(prev => {
                    if (isSameDay(prev, today)) return startOfToday;
                    return prev;
                });
            }

            // 2. Auto Theme Switching
            if (settings.autoTheme) {
                const currentTimeStr = format(now, 'HH:mm');
                const [curH, curM] = currentTimeStr.split(':').map(Number);
                const curMinutes = curH * 60 + curM;
                const morningMinutes = 7 * 60; // 07:00

                const effectiveLat = location?.lat ?? settings.lat;
                const sunsetStr = getSunsetTime(now, effectiveLat, sunsetMap);

                let targetTheme: Theme = 'dark';
                let diagnosticInfo = '';

                if (sunsetStr) {
                    const [sunH, sunM] = sunsetStr.split(':').map(Number);
                    const sunsetMinutes = sunH * 60 + sunM;
                    const isBetween = (curMinutes >= morningMinutes && curMinutes < sunsetMinutes);
                    targetTheme = isBetween ? 'light' : 'dark';
                    diagnosticInfo = `(Sunset: ${sunsetStr})`;
                } else {
                    // Fallback to basic sunset (17:30) if data not loaded or no match
                    const fallbackSunset = 17 * 60 + 30;
                    const isBetween = (curMinutes >= morningMinutes && curMinutes < fallbackSunset);
                    targetTheme = isBetween ? 'light' : 'dark';
                    diagnosticInfo = `(Data Pending/Missing - Fallback 17:30 used)`;
                }

                if (settings.theme !== targetTheme) {
                    console.log(`[AutoTheme] ${currentTimeStr} -> ${targetTheme} ${diagnosticInfo}`);
                    updateSettings({ theme: targetTheme });
                }
            }
        };

        refresh(); // Immediate check
        const interval = setInterval(refresh, 60000); // Check every minute

        // Trigger refresh on focus or visibility change (helps detect OS-level time/timezone jumps)
        window.addEventListener('focus', refresh);
        document.addEventListener('visibilitychange', refresh);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', refresh);
            document.removeEventListener('visibilitychange', refresh);
        };
    }, [today, settings.autoTheme, settings.theme, location, sunsetMap]);

    const toggleView = () => setViewMode(prev => prev === 'month' ? 'week' : 'month');
    const toggleSplit = () => setIsSplit(prev => !prev);

    const updateSettings = (partial: Partial<Settings>) => {
        setSettings(prev => {
            const newSettings = { ...prev, ...partial };
            // If switching to Hebrew, ensure Jewish calendar is active if it isn't already
            if (partial.language === 'he' && !newSettings.activeCalendars.includes('jewish')) {
                newSettings.activeCalendars = [...newSettings.activeCalendars, 'jewish'];
            }
            return newSettings;
        });
    };

    const navigate = (dir: 'prev' | 'next') => {
        if (viewMode === 'month') {
            const strategy = CalendarStrategyFactory.getStrategy(settings.calendarSystem);
            setCurrentDate(prev => strategy.navigate(prev, dir));
        } else {
            setCurrentDate(prev => dir === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
        }
    };

    const jumpToToday = () => setCurrentDate(new Date());

    const addEvent = (event: CalendarEvent) => {
        setEvents(prev => [...prev, event]);
    };

    const deleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    const getEventsForDate = (date: Date) => {
        const targetDay = startOfDay(date);

        return events.filter(event => {
            const eventStart = startOfDay(new Date(event.date));
            if (targetDay < eventStart) return false;

            // Recurrence Logic
            switch (event.recurrence) {
                case 'none':
                    return isSameDay(targetDay, eventStart);
                case 'weekly':
                    return targetDay.getDay() === eventStart.getDay();
                case 'monthly':
                    return targetDay.getDate() === eventStart.getDate();
                case 'yearly':
                    return targetDay.getMonth() === eventStart.getMonth() && targetDay.getDate() === eventStart.getDate();
                default:
                    return false;
            }
        });
    };

    useEffect(() => {
        if (settings.manualLocation) {
            setLocation({ lat: settings.lat, long: settings.long });
            return;
        }

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Geolocation denied or failed, using timezone/settings fallback:', error);
                    const tzCoords = getCoordinatesFromTimezone();
                    if (tzCoords) {
                        setLocation({ lat: tzCoords.lat, long: tzCoords.long });
                    } else {
                        setLocation({ lat: settings.lat, long: settings.long });
                    }
                }
            );
        } else {
            const tzCoords = getCoordinatesFromTimezone();
            if (tzCoords) {
                setLocation({ lat: tzCoords.lat, long: tzCoords.long });
            } else {
                setLocation({ lat: settings.lat, long: settings.long });
            }
        }
    }, [settings.manualLocation, settings.lat, settings.long]);

    return (
        <AppContext.Provider value={{
            viewMode, isSplit, settings, today, currentDate, events, location, direction,
            toggleView, toggleSplit, updateSettings, navigate, jumpToToday,
            addEvent, deleteEvent, getEventsForDate
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppStore = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppStore must be used within an AppProvider');
    return context;
};
