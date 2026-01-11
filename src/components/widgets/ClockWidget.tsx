import React, { useEffect, useState } from 'react';

export const ClockWidget: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // 24h format looks slightly cleaner for dashboards, but easily changeable
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex flex-col">
            <h1 className="text-6xl font-light text-white tracking-tighter leading-none">
                {formatTime(time)}
            </h1>
            <span className="text-xl text-slate-400 font-medium mt-1">
                {formatDate(time)}
            </span>
        </div>
    );
};
