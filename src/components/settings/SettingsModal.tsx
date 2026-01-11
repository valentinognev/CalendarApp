import React from 'react';
import { useAppStore, type Language, type WeekendMode, type Size, type Alignment } from '../../store/AppContext';
import { X, Moon, Sun, Globe, Layout, Palette } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { settings, updateSettings } = useAppStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-slate-700 bg-slate-900/50">
                    <h2 className="text-2xl font-light text-white">Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto p-8 space-y-10 custom-scrollbar">

                    {/* Section: Appearance */}
                    <section>
                        <h3 className="flex items-center gap-2 text-sky-400 font-semibold uppercase tracking-wider text-sm mb-6">
                            <Palette size={16} /> Theme & Appearance
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Theme */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">Color Theme</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateSettings({ theme: 'dark' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${settings.theme === 'dark' ? 'bg-slate-800 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                    >
                                        <Moon size={18} /> Dark
                                    </button>
                                    <button
                                        onClick={() => updateSettings({ theme: 'light' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${settings.theme === 'light' ? 'bg-slate-100 border-sky-500 text-sky-600' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                    >
                                        <Sun size={18} /> Light
                                    </button>
                                </div>
                            </div>

                            {/* Weekend Highlight */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">Highlight Weekends</label>
                                <select
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-sky-500 appearance-none"
                                    value={settings.highlightWeekend}
                                    onChange={(e) => updateSettings({ highlightWeekend: e.target.value as WeekendMode })}
                                >
                                    <option value="none">None</option>
                                    <option value="sat">Saturday</option>
                                    <option value="sun">Sunday</option>
                                    <option value="both">Both (Sat & Sun)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section: Regional */}
                    <section>
                        <h3 className="flex items-center gap-2 text-sky-400 font-semibold uppercase tracking-wider text-sm mb-6">
                            <Globe size={16} /> Regional
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Language */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">Language</label>
                                <select
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                                    value={settings.language}
                                    onChange={(e) => updateSettings({ language: e.target.value as Language })}
                                >
                                    <option value="en">English</option>
                                    <option value="ru">Русский</option>
                                    <option value="he">עברית</option>
                                </select>
                            </div>

                            {/* Start of Week */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">Start Week On</label>
                                <div className="flex bg-slate-800 p-1 rounded-xl">
                                    <button
                                        onClick={() => updateSettings({ weekStart: 0 })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${settings.weekStart === 0 ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Sunday
                                    </button>
                                    <button
                                        onClick={() => updateSettings({ weekStart: 1 })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${settings.weekStart === 1 ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Monday
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Layout Detail */}
                    <section>
                        <h3 className="flex items-center gap-2 text-sky-400 font-semibold uppercase tracking-wider text-sm mb-6">
                            <Layout size={16} /> Layout Details
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Number Size */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">Day Number Size</label>
                                <div className="flex gap-2">
                                    {(['sm', 'md', 'lg', 'xl'] as Size[]).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateSettings({ dayNumberSize: s })}
                                            className={`flex-1 py-2 border rounded-lg uppercase text-xs font-bold ${settings.dayNumberSize === s ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Number Align */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">Day Number Align</label>
                                <div className="flex gap-2">
                                    {(['left', 'center', 'right'] as Alignment[]).map(a => (
                                        <button
                                            key={a}
                                            onClick={() => updateSettings({ dayNumberAlign: a })}
                                            className={`flex-1 py-2 border rounded-lg text-xs font-bold capitalize ${settings.dayNumberAlign === a ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name Size */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">Day Name Size</label>
                                <div className="flex gap-2">
                                    {(['sm', 'md', 'lg'] as Size[]).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateSettings({ dayNameSize: s })}
                                            className={`flex-1 py-2 border rounded-lg uppercase text-xs font-bold ${settings.dayNameSize === s ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name Align */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">Day Name Align</label>
                                <div className="flex gap-2">
                                    {(['left', 'center', 'right'] as Alignment[]).map(a => (
                                        <button
                                            key={a}
                                            onClick={() => updateSettings({ dayNameAlign: a })}
                                            className={`flex-1 py-2 border rounded-lg text-xs font-bold capitalize ${settings.dayNameAlign === a ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};
