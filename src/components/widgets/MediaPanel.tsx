import React from 'react';

export const MediaPanel: React.FC = () => {
    return (
        <div className="w-full h-full relative">
            <img
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2574&auto=format&fit=crop"
                alt="Wall Art"
                className="w-full h-full object-cover filter brightness-[0.75]"
            />
            <div className="absolute bottom-8 left-8 text-white/80 text-sm font-light">
                Daily Inspiration
            </div>
        </div>
    );
};
