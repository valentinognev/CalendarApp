# Project Evolution & Update History

## 📜 Version History (Recent Highlights)

### January 2026
- **Sunset/Shabbat Integration**: Implemented `SunsetService` to calculate Shabbat entry/exit times based on location (latitude) using a lookup table (`SunsetTimes.csv`).
- **Jewish Holidays Overhaul**: Migrated holiday data to `JewishSpecialDays.csv`. Completed a **Full Hebrew Audit**, ensuring 100% Hebrew coverage for all holidays and fast days. Refined deduplication logic to handle multi-language overlaps seamlessly.
- **Dynamic Holiday Timings**: Extended the Shabbat timing engine to all official holidays. The app now displays **Candle Lighting (🕯️)** on the eve of any official holiday and **Star Appearance (✨)** at its conclusion, using location-aware lookahead logic.
- **Automatic Theme Switching**: Implemented a location-aware theme engine. Toggles to **Light mode at 07:00** and to **Dark mode exactly at Sunset**, ensuring the app matches the natural rhythm of the user's environment.
- **Responsive Fluid UI**: Implemented **Global Dynamic Scaling** via responsive root font-size (`clamp`). Refined this to be **Settings-Relative**, allowing the UI to respect manual "Small/Medium/Large" user preferences while staying perfectly responsive.
- **Location Self-Sufficiency**: Added **Automatic Geocoding Search** (via Nominatim) and Timezone-based coordinate fallback, making the Shabbat times work out-of-the-box worldwide.
- **Portability**: Converted all data fetching to relative paths and added a modern `install.sh` for easy deployment.

## 🏗 Architectural Evolution

### 1. Jewish Data (The "Source of Truth" Pattern)
**Previous State**: Relied solely on `@hebcal/core` runtime calculations.
**Current State**: Hybrid approach.
- **Dates**: `@hebcal/core` still handles the complex Hebrew calendar math (Gregorian <-> Hebrew).
- **Metadata**: `public/UtilityFiles/JewishSpecialDays.csv` overrides names and types. This allows non-developers to edit holiday names and statuses (e.g., "Official" vs "Minor") without touching code.

### 2. Shabbat & Holiday Times
**Previous State**: Simple Friday/Saturday Shabbat logic.
**Current Solution**: Expanded `SunsetService.ts` logic.
- Uses a pre-calculated lookup table (`public/UtilityFiles/SunsetTimes.csv`) mapping Day-of-Year + Latitude to Sunset time.
- **Universal Timing Pattern**:
  - **Holiday/Shabbat Eve**: Show 🕯️ Candle Lighting (Sunset - 18 minutes).
  - **Holiday/Shabbat Conclusion**: Show ✨ Star Appearance (Sunset + 42 minutes).
- **Automation**: Implemented a lookahead check that detects tomorrow's holiday status to automatically trigger "Eve" timings, ensuring users are always prepared for the start of a holiday.

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
- **Timezones**: Currently assumes local device time. Added timezone-to-coordinate mapping for better "Zero Configuration."
- **Geo-Location**: Strengthened with a hybrid approach: Browser API -> Timezone Mapping -> Manual Search (Nominatim) -> Manual Coordinates.
- **Responsive Layout**: Shifted to a fully dynamic grid with 4/5/6 week heights and `rem`-based scaling relative to window size.
