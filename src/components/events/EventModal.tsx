import React, { useState } from 'react';
import { useAppStore, type Recurrence, type CalendarEvent } from '../../store/AppContext';
import { X, Plus, Trash2, Calendar, Repeat } from 'lucide-react';
import { format } from 'date-fns';
import {
    enUS, ru, he, zhCN, es, fr, de, pt, it, ja, ko, hi, tr, nl,
    sv, pl, vi, th, uk, ar, id, nb, fi, da, cs, hu, ro, el, sk, hr, faIR, bn
} from 'date-fns/locale';
import { getTranslations } from '../../utils/translations';

const LOCALE_MAP: Record<string, any> = {
    en: enUS, ru, he, zh: zhCN, es, fr, de, pt, it, ja, ko, hi, tr, nl,
    sv, pl, vi, th, uk, ar, id, no: nb, fi, da, cs, hu, ro, el, sk, hr, fa: faIR, bn
};

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

    const currentLocale = LOCALE_MAP[settings.language] || enUS;
    const dateEvents = getEventsForDate(selectedDate);

    // Get translations (with fallback)
    const t = getTranslations(settings.language);

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

    // Helper for recurrence labels
    const getRecLabel = (r: string) => {
        switch (r) {
            case 'none': return t.recNone;
            case 'weekly': return t.recWeekly;
            case 'monthly': return t.recMonthly;
            case 'yearly': return t.recYearly;
            default: return r;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />

            <div className="relative bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 overflow-hidden glass">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-white/5">
                    <div>
                        <h2 className="text-xl font-light text-white flex items-center gap-2">
                            <Calendar size={20} className="text-sky-400" />
                            {format(selectedDate, 'PPP', { locale: currentLocale })}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
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
                                placeholder={t.eventNewTitle}
                                className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-sky-500 transition-colors placeholder:text-slate-500"
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
                                            ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                                            : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'}
                                    `}
                                >
                                    <Repeat size={14} />
                                    <span className="capitalize">{getRecLabel(r)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.eventsListTitle}</h3>

                        {dateEvents.length === 0 ? (
                            <div className="text-center py-8 text-slate-600 italic">{t.noEventsLabel}</div>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {dateEvents.map(event => (
                                    <div key={event.id} className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium">{event.title}</span>
                                            {event.recurrence !== 'none' && (
                                                <span className="text-xs text-sky-500/80 flex items-center gap-1">
                                                    <Repeat size={10} /> {getRecLabel(event.recurrence)}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => deleteEvent(event.id)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
