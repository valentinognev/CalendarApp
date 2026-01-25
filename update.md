# Project Evolution & Update History

## 📜 Version History (Recent Highlights)

### January 2026
- **Sunset/Shabbat Integration**: Implemented `SunsetService` to calculate Shabbat entry/exit times based on location (latitude) using a lookup table (`SunsetTimes.csv`).
- **Jewish Holidays Overhaul**: Migrated holiday data to `JewishSpecialDays.csv` and fixed language duplication/mix issues. Implemented a **Canonical Mapping Deduplication** logic to handle synonyms.
- **Responsive Fluid UI**: Implemented **Global Dynamic Scaling** via responsive root font-size (`clamp`) and fluid grid headers. The calendar now dynamically calculates week counts (4-6 weeks) to fill the height perfectly without clipping.
- **Location Self-Sufficiency**: Added **Automatic Geocoding Search** (via Nominatim) and Timezone-based coordinate fallback, making the Shabbat times work out-of-the-box worldwide.
- **Portability**: Converted all data fetching to relative paths and added a modern `install.sh` for easy deployment.

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
- **Timezones**: Currently assumes local device time. Added timezone-to-coordinate mapping for better "Zero Configuration."
- **Geo-Location**: Strengthened with a hybrid approach: Browser API -> Timezone Mapping -> Manual Search (Nominatim) -> Manual Coordinates.
- **Responsive Layout**: Shifted to a fully dynamic grid with 4/5/6 week heights and `rem`-based scaling relative to window size.
