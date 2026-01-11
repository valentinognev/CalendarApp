import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';

type ViewMode = 'month' | 'week';
export type Language = 'en' | 'ru' | 'he';
export type Theme = 'dark' | 'light';
export type Direction = 'ltr' | 'rtl';
export type Alignment = 'left' | 'center' | 'right';
export type Size = 'sm' | 'md' | 'lg' | 'xl';
export type WeekendMode = 'sat' | 'sun' | 'both' | 'none';

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
};

interface AppState {
    viewMode: ViewMode;
    isSplit: boolean;
    settings: Settings;
    currentDate: Date; // [NEW] Lifted state
    toggleView: () => void;
    toggleSplit: () => void;
    updateSettings: (newSettings: Partial<Settings>) => void;
    navigate: (direction: 'prev' | 'next') => void; // [NEW]
    jumpToToday: () => void; // [NEW]
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [isSplit, setIsSplit] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date()); // [NEW]

    const [settings, setSettings] = useState<Settings>(() => {
        // Basic persistence
        try {
            const saved = localStorage.getItem('calendar_settings');
            return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    });

    useEffect(() => {
        localStorage.setItem('calendar_settings', JSON.stringify(settings));

        // Apply Theme
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }

        // Apply Direction (Simple check for now, can be mapped)
        const dir = settings.language === 'he' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', settings.language);

    }, [settings]);

    const toggleView = () => setViewMode(prev => prev === 'month' ? 'week' : 'month');
    const toggleSplit = () => setIsSplit(prev => !prev);

    const updateSettings = (partial: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...partial }));
    };

    // [NEW] Navigation Logic
    const navigate = (direction: 'prev' | 'next') => {
        if (viewMode === 'month') {
            setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
        } else {
            setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
        }
    };

    const jumpToToday = () => setCurrentDate(new Date());

    return (
        <AppContext.Provider value={{
            viewMode, isSplit, settings, currentDate,
            toggleView, toggleSplit, updateSettings, navigate, jumpToToday
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
