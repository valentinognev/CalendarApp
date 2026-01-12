# Calendar App - Project Status & Guide

**Last Updated:** January 12, 2026
**Current State:** Functional MVP with advanced localization and Jewish calendar integration.

## 📖 Overview
This is a modern, responsive Calendar application built with **React** and **TypeScript**. It features a "Premium Wall Dashboard" aesthetic and is specifically tailored to support:
- **Gregorian & Jewish Calendars** side-by-side.
- **Multi-language support** (English, Russian, Hebrew) with full RTL/LTR layouts.
- **CSV-based External Configuration** for Jewish holidays (Source of Truth).
- **Custom Event Management** with recurrence.

## 🛠 Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS (custom variables for theming) + Lucide React (Icons)
- **State Management**: React Context + `useReducer`/custom hooks (`AppContext.tsx`)
- **Date Handling**:
  - `date-fns` for Gregorian dates.
  - `@hebcal/core` for Jewish date calculations and conversion.

## 🌟 Key Features & Implementation Details

### 1. Jewish Calendar System (CRITICAL)
The application uses a hybrid approach for Jewish holidays:
- **Calculation**: `@hebcal/core` converts Gregorian dates to Jewish dates (Day/Month/Year).
- **Data Source (Source of Truth)**: `public/SpecialDays/JewishSpecialDays.csv`
- **Logic**: 
  - On app load, `JewishHolidayService` fetches and parses this CSV.
  - The `CalendarWidget` checks this CSV data *first* for every date.
  - If a date matches a generic holiday in the CSV (e.g., 15 Nisan), the CSV provides the localized name (`NameRu`, `NameEn`, `NameHe`) and metadata (Official status, fast day, etc.).
  - **IMPORTANT**: Do not hardcode holiday names in the code. Edit the CSV file to change names or add new holidays.

### 2. Localization
- **Languages**: English (`en`), Russian (`ru`), Hebrew (`he`).
- **Behavior**:
  - Switching to Hebrew automatically flips the layout to RTL (Right-to-Left).
  - Navigation arrows (`< >`) flip logic/visuals based on LTR/RTL settings.
  - Jewish holiday names fallback to specific translation maps if not found in CSV (though CSV is primary).

### 3. Custom Events
- **Storage**: `localStorage` (Key: `calendar_events`).
- **Features**: One-time, Weekly, Monthly, and Yearly recurrence.
- **UI**: Click on any date grid cell to open the `EventModal`.

### 4. Theming
- **Modes**: Light, Dark, System.
- **Implementation**: CSS variables in `index.css` (`--color-background`, `--color-primary`, etc.) controlled by a `data-theme` attribute on the root element.

## 📂 Project Structure
```
/
├── public/
│   └── SpecialDays/
│       └── JewishSpecialDays.csv  # <--- EDIT THIS to update holidays
├── src/
│   ├── components/
│   │   ├── layout/         # App shell, split screen logic
│   │   ├── settings/       # Settings modal form
│   │   ├── widgets/        # CalendarWidget, ClockWidget, MediaPanel
│   │   └── events/         # Event creation/editing modal
│   ├── services/
│   │   └── JewishHolidayService.ts # CSV fetcher & parser
│   ├── store/
│   │   └── AppContext.tsx  # Global state (Language, Theme, Events)
│   └── App.tsx             # Entry point & Main Header Logic
```

## 🚀 How to Run
```bash
npm install
npm run dev
```

## ⚠️ Notes for Future Agents
1.  **Holiday Updates**: Always check `public/SpecialDays/JewishSpecialDays.csv` before modifying code for holiday names or dates.
2.  **RTL Logic**: When adding UI components, ensure you strictly use logical specificers (start/end) where possible, or check `settings.language === 'he'` for manual flips.
3.  **State**: `AppContext` is the central brain. If you need to add global settings, add them to `Metrics` or `Settings` interfaces there.
