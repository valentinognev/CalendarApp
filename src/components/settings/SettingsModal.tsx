import React, { useState, useEffect } from 'react';
import { useAppStore, type Language, type Size, type Alignment, IMAGE_CATEGORIES, type CustomTheme } from '../../store/AppContext';
import { X, Moon, Sun, Globe, Layout, Palette, Image as ImageIcon, Folder, Clock } from 'lucide-react';

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
                                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-sky-500"
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
                                    </div>

                                    {/* Calendars */}
                                    <div className="space-y-3">
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

                                    <div className="flex gap-4 p-1 bg-slate-800/50 rounded-2xl w-fit">
                                        <button
                                            onClick={() => updateSettings({ theme: 'dark' })}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${settings.theme === 'dark' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <Moon size={18} /> Dark
                                        </button>
                                        <button
                                            onClick={() => updateSettings({ theme: 'light' })}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${settings.theme === 'light' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <Sun size={18} /> Light
                                        </button>
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
                                                    placeholder="/home/user/pictures..."
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
