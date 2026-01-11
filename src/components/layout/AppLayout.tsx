import React from 'react';
import { useAppStore } from '../../store/AppContext';

interface AppLayoutProps {
    calendar: React.ReactNode;
    media: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ calendar, media }) => {
    const { isSplit } = useAppStore();

    return (
        <div className="flex w-screen h-screen bg-background overflow-hidden transition-all duration-500 ease-in-out">
            {/* Calendar Section - Takes full width or half based on split state */}
            <section
                className={`flex flex-col h-full bg-background p-8 transition-all duration-500 ease-in-out border-r border-slate-700
          ${isSplit ? 'w-1/2' : 'w-full'}
        `}
            >
                {calendar}
            </section>

            {/* Media Section - Hidden or half width */}
            <section
                className={`h-full relative overflow-hidden transition-all duration-500 ease-in-out
          ${isSplit ? 'w-1/2 opacity-100' : 'w-0 opacity-0'}
        `}
            >
                {media}
            </section>
        </div>
    );
};
