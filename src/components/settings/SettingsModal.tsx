import React, { useState, useEffect } from 'react';
import { useAppStore, type Language, type Size, type Alignment, IMAGE_CATEGORIES, type CustomTheme } from '../../store/AppContext';
import { X, Moon, Sun, Globe, Layout, Palette, Image as ImageIcon, Folder, Clock, Zap, MapPin, Navigation, RotateCcw, Search, Activity } from 'lucide-react';
import { searchLocation } from '../../services/geocodingService';

import { TRANSLATIONS } from '../../utils/translations';
import { fetchCountryList, type CountryInfo } from '../../services/NationalHolidayService';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LANGUAGE_OPTIONS = [
    { code: 'am', name: 'Amharic (አማርኛ)' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'bn', name: 'Bengali (বাংলা)' },
    { code: 'bg', name: 'Bulgarian (Български)' },
    { code: 'ca', name: 'Catalan (Català)' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'hr', name: 'Croatian (Hrvatski)' },
    { code: 'cs', name: 'Czech (Čeština)' },
    { code: 'da', name: 'Danish (Dansk)' },
    { code: 'nl', name: 'Dutch (Nederlands)' },
    { code: 'en', name: 'English' },
    { code: 'et', name: 'Estonian (Eesti)' },
    { code: 'fil', name: 'Filipino (Filipino)' },
    { code: 'fi', name: 'Finnish (Suomi)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'el', name: 'Greek (Ελληνικά)' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
    { code: 'he', name: 'Hebrew (עברית)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'hu', name: 'Hungarian (Magyar)' },
    { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
    { code: 'it', name: 'Italian (Italiano)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
    { code: 'ko', name: 'Korean (한국어)' },
    { code: 'lv', name: 'Latvian (Latviešu)' },
    { code: 'lt', name: 'Lithuanian (Lietuvių)' },
    { code: 'ms', name: 'Malay (Bahasa Melayu)' },
    { code: 'mr', name: 'Marathi (मराठी)' },
    { code: 'no', name: 'Norwegian (Norsk)' },
    { code: 'fa', name: 'Persian (فارسی)' },
    { code: 'pl', name: 'Polish (Polski)' },
    { code: 'pt', name: 'Portuguese (Português)' },
    { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
    { code: 'ro', name: 'Romanian (Română)' },
    { code: 'ru', name: 'Russian (Русский)' },
    { code: 'sr', name: 'Serbian (Српски)' },
    { code: 'sk', name: 'Slovak (Slovenčina)' },
    { code: 'sl', name: 'Slovenian (Slovenščina)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'sw', name: 'Swahili (Kiswahili)' },
    { code: 'sv', name: 'Swedish (Svenska)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'te', name: 'Telugu (తెలుగు)' },
    { code: 'th', name: 'Thai (ไทย)' },
    { code: 'tr', name: 'Turkish (Türkçe)' },
    { code: 'uk', name: 'Ukrainian (Українська)' },
    { code: 'ur', name: 'Urdu (اردو)' },
    { code: 'vi', name: 'Vietnamese (Tiếng Việt)' }
];

type Tab = 'general' | 'appearance' | 'media';

const ColorInput: React.FC<{ label: string, value: string, onChange: (val: string) => void }> = ({ label, value, onChange }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <div className="flex items-center gap-2">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
            />
            <span className="text-sm font-mono text-slate-500">{value}</span>
        </div>
    </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { settings, updateSettings } = useAppStore();
    const [countries, setCountries] = useState<CountryInfo[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('general');

    useEffect(() => {
        const loadCountries = async () => {
            const list = await fetchCountryList();
            setCountries(list);
        };
        loadCountries();
    }, []);

    const t = new Proxy(TRANSLATIONS[settings.language] || {}, {
        get: (target, prop: string) => {
            return target[prop] || TRANSLATIONS['en'][prop] || prop;
        }
    }) as Record<string, string>;

    if (!isOpen) return null;

    // --- Logarithmic Slider Helpers ---
    // Range: 30s (30000ms) to 10 years (315360000000ms)
    const minFreq = 30000;
    const maxFreq = 315360000000;

    // Convert Ms to Slider (0-100)
    const freqToSlider = (ms: number) => {
        const minLog = Math.log(minFreq);
        const maxLog = Math.log(maxFreq);
        const valLog = Math.log(ms || minFreq);
        return ((valLog - minLog) / (maxLog - minLog)) * 100;
    };

    // Convert Slider (0-100) to Ms
    const sliderToFreq = (val: number) => {
        const minLog = Math.log(minFreq);
        const maxLog = Math.log(maxFreq);
        const scale = (maxLog - minLog) / 100;
        return Math.exp(minLog + scale * val);
    };

    const formatDuration = (ms: number) => {
        if (ms < 60000) return `${Math.round(ms / 1000)}s`;
        if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
        if (ms < 86400000) return `${Math.round(ms / 3600000)}h`;
        if (ms < 31536000000) return `${Math.round(ms / 86400000)}d`;
        return `${Math.round(ms / 31536000000)}y`;
    };

    const updateThemeColor = (mode: 'dark' | 'light', key: keyof CustomTheme, value: string) => {
        const currentTheme = mode === 'dark' ? settings.customDarkTheme : settings.customLightTheme;
        const newTheme = {
            primary: '#0ea5e9',
            background: mode === 'dark' ? '#0f172a' : '#ffffff',
            surface: mode === 'dark' ? '#1e293b' : '#f8fafc',
            ...currentTheme,
            [key]: value
        };

        if (mode === 'dark') updateSettings({ customDarkTheme: newTheme });
        else updateSettings({ customLightTheme: newTheme });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

            <div className="relative bg-slate-900 border border-slate-700 w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-8 py-5 border-b border-slate-700 bg-slate-900/50">
                    <h2 className="text-2xl font-light text-white">{t.title || 'Settings'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-grow overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-64 bg-slate-950/50 border-r border-slate-700 p-4 flex flex-col gap-2">
                        {[
                            { id: 'general', icon: Globe, label: t.tabGeneral || 'General' },
                            { id: 'appearance', icon: Palette, label: t.tabAppearance || 'Appearance' },
                            { id: 'media', icon: ImageIcon, label: t.tabMedia || 'Media' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                                    ${activeTab === tab.id
                                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Regional */}
                                <section className="space-y-6">
                                    <h3 className="text-sky-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                                        <Globe size={16} /> {t.regionalTitle}
                                    </h3>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium">{t.language}</label>
                                            <select
                                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-sky-500 appearance-none"
                                                value={settings.language}
                                                onChange={(e) => updateSettings({ language: e.target.value as Language })}
                                            >
                                                {LANGUAGE_OPTIONS.map(lang => (
                                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium">{t.nationalHolidays}</label>
                                            <select
                                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-sky-500 appearance-none"
                                                value={settings.country || ''}
                                                onChange={(e) => updateSettings({ country: e.target.value })}
                                            >
                                                <option value="">{t.none}</option>
                                                {countries.map((c) => (
                                                    <option key={c.country} value={c.country}>{c.country}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium">{t.startWeek}</label>
                                            <div className="flex gap-2">
                                                <button onClick={() => updateSettings({ weekStart: 0 })}
                                                    className={`flex-1 py-3 border rounded-xl text-sm font-medium transition-all ${settings.weekStart === 0 ? 'bg-sky-900/40 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
                                                    {t.sunday}
                                                </button>
                                                <button onClick={() => updateSettings({ weekStart: 1 })}
                                                    className={`flex-1 py-3 border rounded-xl text-sm font-medium transition-all ${settings.weekStart === 1 ? 'bg-sky-900/40 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
                                                    {t.monday}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium">Time Format</label>
                                            <div className="flex gap-2">
                                                <button onClick={() => updateSettings({ timeFormat: '12' })}
                                                    className={`flex-1 py-3 border rounded-xl text-sm font-medium transition-all ${settings.timeFormat === '12' ? 'bg-sky-900/40 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
                                                    12h
                                                </button>
                                                <button onClick={() => updateSettings({ timeFormat: '24' })}
                                                    className={`flex-1 py-3 border rounded-xl text-sm font-medium transition-all ${settings.timeFormat === '24' ? 'bg-sky-900/40 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
                                                    24h
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-700/50">
                                        <label className="text-slate-300 text-sm font-medium">Primary Calendar System</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => updateSettings({ calendarSystem: 'gregorian' })}
                                                className={`flex items-center justify-center gap-2 group p-4 border rounded-xl text-left transition-all relative overflow-hidden ${settings.calendarSystem === 'gregorian' ? 'bg-sky-500/10 border-sky-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
                                            >
                                                <div className="relative z-10 w-full">
                                                    <span className={`block text-sm font-semibold mb-1 ${settings.calendarSystem === 'gregorian' ? 'text-sky-400' : 'text-slate-200'}`}>Gregorian</span>
                                                    <span className="text-xs text-slate-500 block">Standard (Jan-Dec)</span>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => updateSettings({ calendarSystem: 'jewish' })}
                                                className={`flex items-center justify-center gap-2 group p-4 border rounded-xl text-left transition-all relative overflow-hidden ${settings.calendarSystem === 'jewish' ? 'bg-sky-500/10 border-sky-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
                                            >
                                                <div className="relative z-10 w-full">
                                                    <span className={`block text-sm font-semibold mb-1 ${settings.calendarSystem === 'jewish' ? 'text-sky-400' : 'text-slate-200'}`}>Jewish</span>
                                                    <span className="text-xs text-slate-500 block">Hebrew (Tishrei-Elul)</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-slate-300 text-sm font-medium">{t.highlightWeekends}</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'none', label: t.weekendNone },
                                                { id: 'fri', label: t.weekendFri },
                                                { id: 'sat', label: t.weekendSat },
                                                { id: 'sun', label: t.weekendSun },
                                                { id: 'fri-sat', label: t.weekendFriSat },
                                                { id: 'both', label: t.weekendBoth }
                                            ].map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => updateSettings({ highlightWeekend: opt.id as any })}
                                                    className={`py-2 px-3 border rounded-xl text-xs font-medium transition-all ${settings.highlightWeekend === opt.id ? 'bg-sky-900/40 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location Settings */}
                                    {settings.activeCalendars.includes('jewish') && (
                                        <div className="space-y-4 pt-6 mt-6 border-t border-slate-700/50 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={18} className="text-sky-400" />
                                                    <div>
                                                        <h3 className="text-slate-200 text-sm font-semibold tracking-wide">Location Settings</h3>
                                                        <p className="text-[10px] text-slate-500 font-medium">For Shabbat Candle Lighting & Havdalah</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => updateSettings({ manualLocation: !settings.manualLocation })}
                                                    dir="ltr"
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.manualLocation ? 'bg-sky-500' : 'bg-slate-700'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.manualLocation ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>

                                            <div className={`space-y-4 transition-all duration-300 ${settings.manualLocation ? 'opacity-100 scale-100' : 'opacity-40 scale-95 pointer-events-none'}`}>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">City</label>
                                                        <input
                                                            type="text"
                                                            value={settings.manualCity}
                                                            onChange={(e) => updateSettings({ manualCity: e.target.value })}
                                                            placeholder="e.g. Jerusalem"
                                                            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-sky-500 focus:bg-slate-800 transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Country</label>
                                                        <input
                                                            type="text"
                                                            value={settings.manualCountry}
                                                            onChange={(e) => updateSettings({ manualCountry: e.target.value })}
                                                            placeholder="e.g. Israel"
                                                            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-sky-500 focus:bg-slate-800 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={async () => {
                                                        setIsSearching(true);
                                                        setSearchError(null);
                                                        const result = await searchLocation(settings.manualCity, settings.manualCountry);
                                                        setIsSearching(false);
                                                        if (result) {
                                                            updateSettings({
                                                                lat: result.lat,
                                                                long: result.long,
                                                                manualLocation: true
                                                            });
                                                        } else {
                                                            setSearchError("Location not found or connection error");
                                                        }
                                                    }}
                                                    disabled={isSearching || (!settings.manualCity && !settings.manualCountry)}
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/10 active:scale-95"
                                                >
                                                    {isSearching ? <Activity size={16} className="animate-spin" /> : <Search size={16} />}
                                                    {isSearching ? 'Searching...' : 'Search Online for Coordinates'}
                                                </button>

                                                {searchError && (
                                                    <p className="text-[10px] text-rose-400 text-center font-medium animate-bounce">{searchError}</p>
                                                )}

                                                <div className="flex items-center gap-3 py-2">
                                                    <div className="h-px flex-1 bg-slate-700/50"></div>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">or manual coordinates</span>
                                                    <div className="h-px flex-1 bg-slate-700/50"></div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Latitude</label>
                                                        <input
                                                            type="number"
                                                            value={settings.lat}
                                                            onChange={(e) => updateSettings({ lat: parseFloat(e.target.value) })}
                                                            step="0.0001"
                                                            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-sky-500 focus:bg-slate-800 transition-all font-mono"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Longitude</label>
                                                        <input
                                                            type="number"
                                                            value={settings.long}
                                                            onChange={(e) => updateSettings({ long: parseFloat(e.target.value) })}
                                                            step="0.0001"
                                                            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-sky-500 focus:bg-slate-800 transition-all font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {!settings.manualLocation && (
                                                <div className="flex items-start gap-2 bg-sky-500/5 border border-sky-500/10 p-3 rounded-xl">
                                                    <Navigation size={14} className="text-sky-400 mt-0.5 shrink-0" />
                                                    <p className="text-xs text-slate-400 leading-relaxed">
                                                        Using <strong>automatic detection</strong>. If Shabbat times look incorrect for your city, toggle "Manual" above.
                                                    </p>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => {
                                                    const countryInfo = countries.find(c => c.country === settings.country);
                                                    if (countryInfo && countryInfo.lat !== undefined && countryInfo.long !== undefined) {
                                                        updateSettings({
                                                            lat: countryInfo.lat,
                                                            long: countryInfo.long,
                                                            manualLocation: true
                                                        });
                                                    }
                                                }}
                                                className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors bg-sky-500/5 hover:bg-sky-500/10 px-3 py-2 rounded-lg border border-sky-500/10 active:scale-95"
                                            >
                                                <RotateCcw size={12} /> Reset to defaults for {settings.country}
                                            </button>
                                        </div>
                                    )}

                                    {/* Calendars */}
                                    <div className="space-y-3 pt-6 border-t border-slate-700/50">
                                        <label className="text-slate-300 text-sm font-medium">{t.activeCalendars}</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { id: 'jewish', label: t.jewishCalendar },
                                                { id: 'muslim', label: t.muslimCalendar }
                                            ].map(cal => {
                                                const isActive = settings.activeCalendars.includes(cal.id);
                                                return (
                                                    <button
                                                        key={cal.id}
                                                        onClick={() => {
                                                            const newCalendars = isActive
                                                                ? settings.activeCalendars.filter(c => c !== cal.id)
                                                                : [...settings.activeCalendars, cal.id];
                                                            updateSettings({ activeCalendars: newCalendars });
                                                        }}
                                                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${isActive ? 'bg-sky-900/40 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                                    >
                                                        <span>{cal.label}</span>
                                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isActive ? 'bg-sky-500 border-sky-500' : 'border-slate-600'}`}>
                                                            {isActive && <div className="w-1.5 h-3 border-r-2 border-b-2 border-white rotate-45 -mt-0.5" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* APPEARANCE TAB */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-10 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Theme Mode */}
                                <section className="space-y-6">
                                    <h3 className="text-sky-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                                        <Palette size={16} /> {t.themeTitle}
                                    </h3>

                                    <div className={`flex gap-4 p-1 bg-slate-800/50 rounded-2xl w-fit transition-opacity duration-300 ${settings.autoTheme ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <button
                                            onClick={() => updateSettings({ theme: 'dark' })}
                                            disabled={settings.autoTheme}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${settings.theme === 'dark' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <Moon size={18} /> Dark
                                        </button>
                                        <button
                                            onClick={() => updateSettings({ theme: 'light' })}
                                            disabled={settings.autoTheme}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${settings.theme === 'light' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <Sun size={18} /> Light
                                        </button>
                                    </div>

                                    {/* Auto Theme Toggle */}
                                    <div className="bg-slate-800/20 p-5 rounded-2xl border border-slate-700/30 flex items-center justify-between group hover:border-sky-500/30 transition-all">
                                        <div className="flex gap-4">
                                            <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-200">{t.autoTheme || 'Automatic Theme'}</div>
                                                <div className="text-[10px] text-slate-500 mt-1 font-medium">
                                                    {t.autoThemeDesc || 'Switch themes at 7:00 and Sunset (requires Location)'}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateSettings({ autoTheme: !settings.autoTheme })}
                                            dir="ltr"
                                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.autoTheme ? 'bg-sky-500' : 'bg-slate-700'}`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${settings.autoTheme ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </section>

                                {/* Performance Mode (Lite) */}
                                <section className="space-y-6">
                                    <h3 className="text-sky-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                                        <Zap size={16} /> {t.performanceTitle || 'Performance'}
                                    </h3>
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-medium text-slate-200">{t.performanceLite || 'Lite Mode'}</div>
                                                <div className="text-xs text-slate-500 mt-1 max-w-sm">
                                                    {t.performanceDesc || 'Reduces visual effects (blur, animations) for smoother performance on slower devices.'}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => updateSettings({ performanceMode: settings.performanceMode === 'lite' ? 'high' : 'lite' })}
                                                dir="ltr"
                                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${settings.performanceMode === 'lite' ? 'bg-sky-500' : 'bg-slate-700'}`}
                                            >
                                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.performanceMode === 'lite' ? 'translate-x-7' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </section>

                                {/* Custom Colors */}
                                <section className="space-y-6">
                                    <h3 className="text-sky-400 font-semibold uppercase tracking-wider text-sm opacity-80">{t.appearanceCustomize}</h3>

                                    <div className="grid grid-cols-2 gap-8">
                                        {/* Dark Theme Colors */}
                                        <div className="space-y-4 p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                                            <h4 className="flex items-center gap-2 text-slate-300 font-medium pb-2 border-b border-slate-700/50 mb-2">
                                                <Moon size={14} /> {t.appearanceDark}
                                            </h4>
                                            <ColorInput
                                                label={t.appearancePrimary}
                                                value={settings.customDarkTheme?.primary || '#0ea5e9'}
                                                onChange={(val) => updateThemeColor('dark', 'primary', val)}
                                            />
                                            <ColorInput
                                                label={t.appearanceBackground}
                                                value={settings.customDarkTheme?.background || '#0f172a'}
                                                onChange={(val) => updateThemeColor('dark', 'background', val)}
                                            />
                                            <ColorInput
                                                label={t.appearanceSurface}
                                                value={settings.customDarkTheme?.surface || '#1e293b'}
                                                onChange={(val) => updateThemeColor('dark', 'surface', val)}
                                            />
                                        </div>

                                        {/* Light Theme Colors */}
                                        <div className="space-y-4 p-5 rounded-2xl bg-slate-100/5 border border-slate-700/50">
                                            <h4 className="flex items-center gap-2 text-slate-300 font-medium pb-2 border-b border-slate-700/50 mb-2">
                                                <Sun size={14} /> {t.appearanceLight}
                                            </h4>
                                            <ColorInput
                                                label={t.appearancePrimary}
                                                value={settings.customLightTheme?.primary || '#0ea5e9'}
                                                onChange={(val) => updateThemeColor('light', 'primary', val)}
                                            />
                                            <ColorInput
                                                label={t.appearanceBackground}
                                                value={settings.customLightTheme?.background || '#ffffff'}
                                                onChange={(val) => updateThemeColor('light', 'background', val)}
                                            />
                                            <ColorInput
                                                label={t.appearanceSurface}
                                                value={settings.customLightTheme?.surface || '#f8fafc'}
                                                onChange={(val) => updateThemeColor('light', 'surface', val)}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Layout */}
                                <section className="space-y-6">
                                    <h3 className="text-sky-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                                        <Layout size={16} /> {t.layoutTitle}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium">{t.dayNumSize}</label>
                                            <div className="flex gap-2">
                                                {(['sm', 'md', 'lg', 'xl'] as Size[]).map(s => (
                                                    <button key={s} onClick={() => updateSettings({ dayNumberSize: s })}
                                                        className={`flex-1 py-2 border rounded-lg uppercase text-xs font-bold ${settings.dayNumberSize === s ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}>
                                                        {t[s]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium">Primary Font Style</label>
                                            <div className="flex gap-2">
                                                {(['sans', 'serif'] as const).map(style => (
                                                    <button key={style} onClick={() => updateSettings({ primaryDayNumberStyle: style })}
                                                        className={`flex-1 py-2 border rounded-lg uppercase text-xs font-bold ${settings.primaryDayNumberStyle === style ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}>
                                                        {style}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium">Secondary Font Style</label>
                                            <div className="flex gap-2">
                                                {(['sans', 'serif'] as const).map(style => (
                                                    <button key={style} onClick={() => updateSettings({ secondaryDayNumberStyle: style })}
                                                        className={`flex-1 py-2 border rounded-lg uppercase text-xs font-bold ${settings.secondaryDayNumberStyle === style ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}>
                                                        {style}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium">{t.dayNumAlign}</label>
                                            <div className="flex gap-2">
                                                {(['left', 'center', 'right'] as Alignment[]).map(a => (
                                                    <button key={a} onClick={() => updateSettings({ dayNumberAlign: a })}
                                                        className={`flex-1 py-2 border rounded-lg uppercase text-xs font-bold ${settings.dayNumberAlign === a ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}>
                                                        {t[a]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium">{t.dayNameSize}</label>
                                            <div className="flex gap-2">
                                                {(['sm', 'md', 'lg'] as Size[]).map(s => (
                                                    <button key={s} onClick={() => updateSettings({ dayNameSize: s })}
                                                        className={`flex-1 py-2 border rounded-lg uppercase text-xs font-bold ${settings.dayNameSize === s ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}>
                                                        {t[s]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium">{t.dayNameAlign}</label>
                                            <div className="flex gap-2">
                                                {(['left', 'center', 'right'] as Alignment[]).map(a => (
                                                    <button key={a} onClick={() => updateSettings({ dayNameAlign: a })}
                                                        className={`flex-1 py-2 border rounded-lg uppercase text-xs font-bold ${settings.dayNameAlign === a ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}>
                                                        {t[a]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* MEDIA TAB */}
                        {activeTab === 'media' && (
                            <div className="space-y-10 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                                <section className="space-y-6">
                                    <h3 className="text-sky-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                                        <ImageIcon size={16} /> {t.mediaTitle}
                                    </h3>

                                    {/* Source Type */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => updateSettings({ imageSource: 'category' })}
                                            className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${settings.imageSource === 'category' ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                        >
                                            <ImageIcon size={32} />
                                            <span className="font-medium">{t.imgSourceCategory}</span>
                                        </button>
                                        <button
                                            onClick={() => updateSettings({ imageSource: 'local' })}
                                            className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${settings.imageSource === 'local' ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                        >
                                            <Folder size={32} />
                                            <span className="font-medium">{t.imgSourceLocal}</span>
                                        </button>
                                    </div>

                                    {/* Conditional Input */}
                                    {settings.imageSource === 'category' ? (
                                        <div className="space-y-3 animate-in fade-in zoom-in-95">
                                            <label className="text-slate-300 text-sm font-medium">{t.mediaMultiSelect}</label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {IMAGE_CATEGORIES.map(cat => {
                                                    const isSelected = settings.imageCategories?.includes(cat);
                                                    return (
                                                        <button
                                                            key={cat}
                                                            onClick={() => {
                                                                const current = settings.imageCategories || [];
                                                                const newCats = isSelected
                                                                    ? current.filter(c => c !== cat)
                                                                    : [...current, cat];
                                                                updateSettings({ imageCategories: newCats });
                                                            }}
                                                            className={`px-3 py-2 rounded-lg text-sm text-left truncate transition-all ${isSelected ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                                        >
                                                            {cat}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 animate-in fade-in zoom-in-95">
                                            <label className="text-slate-300 text-sm font-medium">{t.mediaLocalPath}</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={settings.localImagePath || ''}
                                                    onChange={(e) => updateSettings({ localImagePath: e.target.value })}
                                                    placeholder="pictures/my-images..."
                                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-slate-200 outline-none focus:border-sky-500"
                                                />
                                                <Folder className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                {t.mediaNote}
                                            </p>
                                        </div>
                                    )}
                                </section>

                                {/* Frequency Slider */}
                                <section className="space-y-6">
                                    <h3 className="text-sky-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                                        <Clock size={16} /> {t.mediaFrequency}
                                    </h3>

                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-slate-300 font-medium">{t.mediaInterval}</label>
                                            <span className="text-2xl font-bold text-sky-400 font-mono">
                                                {formatDuration(settings.imageChangeFrequency || 3600000)}
                                            </span>
                                        </div>

                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={freqToSlider(settings.imageChangeFrequency || 3600000)}
                                            onChange={(e) => updateSettings({ imageChangeFrequency: sliderToFreq(parseFloat(e.target.value)) })}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400 transition-all"
                                        />

                                        <div className="flex justify-between text-xs text-slate-500 font-mono">
                                            <span>30s</span>
                                            <span>1h</span>
                                            <span>1d</span>
                                            <span>1y</span>
                                            <span>10y</span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
