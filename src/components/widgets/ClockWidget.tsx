import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/AppContext';
import { format } from 'date-fns';
import { CalendarStrategyFactory } from '../../services/calendar/CalendarStrategyFactory';

export const ClockWidget: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const { settings } = useAppStore();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeFormatString = settings.timeFormat === '12' ? 'hh:mm:ss a' : 'HH:mm:ss';

    const strategy = CalendarStrategyFactory.getStrategy(settings.calendarSystem);

    // Format: Handled by Strategy
    const dateString = strategy.formatDate(time, settings.language);

    return (
        <div className="flex flex-col items-start select-none">
            {/* Font matched to Day Digits: font-bold, sans-serif (default) */}
            <div className="text-4xl font-bold text-text-main">
                {format(time, timeFormatString)}
            </div>
            <div className="text-2xl text-primary font-bold mt-1 uppercase">
                {dateString}
            </div>
        </div>
    );
};
