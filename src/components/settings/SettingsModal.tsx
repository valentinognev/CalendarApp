import React from 'react';
import { useAppStore, type Language, type WeekendMode, type Size, type Alignment } from '../../store/AppContext';
import { X, Moon, Sun, Globe, Layout, Palette } from 'lucide-react';

const TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        title: 'Settings',
        themeTitle: 'Theme & Appearance',
        colorTheme: 'Color Theme',
        dark: 'Dark',
        light: 'Light',
        highlightWeekends: 'Highlight Weekends',
        weekendNone: 'None',
        weekendSat: 'Saturday',
        weekendSun: 'Sunday',
        weekendFri: 'Friday',
        weekendFriSat: 'Friday & Saturday',
        weekendBoth: 'Both (Sat & Sun)',
        regionalTitle: 'Regional',
        language: 'Language',
        startWeek: 'Start Week On',
        sunday: 'Sunday',
        monday: 'Monday',
        jewishCalendar: 'Jewish Calendar',
        enabled: 'Enabled',
        disabled: 'Disabled',
        layoutTitle: 'Layout Details',
        dayNumSize: 'Day Number Size',
        dayNumAlign: 'Day Number Align',
        dayNameSize: 'Day Name Size',
        dayNameAlign: 'Day Name Align',
        left: 'Left',
        center: 'Center',
        right: 'Right',
        sm: 'S',
        md: 'M',
        lg: 'L',
        xl: 'XL'
    },
    ru: {
        title: 'Настройки',
        themeTitle: 'Тема и Оформление',
        colorTheme: 'Цветовая тема',
        dark: 'Тёмная',
        light: 'Светлая',
        highlightWeekends: 'Подсветка выходных',
        weekendNone: 'Нет',
        weekendSat: 'Суббота',
        weekendSun: 'Воскресенье',
        weekendFri: 'Пятница',
        weekendFriSat: 'Пт & Сб',
        weekendBoth: 'Оба (Сб & Вс)',
        regionalTitle: 'Региональные',
        language: 'Язык',
        startWeek: 'Начало недели',
        sunday: 'Воскресенье',
        monday: 'Понедельник',
        jewishCalendar: 'Еврейский календарь',
        enabled: 'Включен',
        disabled: 'Выключен',
        layoutTitle: 'Детали макета',
        dayNumSize: 'Размер номера дня',
        dayNumAlign: 'Выравнивание номера',
        dayNameSize: 'Размер названия дня',
        dayNameAlign: 'Выравнивание названия',
        left: 'Слева',
        center: 'Центр',
        right: 'Справа',
        sm: 'S',
        md: 'M',
        lg: 'L',
        xl: 'XL'
    },
    he: {
        title: 'הגדרות',
        themeTitle: 'ערכת נושא ומראה',
        colorTheme: 'ערכת צבעים',
        dark: 'כהה',
        light: 'בהירה',
        highlightWeekends: 'הדגשת סוף שבוע',
        weekendNone: 'ללא',
        weekendSat: 'שבת',
        weekendSun: 'ראשון',
        weekendFri: 'שישי',
        weekendFriSat: 'שישי ושבת',
        weekendBoth: 'שניהם (שבת וראשון)',
        regionalTitle: 'אזוריות',
        language: 'שפה',
        startWeek: 'תחילת שבוע',
        sunday: 'ראשון',
        monday: 'שני',
        jewishCalendar: 'לוח שנה עברי',
        enabled: 'מופעל',
        disabled: 'כבוי',
        layoutTitle: 'פרטי תצוגה',
        dayNumSize: 'גודל מספר יום',
        dayNumAlign: 'יישור מספר יום',
        dayNameSize: 'גודל שם יום',
        dayNameAlign: 'יישור שם יום',
        left: 'שמאל',
        center: 'מרכז',
        right: 'ימין',
        sm: 'S',
        md: 'M',
        lg: 'L',
        xl: 'XL'
    }
};

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LANGUAGE_OPTIONS = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'bn', name: 'Bengali (বাংলা)' },
    { code: 'pt', name: 'Portuguese (Português)' },
    { code: 'ru', name: 'Russian (Русский)' },
    { code: 'ur', name: 'Urdu (اردو)' },
    { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'sw', name: 'Swahili (Kiswahili)' },
    { code: 'mr', name: 'Marathi (मराठी)' },
    { code: 'te', name: 'Telugu (తెలుగు)' },
    { code: 'tr', name: 'Turkish (Türkçe)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
    { code: 'ko', name: 'Korean (한국어)' },
    { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
    { code: 'it', name: 'Italian (Italiano)' },
    { code: 'th', name: 'Thai (ไทย)' },
    { code: 'fa', name: 'Persian (فارسی)' },
    { code: 'pl', name: 'Polish (Polski)' },
    { code: 'uk', name: 'Ukrainian (Українська)' },
    { code: 'ro', name: 'Romanian (Română)' },
    { code: 'nl', name: 'Dutch (Nederlands)' },
    { code: 'el', name: 'Greek (Ελληνικά)' },
    { code: 'hu', name: 'Hungarian (Magyar)' },
    { code: 'sv', name: 'Swedish (Svenska)' },
    { code: 'cs', name: 'Czech (Čeština)' },
    { code: 'da', name: 'Danish (Dansk)' },
    { code: 'fi', name: 'Finnish (Suomi)' },
    { code: 'he', name: 'Hebrew (עברית)' },
    { code: 'no', name: 'Norwegian (Norsk)' },
    { code: 'sk', name: 'Slovak (Slovenčina)' },
    { code: 'hr', name: 'Croatian (Hrvatski)' },
    { code: 'bg', name: 'Bulgarian (Български)' },
    { code: 'sl', name: 'Slovenian (Slovenščina)' },
    { code: 'lt', name: 'Lithuanian (Lietuvių)' },
    { code: 'lv', name: 'Latvian (Latviešu)' },
    { code: 'et', name: 'Estonian (Eesti)' },
    { code: 'sr', name: 'Serbian (Српски)' },
    { code: 'ca', name: 'Catalan (Català)' },
    { code: 'ms', name: 'Malay (Bahasa Melayu)' },
    { code: 'fil', name: 'Filipino (Filipino)' },
    { code: 'am', name: 'Amharic (አማርኛ)' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { settings, updateSettings } = useAppStore();
    // Fallback to English for UI if translation not available
    const t = TRANSLATIONS[settings.language] || TRANSLATIONS['en'];

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
                    <h2 className="text-2xl font-light text-white">{t.title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto p-8 space-y-10 custom-scrollbar">

                    {/* Section: Appearance */}
                    <section>
                        <h3 className="flex items-center gap-2 text-sky-400 font-semibold uppercase tracking-wider text-sm mb-6">
                            <Palette size={16} /> {t.themeTitle}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Theme */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">{t.colorTheme}</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateSettings({ theme: 'dark' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${settings.theme === 'dark' ? 'bg-slate-800 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                    >
                                        <Moon size={18} /> {t.dark}
                                    </button>
                                    <button
                                        onClick={() => updateSettings({ theme: 'light' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${settings.theme === 'light' ? 'bg-slate-100 border-sky-500 text-sky-600' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                    >
                                        <Sun size={18} /> {t.light}
                                    </button>
                                </div>
                            </div>

                            {/* Weekend Highlight */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">{t.highlightWeekends}</label>
                                <select
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-sky-500 appearance-none"
                                    value={settings.highlightWeekend}
                                    onChange={(e) => updateSettings({ highlightWeekend: e.target.value as WeekendMode })}
                                >
                                    <option value="none">{t.weekendNone}</option>
                                    <option value="sat">{t.weekendSat}</option>
                                    <option value="sun">{t.weekendSun}</option>
                                    <option value="fri">{t.weekendFri}</option>
                                    <option value="fri-sat">{t.weekendFriSat}</option>
                                    <option value="both">{t.weekendBoth}</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section: Regional */}
                    <section>
                        <h3 className="flex items-center gap-2 text-sky-400 font-semibold uppercase tracking-wider text-sm mb-6">
                            <Globe size={16} /> {t.regionalTitle}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Language */}
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

                            {/* Start of Week */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">{t.startWeek}</label>
                                <div className="flex bg-slate-800 p-1 rounded-xl">
                                    <button
                                        onClick={() => updateSettings({ weekStart: 0 })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${settings.weekStart === 0 ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        {t.sunday}
                                    </button>
                                    <button
                                        onClick={() => updateSettings({ weekStart: 1 })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${settings.weekStart === 1 ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        {t.monday}
                                    </button>
                                </div>
                            </div>

                            {/* Calendars */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">Calendars</label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'jewish', label: t.jewishCalendar || 'Jewish Calendar' },
                                        { id: 'muslim', label: 'Muslim (Hijri) Calendar' }
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
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${isActive ? 'bg-sky-900/40 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
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
                        </div>
                    </section>

                    {/* Section: Layout Detail */}
                    <section>
                        <h3 className="flex items-center gap-2 text-sky-400 font-semibold uppercase tracking-wider text-sm mb-6">
                            <Layout size={16} /> {t.layoutTitle}
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Number Size */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">{t.dayNumSize}</label>
                                <div className="flex gap-2">
                                    {(['sm', 'md', 'lg', 'xl'] as Size[]).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateSettings({ dayNumberSize: s })}
                                            className={`flex-1 py-2 border rounded-lg uppercase text-xs font-bold ${settings.dayNumberSize === s ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}
                                        >
                                            {t[s]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Number Align */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">{t.dayNumAlign}</label>
                                <div className="flex gap-2">
                                    {(['left', 'center', 'right'] as Alignment[]).map(a => (
                                        <button
                                            key={a}
                                            onClick={() => updateSettings({ dayNumberAlign: a })}
                                            className={`flex-1 py-2 border rounded-lg text-xs font-bold capitalize ${settings.dayNumberAlign === a ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}
                                        >
                                            {t[a]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name Size */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">{t.dayNameSize}</label>
                                <div className="flex gap-2">
                                    {(['sm', 'md', 'lg'] as Size[]).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateSettings({ dayNameSize: s })}
                                            className={`flex-1 py-2 border rounded-lg uppercase text-xs font-bold ${settings.dayNameSize === s ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}
                                        >
                                            {t[s]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name Align */}
                            <div className="space-y-3">
                                <label className="text-slate-300 text-sm font-medium">{t.dayNameAlign}</label>
                                <div className="flex gap-2">
                                    {(['left', 'center', 'right'] as Alignment[]).map(a => (
                                        <button
                                            key={a}
                                            onClick={() => updateSettings({ dayNameAlign: a })}
                                            className={`flex-1 py-2 border rounded-lg text-xs font-bold capitalize ${settings.dayNameAlign === a ? 'bg-sky-900 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-500'}`}
                                        >
                                            {t[a]}
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
