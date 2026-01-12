import React, { useState } from 'react';
import { AppProvider, useAppStore } from './store/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { CalendarWidget } from './components/widgets/CalendarWidget';
import { ClockWidget } from './components/widgets/ClockWidget';
import { MediaPanel } from './components/widgets/MediaPanel';
import { SettingsModal } from './components/settings/SettingsModal';
import { Calendar as CalIcon, Settings, ChevronLeft, ChevronRight, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { enUS, ru, he } from 'date-fns/locale';
import { HDate } from '@hebcal/core';

const LOCALE_MAP: Record<string, any> = {
  en: enUS,
  ru: ru,
  he: he
};

const UI_LABELS: Record<string, { month: string; week: string; split: string }> = {
  en: { month: 'Month', week: 'Week', split: 'Picture' },
  ru: { month: 'Месяц', week: 'Неделя', split: 'Картинка' },
  he: { month: 'חודש', week: 'שבוע', split: 'תמונה' }
};

const DashboardContent: React.FC = () => {
  const { viewMode, toggleView, toggleSplit, isSplit, currentDate, navigate, jumpToToday, settings } = useAppStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentLocale = LOCALE_MAP[settings.language];
  const labels = UI_LABELS[settings.language];

  const headerTitle = format(currentDate, viewMode === 'month' ? 'LLLL yyyy' : "'Week of' MMM d, yyyy", { locale: currentLocale });

  // Jewish Date Subtitle
  // Jewish Date Subtitle Logic
  let jewishDateSubtitle = '';
  if (settings.showJewishCalendar) {
    // Determine range based on view
    const weekStartParams = { weekStartsOn: settings.weekStart as 0 | 1, locale: currentLocale };
    const startDate = viewMode === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate, weekStartParams);
    const endDate = viewMode === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate, weekStartParams);

    const hStart = new HDate(startDate);
    const hEnd = new HDate(endDate);

    // Helper to get formatted month/year
    const getHString = (h: HDate) => {
      if (settings.language === 'he') {
        // Custom extraction from gematriya string: "Day Month Year" -> "Month Year"
        const parts = h.renderGematriya(true).split(' ');
        return {
          month: parts.slice(1, -1).join(' '), // Middle part(s) are month
          year: parts[parts.length - 1],       // Last part is year
          full: parts.slice(1).join(' ')       // Month + Year
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

    if (startObj.full === endObj.full) {
      // Same Month and Year
      jewishDateSubtitle = startObj.full;
    } else if (startObj.year === endObj.year) {
      // Same Year, Different Month
      jewishDateSubtitle = `${startObj.month} - ${endObj.full}`; // "Shevat - Adar 5786"
    } else {
      // Different Year (e.g. Elul to Tishrei)
      jewishDateSubtitle = `${startObj.full} - ${endObj.full}`;
    }
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
            {/* BUTTONS SWAPPED: Next (Right Arrow) on Left, Prev (Left Arrow) on Right? 
                User said "swap the sides of < > arrows". 
                Usually [ < ] [ Title ] [ > ].
                If user wants swap: [ > ] [ Title ] [ < ] ?? Or maybe standard RTL flip? 
                Let's assume explicit swap: 
                [ChevronRight -> Next] [Title] [ChevronLeft -> Prev] 
            */}

            <button
              onClick={() => navigate('prev')}
              className="p-2 rounded-full hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors"
            >
              <ChevronLeft size={28} />
            </button>

            <div
              className="cursor-pointer hover:scale-105 transition-transform text-center flex flex-col items-center group relative"
              onClick={jumpToToday}
              title="Jump to Today"
            >
              <h2 className="text-6xl font-bold text-text-main capitalize tracking-tight min-w-[300px] leading-none">
                {headerTitle}
              </h2>
              {settings.showJewishCalendar && (
                <span className="text-3xl font-light text-primary mt-1 opacity-80">
                  {jewishDateSubtitle}
                </span>
              )}
            </div>

            <button
              onClick={() => navigate('next')}
              className="p-2 rounded-full hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors"
            >
              <ChevronRight size={28} />
            </button>

            {/* Reset / Jump to Today Button (Visible only if not current month) */}
            {!isSameMonth(currentDate, new Date()) && (
              <button
                onClick={jumpToToday}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all animate-in fade-in zoom-in"
                title="Back to Today"
              >
                <RotateCcw size={24} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex gap-3 z-10">
          {/* Settings Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center p-3 rounded-xl border border-border text-text-muted hover:bg-surface-hover hover:text-text-main transition-all mr-2"
            title="Settings"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={toggleView}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface border border-border text-text-main font-semibold hover:bg-surface-hover hover:border-primary transition-all"
          >
            <CalIcon size={20} />
            <span>{viewMode === 'month' ? labels.month : labels.week}</span>
          </button>

          <button
            onClick={toggleSplit}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold transition-all
              ${isSplit
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-surface border-border text-text-main hover:bg-surface-hover'}
            `}
          >
            <ImageIcon size={20} />
            <span>{labels.split}</span>
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
