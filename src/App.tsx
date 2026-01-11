import React from 'react';
import { AppProvider, useAppStore } from './store/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { CalendarWidget } from './components/widgets/CalendarWidget';
import { ClockWidget } from './components/widgets/ClockWidget';
import { MediaPanel } from './components/widgets/MediaPanel';
import { Calendar as CalIcon, Columns } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { viewMode, toggleView, toggleSplit, isSplit } = useAppStore();

  const CalendarSection = (
    <>
      <header className="flex justify-between items-end mb-4 border-b border-slate-700 pb-4">
        <ClockWidget />

        <div className="flex gap-3">
          <button
            onClick={toggleView}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold hover:bg-slate-700 hover:border-sky-500 transition-all"
          >
            <CalIcon size={20} />
            <span>{viewMode === 'month' ? 'Month' : 'Week'}</span>
          </button>

          <button
            onClick={toggleSplit}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold transition-all
              ${isSplit
                ? 'bg-sky-900/20 border-sky-500 text-sky-400'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'}
            `}
          >
            <Columns size={20} />
            <span>Split</span>
          </button>
        </div>
      </header>

      <CalendarWidget />
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
