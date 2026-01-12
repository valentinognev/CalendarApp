# Chat Summary & Project Status

**Date:** January 12, 2026

## Objective
The primary goal of this session was to enhance the **Jewish Holiday Localization** and integrate **Shabbat Times** based on user location.

## Key Actions Taken

### 1. Jewish Holiday Localization
- **CSV Integration**: Moved all Jewish holiday data to `public/SpecialDays/JewishSpecialDays.csv` as the Single Source of Truth.
- **Service Layer**: Created `JewishHolidayService.ts` to fetch and parse this CSV.
- **Calendar Widget**: Refactored `CalendarWidget.tsx` to prioritize CSV data for holiday names (supporting EN, RU, HE) and types (holiday, fast, minor).
- **Official Status**: Added an `Official` column to the CSV to highlight major holidays with a specific visual style (yellow ring).

### 2. Shabbat Times Implementation
- **Geolocation**: Updated `AppContext.tsx` to request and store the user's latitude/longitude.
- **Zmanim Integration**: Attempted to use `@hebcal/core`'s `Zmanim` class to calculate Candle Lighting and Havdalah times.
- **Current Status**: 
  - The implementation of Zmanim caused build errors due to incorrect API usage (constructor arguments and missing methods).
  - The app is currently crashing (White Screen) due to these errors.
  - **Next Step**: Fix `CalendarWidget.tsx` to use the correct `Zmanim` and `GeoLocation` constructors and manually calculate times relative to sunset.

## Technical Notes
- **Library**: `@hebcal/core` is used for Jewish dates.
- **Issue**: The `Zmanim` class in the installed version requires specific arguments (`elevation`, `timeZoneId`, `useElevation`) which were missing in the initial code.
- **Fix**: Code is being updated to:
  - `new GeoLocation(null, lat, long, 0, timezone)`
  - `new Zmanim(gloc, date, false)`
  - `Candles = Sunset - 18m`
  - `Havdalah = Sunset + 42m`

## Files Created/Modified
- `public/SpecialDays/JewishSpecialDays.csv`
- `src/services/JewishHolidayService.ts`
- `src/components/widgets/CalendarWidget.tsx`
- `src/store/AppContext.tsx`
- `README.md`
