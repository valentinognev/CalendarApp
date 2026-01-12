import React, { useState } from 'react';
import { useAppStore, type Recurrence, type CalendarEvent } from '../../store/AppContext';
import { X, Plus, Trash2, Calendar, Repeat } from 'lucide-react';
import { format } from 'date-fns';
import { enUS, ru, he } from 'date-fns/locale';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, selectedDate }) => {
    const { addEvent, deleteEvent, getEventsForDate, settings } = useAppStore();
    const [title, setTitle] = useState('');
    const [recurrence, setRecurrence] = useState<Recurrence>('none');

    if (!isOpen) return null;

    const currentLocale = settings.language === 'ru' ? ru : settings.language === 'he' ? he : enUS;
    const dateEvents = getEventsForDate(selectedDate);

    const handleAdd = () => {
        if (!title.trim()) return;

        const newEvent: CalendarEvent = {
            id: crypto.randomUUID(),
            title: title.trim(),
            date: selectedDate.toISOString(),
            recurrence,
        };

        addEvent(newEvent);
        setTitle('');
        setRecurrence('none');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />

            <div className="relative bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700 bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-light text-white flex items-center gap-2">
                            <Calendar size={20} className="text-sky-400" />
                            {format(selectedDate, 'PPP', { locale: currentLocale })}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Add Event Form */}
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="New event title..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-sky-500 transition-colors"
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            />
                            <button
                                onClick={handleAdd}
                                disabled={!title.trim()}
                                className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
                            >
                                <Plus size={24} />
                            </button>
                        </div>

                        {/* Recurrence Selector */}
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {(['none', 'weekly', 'monthly', 'yearly'] as Recurrence[]).map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRecurrence(r)}
                                    className={`
                                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap
                                        ${recurrence === r
                                            ? 'bg-sky-900/50 border-sky-500 text-sky-400'
                                            : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-400'}
                                    `}
                                >
                                    <Repeat size={14} />
                                    <span className="capitalize">{r === 'none' ? 'One-time' : r}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Events</h3>

                        {dateEvents.length === 0 ? (
                            <div className="text-center py-8 text-slate-600 italic">No events for this day</div>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {dateEvents.map(event => (
                                    <div key={event.id} className="group flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium">{event.title}</span>
                                            {event.recurrence !== 'none' && (
                                                <span className="text-xs text-sky-500/80 flex items-center gap-1">
                                                    <Repeat size={10} /> {event.recurrence}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => deleteEvent(event.id)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
