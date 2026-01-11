import React, { useState } from 'react';
import { AppProvider, useAppStore } from './store/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { CalendarWidget } from './components/widgets/CalendarWidget';
import { ClockWidget } from './components/widgets/ClockWidget';
import { MediaPanel } from './components/widgets/MediaPanel';
import { SettingsModal } from './components/settings/SettingsModal';
import { Calendar as CalIcon, Columns, Settings, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { enUS, ru, he } from 'date-fns/locale';

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
              className="p-2 rounded-full hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors"
            >
              <ChevronLeft size={28} />
            </button>

            <div
              className="cursor-pointer hover:scale-105 transition-transform text-center"
              onClick={jumpToToday}
              title="Jump to Today"
            >
              <h2 className="text-7xl font-bold text-text-main capitalize tracking-tight min-w-[300px]">
                {headerTitle}
              </h2>
            </div>

            <button
              onClick={() => navigate('next')}
              className="p-2 rounded-full hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors"
            >
              <ChevronRight size={28} />
            </button>
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
