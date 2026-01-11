import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday } from 'date-fns';

export const CalendarWidget: React.FC = () => {
    const { viewMode } = useAppStore();
    const today = new Date();

    const renderMonthView = () => {
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        return (
            <div className="flex flex-col h-full animate-in fade-in duration-500">
                {/* Header Row */}
                <div className="grid grid-cols-7 mb-4 border-b border-slate-700 pb-2">
                    {weekDays.map(day => (
                        <div key={day} className="text-right text-slate-400 font-semibold uppercase text-sm tracking-wider pr-4">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 grid-rows-5 gap-4 flex-grow">
                    {calendarDays.map((day, idx) => {
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isDayToday = isToday(day);

                        return (
                            <div
                                key={day.toString()}
                                className={`
                  p-4 rounded-2xl relative flex flex-col transition-all hover:-translate-y-1 hover:bg-slate-700/50
                  ${isDayToday
                                        ? 'bg-gradient-to-br from-slate-800 to-sky-900/20 border border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                                        : 'bg-slate-800 border border-transparent'}
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                `}
                            >
                                <span className={`text-2xl font-bold mb-auto ${isDayToday ? 'text-sky-400' : 'text-slate-200'}`}>
                                    {format(day, 'd')}
                                </span>
                                {/* Optional event dot placeholder */}
                                {isDayToday && <div className="w-2 h-2 rounded-full bg-sky-400 mt-2"></div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const start = startOfWeek(today, { weekStartsOn: 1 });
        const end = endOfWeek(today, { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start, end });

        return (
            <div className="grid grid-cols-7 gap-4 h-full animate-in fade-in slide-in-from-right-4 duration-500">
                {days.map(day => {
                    const isDayToday = isToday(day);
                    return (
                        <div
                            key={day.toString()}
                            className={`
                rounded-2xl flex flex-col items-center justify-center p-6 border transition-all
                ${isDayToday
                                    ? 'bg-slate-800 border-sky-500 scale-105 shadow-xl z-10'
                                    : 'bg-slate-800/50 border-transparent'}
              `}
                        >
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">
                                {format(day, 'EEEE')}
                            </span>
                            <span className={`text-5xl font-light ${isDayToday ? 'text-sky-400' : 'text-white'}`}>
                                {format(day, 'd')}
                            </span>
                            <div className="mt-8 text-xs text-slate-500 italic">No events</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden mt-6">
            {viewMode === 'month' ? renderMonthView() : renderWeekView()}
        </div>
    );
};
