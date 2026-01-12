import React from 'react';
import { useAppStore } from '../../store/AppContext';

interface AppLayoutProps {
    calendar: React.ReactNode;
    media: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ calendar, media }) => {
    const { isSplit } = useAppStore();

    return (
        <div className="flex w-screen h-screen overflow-hidden p-6 gap-6">
            {/* Calendar Section */}
            <section
                className={`
                    flex flex-col h-full p-8 rounded-3xl glass transition-all duration-500 ease-in-out shadow-2xl
                    ${isSplit ? 'w-1/2' : 'w-full'}
                `}
            >
                {calendar}
            </section>

            {/* Media Section */}
            <section
                className={`
                    h-full relative overflow-hidden rounded-3xl transition-all duration-500 ease-in-out
                    ${isSplit ? 'w-1/2 opacity-100 shadow-2xl border border-border/50' : 'w-0 opacity-0 border-0 p-0'}
                `}
            >
                {media}
            </section>
        </div>
    );
};
