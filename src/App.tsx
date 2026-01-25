import React, { useState } from 'react';
import { AppProvider, useAppStore } from './store/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { CalendarWidget } from './components/widgets/CalendarWidget';
import { ClockWidget } from './components/widgets/ClockWidget';
import { MediaPanel } from './components/widgets/MediaPanel';
import { SettingsModal } from './components/settings/SettingsModal';
import { Calendar as CalIcon, Settings, ChevronLeft, ChevronRight, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { getLocale } from './utils/dateLocales';
import { getTranslations } from './utils/translations';
import { HDate } from '@hebcal/core';

const DashboardContent: React.FC = () => {
  const { viewMode, toggleView, toggleSplit, isSplit, currentDate, navigate, jumpToToday, settings } = useAppStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentLocale = getLocale(settings.language);
  const t = getTranslations(settings.language);

  const headerTitle = format(currentDate, viewMode === 'month' ? 'LLLL yyyy' : "'Week of' MMM d, yyyy", { locale: currentLocale });

  // --- Secondary Calendar Subtitles ---
  const activeSubtitles: string[] = [];

  // 1. Jewish Calendar
  if (settings.activeCalendars.includes('jewish')) {
    // Determine range based on view
    const weekStartParams = { weekStartsOn: settings.weekStart as 0 | 1, locale: currentLocale };
    const startDate = viewMode === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate, weekStartParams);
    const endDate = viewMode === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate, weekStartParams);

    const hStart = new HDate(startDate);
    const hEnd = new HDate(endDate);

    const JEWISH_MONTHS_RU: Record<string, string> = {
      'Nisan': 'Нисан',
      'Iyyar': 'Ияр',
      'Sivan': 'Сиван',
      'Tamuz': 'Таммуз',
      'Av': 'Ав',
      'Elul': 'Элуль',
      'Tishrei': 'Тишрей',
      'Cheshvan': 'Хешван',
      'Kislev': 'Кислев',
      'Tevet': 'Тевет',
      'Sh\'vat': 'Шват',
      'Adar': 'Адар',
      'Adar I': 'Адар I',
      'Adar II': 'Адар II'
    };

    // Helper to get formatted month/year for Jewish
    const getHString = (h: HDate) => {
      if (settings.language === 'he') {
        const parts = h.renderGematriya(true).split(' ');
        return {
          month: parts.slice(1, -1).join(' '),
          year: parts.slice(-1)[0],
          full: parts.slice(1).join(' ')
        };
      } else if (settings.language === 'ru') {
        const monthName = h.getMonthName();
        const translatedMonth = JEWISH_MONTHS_RU[monthName] || monthName;
        return {
          month: translatedMonth,
          year: h.getFullYear().toString(),
          full: `${translatedMonth} ${h.getFullYear()}`
        };
      } else {
        return {
          month: h.getMonthName(),
          year: h.getFullYear().toString(),
          full: `${h.getMonthName()} ${h.getFullYear()}`
        };
      }
    };

    const startObj = getHString(hStart);
    const endObj = getHString(hEnd);

    let jStr = '';
    if (startObj.full === endObj.full) {
      jStr = startObj.full;
    } else if (startObj.year === endObj.year) {
      jStr = `${startObj.month} - ${endObj.full}`;
    } else {
      jStr = `${startObj.full} - ${endObj.full}`;
    }
    activeSubtitles.push(jStr);
  }

  // 2. Muslim Calendar
  if (settings.activeCalendars.includes('muslim')) {
    // We can use Intl for Hijri (Umm al-Qura)
    // Note: This relies on browser support for 'islamic-umalqura'
    const hijriFormatter = new Intl.DateTimeFormat(`${settings.language}-u-ca-islamic-umalqura`, {
      month: 'long',
      year: 'numeric'
    });

    const startDate = viewMode === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate);
    const endDate = viewMode === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate);

    // Get string for start and end
    // Format usually: "Ramadan 1447 AH"
    // We just want "Ramadan 1447"
    const formatHijri = (d: Date) => {
      const parts = hijriFormatter.formatToParts(d);
      const month = parts.find(p => p.type === 'month')?.value || '';
      const year = parts.find(p => p.type === 'year')?.value || '';
      return { month, year, full: `${month} ${year}` };
    };

    const hStart = formatHijri(startDate);
    const hEnd = formatHijri(endDate);

    let mStr = '';
    if (hStart.full === hEnd.full) {
      mStr = hStart.full;
    } else if (hStart.year === hEnd.year) {
      mStr = `${hStart.month} - ${hEnd.full}`;
    } else {
      mStr = `${hStart.full} - ${hEnd.full}`;
    }
    activeSubtitles.push(mStr);
  }

  const CalendarSection = (
    <>
      {/* Main Header */}
      <header className="relative flex items-end justify-between mb-4 pb-2">

        {/* LEFT: Clock */}
        <div className="z-10">
          <ClockWidget />
        </div>

        {/* CENTER: Navigation & Title (Absolute Centered) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-4">

            <button
              onClick={() => navigate('prev')}
              className="p-3 rounded-full hover:bg-surface-hover text-text-muted hover:text-text-main transition-all active:scale-90"
            >
              {settings.language === 'he' ? <ChevronRight size={32} /> : <ChevronLeft size={32} />}
            </button>

            <div
              className="cursor-pointer hover:scale-105 transition-transform text-center flex flex-col items-center group relative px-4"
              onClick={jumpToToday}
              title="Jump to Today"
            >
              <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-bold text-text-main capitalize tracking-tighter min-w-[max-content] leading-none drop-shadow-2xl">
                {headerTitle}
              </h2>
              {activeSubtitles.length > 0 && (
                <span className="text-[clamp(1rem,2vw,1.5rem)] font-light text-primary mt-2 opacity-80 flex gap-3 tracking-wide whitespace-nowrap">
                  {activeSubtitles.map((sub, i) => (
                    <React.Fragment key={i}>
                      <span>{sub}</span>
                      {i < activeSubtitles.length - 1 && <span className="opacity-50">|</span>}
                    </React.Fragment>
                  ))}
                </span>
              )}
            </div>

            <button
              onClick={() => navigate('next')}
              className="p-3 rounded-full hover:bg-surface-hover text-text-muted hover:text-text-main transition-all active:scale-90"
            >
              {settings.language === 'he' ? <ChevronLeft size={32} /> : <ChevronRight size={32} />}
            </button>

            {/* Reset / Jump to Today Button (Visible only if not current month) */}
            {!isSameMonth(currentDate, new Date()) && (
              <button
                onClick={jumpToToday}
                className="absolute -bottom-12 p-2 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:bg-primary/90 transition-all animate-in fade-in zoom-in hover:scale-110 active:scale-95"
                title="Back to Today"
              >
                <RotateCcw size={20} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex gap-3 z-10">
          {/* Settings Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center p-3 rounded-xl glass text-text-muted hover:text-text-main hover:bg-surface-hover transition-all active:scale-95"
            title="Settings"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={toggleView}
            className="flex items-center gap-2 px-4 py-3 rounded-xl glass text-text-main font-semibold hover:bg-surface-hover hover:border-primary/50 transition-all active:scale-95"
          >
            <CalIcon size={20} />
            <span>{viewMode === 'month' ? t.monthView : t.weekView}</span>
          </button>

          <button
            onClick={toggleSplit}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl glass font-semibold transition-all active:scale-95 relative
              ${isSplit
                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_var(--color-primary-glow)]'
                : 'text-text-main hover:bg-surface-hover'}
            `}
          >
            <ImageIcon size={20} />
            <span>{t.splitView}</span>
            <span className="absolute -top-2 -right-2 bg-surface border border-border text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md uppercase tracking-wider text-text-muted flex items-center gap-1">
              <span>{settings.language}</span>
              {settings.country && (
                <>
                  <span className="opacity-50">|</span>
                  <span>{settings.country.substring(0, 3)}</span>
                </>
              )}
            </span>
          </button>
        </div>
      </header>

      <CalendarWidget />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );

  return (
    <AppLayout
      calendar={CalendarSection}
      media={<MediaPanel />}
    />
  );
};

function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}

export default App;
