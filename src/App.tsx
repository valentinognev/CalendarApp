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
import { CalendarStrategyFactory } from './services/calendar/CalendarStrategyFactory';

const DashboardContent: React.FC = () => {
  const { viewMode, toggleView, toggleSplit, isSplit, currentDate, navigate, jumpToToday, settings } = useAppStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentLocale = getLocale(settings.language);
  const t = getTranslations(settings.language);

  const strategy = CalendarStrategyFactory.getStrategy(settings.calendarSystem);
  const titleData = strategy.getTitle(currentDate, settings.language);
  const headerTitle = titleData.primary;

  // --- Secondary Calendar Subtitles ---
  const activeSubtitles: string[] = [];

  // Strategy Secondary Title (e.g. Gregorian range on Jewish view)
  if (titleData.secondary) {
    activeSubtitles.push(titleData.secondary);
  }

  // --- Subtitles Generation ---
  // The goal: Show all enabled calendars EXCEPT the one used as "Primary"

  // 1. Gregorian Subtitle (if NOT primary)
  if (settings.calendarSystem !== 'gregorian') {
    const locale = currentLocale;
    const startDate = viewMode === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate, { weekStartsOn: settings.weekStart as 0 | 1, locale });
    const endDate = viewMode === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate, { weekStartsOn: settings.weekStart as 0 | 1, locale });

    const fStart = format(startDate, 'LLLL', { locale });
    if (isSameMonth(startDate, endDate)) {
      activeSubtitles.push(format(startDate, 'LLLL yyyy', { locale }));
    } else if (startDate.getFullYear() !== endDate.getFullYear()) {
      activeSubtitles.push(`${format(startDate, 'LLLL yyyy', { locale })} - ${format(endDate, 'LLLL yyyy', { locale })}`);
    } else {
      activeSubtitles.push(`${fStart} - ${format(endDate, 'LLLL yyyy', { locale })}`);
    }
  }

  // 2. Jewish Calendar (Only if enabled AND NOT primary)
  if (settings.activeCalendars.includes('jewish') && settings.calendarSystem !== 'jewish') {
    const weekStartParams = { weekStartsOn: settings.weekStart as 0 | 1, locale: currentLocale };
    const startDate = viewMode === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate, weekStartParams);
    const endDate = viewMode === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate, weekStartParams);

    const hStart = new HDate(startDate);
    const hEnd = new HDate(endDate);

    const JEWISH_MONTHS_RU: Record<string, string> = {
      'Nisan': 'Нисан', 'Iyyar': 'Ияр', 'Sivan': 'Сиван', 'Tamuz': 'Таммуз',
      'Av': 'Ав', 'Elul': 'Элуль', 'Tishrei': 'Тишрей', 'Cheshvan': 'Хешван',
      'Kislev': 'Кислев', 'Tevet': 'Тевет', 'Sh\'vat': 'Шват', 'Adar': 'Адар',
      'Adar I': 'Адар I', 'Adar II': 'Адар II'
    };

    const getHString = (h: HDate) => {
      if (settings.language === 'he') {
        const parts = h.renderGematriya(true).split(' ');
        return { month: parts.slice(1, -1).join(' '), year: parts.slice(-1)[0], full: parts.slice(1).join(' ') };
      } else {
        const monthName = h.getMonthName();
        const translatedMonth = settings.language === 'ru' ? JEWISH_MONTHS_RU[monthName] || monthName : monthName;
        return { month: translatedMonth, year: h.getFullYear().toString(), full: `${translatedMonth} ${h.getFullYear()}` };
      }
    };

    const startObj = getHString(hStart);
    const endObj = getHString(hEnd);
    if (startObj.full === endObj.full) {
      activeSubtitles.push(startObj.full);
    } else if (startObj.year === endObj.year) {
      activeSubtitles.push(`${startObj.month} - ${endObj.full}`);
    } else {
      activeSubtitles.push(`${startObj.full} - ${endObj.full}`);
    }
  }

  // 3. Muslim Calendar (Only if enabled AND NOT primary)
  if (settings.activeCalendars.includes('muslim') && settings.calendarSystem !== 'muslim') {
    const hijriFormatter = new Intl.DateTimeFormat(`${settings.language}-u-ca-islamic-umalqura`, {
      month: 'long',
      year: 'numeric'
    });
    const startDate = viewMode === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate);
    const endDate = viewMode === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate);

    const formatHijri = (d: Date) => {
      const parts = hijriFormatter.formatToParts(d);
      const month = parts.find(p => p.type === 'month')?.value || '';
      const year = parts.find(p => p.type === 'year')?.value || '';
      return { month, year, full: `${month} ${year}` };
    };

    const hStart = formatHijri(startDate);
    const hEnd = formatHijri(endDate);
    if (hStart.full === hEnd.full) {
      activeSubtitles.push(hStart.full);
    } else if (hStart.year === hEnd.year) {
      activeSubtitles.push(`${hStart.month} - ${hEnd.full}`);
    } else {
      activeSubtitles.push(`${hStart.full} - ${hEnd.full}`);
    }
  }

  const CalendarSection = (
    <>
      {/* Main Header */}
      <header className="relative flex items-end justify-between mb-4 pb-2 flex-none">

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
              <h2 className="text-[clamp(1.5rem,5vw,3rem)] font-bold text-text-main capitalize tracking-tighter min-w-[max-content] leading-none drop-shadow-2xl">
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
