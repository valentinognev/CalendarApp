export interface CalendarDateInfo {
    date: Date; // The underlying Gregorian date (Start of day)
    primaryLabel: string; // "14", "טו", "1 Ramadan"
    secondaryLabel: string; // "14", "Feb 28", "15 Adar"
    isPrimaryMonth: boolean; // Is it part of the main month view?
    isToday: boolean;
}

export interface CalendarTitle {
    primary: string; // "Tishrei 5786"
    secondary: string; // "September - October 2025"
}

export interface CalendarStrategy {
    id: string; // 'gregorian' | 'jewish' | ...

    // Get the title for the header
    getTitle(date: Date, locale: string): CalendarTitle;

    // Get the grid days (including padding)
    getGridDays(date: Date, weekStart: 0 | 1, locale: string): CalendarDateInfo[];

    // Navigation
    navigate(date: Date, direction: 'prev' | 'next'): Date;

    // Reset
    jumpToToday(): Date;

    // Formatting for Clock/Status
    formatDate(date: Date, locale: string): string;
}
