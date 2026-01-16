# Project Evolution & Update History

## 📜 Version History (Recent Highlights)

### January 2026
- **Sunset/Shabbat Integration**: Implemented `SunsetService` to calculate Shabbat entry/exit times based on location (latitude) using a lookup table (`SunsetTimes.csv`) instead of complex runtime astronomy libraries.
- **Jewish Holidays Overhaul**: Migrated holiday data to `JewishSpecialDays.csv` to serve as a rigid "Source of Truth" for names and dates, solving localization consistency issues across EN/RU/HE.
- **Localization**: Completed full UI translation logic, including dynamic RTL switching for Hebrew and language-specific holiday names.
- **Event System**: Added persistent custom events (recurrence support) stored in `localStorage`.
- **UI Polish**: Added "Premium Wall" aesthetic, image categories for background, and smooth animations.

## 🏗 Architectural Evolution

### 1. Jewish Data (The "Source of Truth" Pattern)
**Previous State**: Relied solely on `@hebcal/core` runtime calculations.
**Current State**: Hybrid approach.
- **Dates**: `@hebcal/core` still handles the complex Hebrew calendar math (Gregorian <-> Hebrew).
- **Metadata**: `public/UtilityFiles/JewishSpecialDays.csv` overrides names and types. This allows non-developers to edit holiday names and statuses (e.g., "Official" vs "Minor") without touching code.

### 2. Shabbat Times (Zmanim)
**Previous State**: Attempted to use `@hebcal/core`'s `Zmanim` class.
**Issue**: Caused build errors and runtime crashes due to constructor incompatibilities and missing timezone data.
**Current Solution**: `SunsetService.ts`.
- Uses a pre-calculated lookup table (`public/UtilityFiles/SunsetTimes.csv`) mapping Day-of-Year + Latitude to Sunset time.
- **Logic**:
  - Candle Lighting: Sunset - 18 minutes (Friday).
  - Havdalah: Sunset + 42 minutes (Saturday).
- **Trade-off**: Slightly less precise than real-time astronomical calculation, but significantly more robust and crash-proof for the MVP.

### 3. File Structure Shifts
- **Data Location**: moved from `public/SpecialDays/` to `public/UtilityFiles/` to centralize all CSV data sources (Languages, Country Data, Sunsets, Holidays).

## ⚠️ Key Data Sources

| File | Purpose |
|------|---------|
| `public/UtilityFiles/JewishSpecialDays.csv` | Jewish holiday names (multi-lang) & metadata. |
| `public/UtilityFiles/SunsetTimes.csv` | Sunset times table (DayOfYear x Latitude). |
| `public/UtilityFiles/CountryData.csv` | List of supported countries and their default calendar preferences. |
| `public/UtilityFiles/NationalHolidays/` | Folder containing per-country national holiday CSVs. |

## 🔮 Future Considerations
- **Timezones**: Currently assumes local device time. Future updates might need explicit timezone handling if accurate "remote" times are needed.
- **Geo-Location**: Currently relies on browser API. If blocked, fallback logic for default location (e.g., Jerusalem or user-selected) needs to be strengthened.
