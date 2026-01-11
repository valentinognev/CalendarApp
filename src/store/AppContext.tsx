import React, { createContext, useContext, useState, type ReactNode } from 'react';

type ViewMode = 'month' | 'week';

interface AppState {
    viewMode: ViewMode;
    isSplit: boolean;
    toggleView: () => void;
    toggleSplit: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [isSplit, setIsSplit] = useState(false);

    const toggleView = () => setViewMode(prev => prev === 'month' ? 'week' : 'month');
    const toggleSplit = () => setIsSplit(prev => !prev);

    return (
        <AppContext.Provider value={{ viewMode, isSplit, toggleView, toggleSplit }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppStore = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppStore must be used within an AppProvider');
    return context;
};
