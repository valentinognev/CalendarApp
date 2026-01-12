import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks, isSameDay, startOfDay } from 'date-fns';
import { getLanguageDirection } from '../services/LanguageService';

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

export interface Settings {
    language: Language;
    theme: Theme;
    weekStart: 0 | 1; // 0 = Sunday, 1 = Monday
    highlightWeekend: WeekendMode;
    dayNumberSize: Size;
    dayNumberAlign: Alignment;
    dayNameSize: Size; // sm, md, lg
    dayNameAlign: Alignment;
    timeFormat: '12' | '24';
    activeCalendars: string[]; // e.g., 'jewish', 'muslim'
}

const DEFAULT_SETTINGS: Settings = {
    language: 'en',
    theme: 'dark',
    weekStart: 1,
    highlightWeekend: 'both',
    dayNumberSize: 'lg',
    dayNumberAlign: 'left',
    dayNameSize: 'sm',
    dayNameAlign: 'center',
    timeFormat: '24',
    activeCalendars: [],
};

interface AppState {
    viewMode: ViewMode;
    isSplit: boolean;
    settings: Settings;
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
    const [direction, setDirection] = useState<Direction>('ltr');

    const [settings, setSettings] = useState<Settings>(() => {
        try {
            const saved = localStorage.getItem('calendar_settings');
            return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
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

    const navigate = (direction: 'prev' | 'next') => {
        if (viewMode === 'month') {
            setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
        } else {
            setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
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

    const [location, setLocation] = useState<{ lat: number; long: number } | null>(null);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Geolocation denied or failed:', error);
                    // Default to Jerusalem? Or just don't show times. 
                    // Let's leave null to indicate "no local data"
                }
            );
        }
    }, []);

    return (
        <AppContext.Provider value={{
            viewMode, isSplit, settings, currentDate, events, location, direction,
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
