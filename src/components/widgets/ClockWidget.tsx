import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/AppContext';
import { format } from 'date-fns';
import { getLocale } from '../../utils/dateLocales';

export const ClockWidget: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const { settings } = useAppStore();
    const currentLocale = getLocale(settings.language);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeFormatString = settings.timeFormat === '12' ? 'hh:mm:ss a' : 'HH:mm:ss';

    // Format: "Monday, 12" (Weekday, Day) - Localized
    const dateString = format(time, 'EEEE, d', { locale: currentLocale });

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
