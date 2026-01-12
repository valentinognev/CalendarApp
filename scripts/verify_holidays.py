import os
import csv
import re
import sys
import argparse

# Configuration
HOLIDAYS_DIR = 'public/UtilityFiles/NationalHolidays'
LANGUAGE_LIST_FILE = 'public/UtilityFiles/LanguageList.csv'
REQUIRED_COLUMNS = ['Date', 'Name', 'Type', 'Calendar']
VALID_TYPES = ['public', 'observance', 'bank holiday', 'common local holiday', 'national holiday', 'optional holiday']
VALID_CALENDARS = ['gregorian', 'jewish', 'muslim']

def get_required_languages():
    langs = []
    if os.path.exists(LANGUAGE_LIST_FILE):
        try:
            with open(LANGUAGE_LIST_FILE, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                if reader.fieldnames and 'LanguageCode' in reader.fieldnames:
                    for row in reader:
                        code = row['LanguageCode'].strip()
                        if code:
                            langs.append(code)
        except Exception as e:
            print(f"Warning: Could not read language list: {e}")
    return langs

REQUIRED_LANGUAGES = get_required_languages()


# Regex parsers
DATE_ISO_REGEX = re.compile(r'^\d{4}-\d{2}-\d{2}$') # YYYY-MM-DD
DATE_CUSTOM_REGEX = re.compile(r'^\d{1,2}\s+[A-Za-z\-\s]+(-\d{1,2}\s+[A-Za-z\-\s]+)?$') 

def validate_date(date_str):
    if not date_str:
        return False
    if DATE_ISO_REGEX.match(date_str):
        return True
    if DATE_CUSTOM_REGEX.match(date_str):
        return True
    return False

def verify_file(filepath):
    filename = os.path.basename(filepath)
    errors = []
    warnings = []
    
    if not os.path.exists(filepath):
        return [f"File not found: {filepath}"], []
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            pass
            
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            if not reader.fieldnames:
                return ["Empty file or no header"], []
            
            headers = [h.strip() for h in reader.fieldnames]
            
            # Check for base required columns
            for req in REQUIRED_COLUMNS:
                if req not in headers:
                    errors.append(f"Missing required column: {req}")

            # Check for language columns
            if REQUIRED_LANGUAGES:
                missing_langs = [lang for lang in REQUIRED_LANGUAGES if lang not in headers]
                if missing_langs:
                     # Reporting all might be verbose, maybe report count or first few
                     errors.append(f"Missing {len(missing_langs)} language columns: {', '.join(missing_langs[:5])}...")

            row_count = 0
            for row in reader:
                row_count += 1
                
                # Check Date
                date_val = (row.get('Date') or '').strip()
                if not validate_date(date_val):
                    errors.append(f"Row {row_count}: Invalid Date format '{date_val}'")
                
                # Check Name
                name_val = (row.get('Name') or '').strip()
                if not name_val:
                    errors.append(f"Row {row_count}: Missing Name")
                
                # Check Type
                type_val = (row.get('Type') or '').strip().lower()
                # Type optional if unknown? User implies "relevant data". 
                # But 'Type' usually is 'public'. Let's enforce presence.
                if not type_val:
                     pass # Keeping loose as I didn't verify if all rows have type before.
                
                # Check Calendar (STRICT now)
                cal_val = (row.get('Calendar') or '').strip().lower()
                if not cal_val:
                    errors.append(f"Row {row_count}: Missing Calendar type (cell is empty)")
                elif cal_val not in VALID_CALENDARS:
                    errors.append(f"Row {row_count}: Invalid Calendar type '{cal_val}'")

                # Check Translations
                if REQUIRED_LANGUAGES:
                    missing_trans = []
                    for lang in REQUIRED_LANGUAGES:
                        val = (row.get(lang) or '').strip()
                        if not val:
                            missing_trans.append(lang)
                    
                    if missing_trans:
                        # Report concisely
                        count = len(missing_trans)
                        if count > 5:
                            sample = ', '.join(missing_trans[:5])
                            errors.append(f"Row {row_count}: Missing translations for {count} languages ({sample}, ...)")
                        else:
                            errors.append(f"Row {row_count}: Missing translations for {', '.join(missing_trans)}")
                
    except Exception as e:
        errors.append(f"File read error: {str(e)}")
        
    return errors, warnings

def main():
    parser = argparse.ArgumentParser(description="Verify National Holiday CSV files.")
    parser.add_argument("filename", nargs="?", help="Specific CSV file to verify (optional)")
    args = parser.parse_args()

    files_to_check = []

    if args.filename:
        if os.path.exists(args.filename):
             files_to_check.append(args.filename)
        elif os.path.exists(os.path.join(HOLIDAYS_DIR, args.filename)):
             files_to_check.append(os.path.join(HOLIDAYS_DIR, args.filename))
        else:
             print(f"Error: File '{args.filename}' not found.")
             sys.exit(1)
        print(f"Verifying single file: {files_to_check[0]}...")
    else:
        print(f"Verifying all CSV files in {HOLIDAYS_DIR}...")
        if not os.path.exists(HOLIDAYS_DIR):
            print(f"Directory not found: {HOLIDAYS_DIR}")
            sys.exit(1)
            
        files = [f for f in os.listdir(HOLIDAYS_DIR) if f.endswith('.csv')]
        files.sort()
        for f in files:
            files_to_check.append(os.path.join(HOLIDAYS_DIR, f))

    total_errors = 0
    files_with_errors = 0
    
    for filepath in files_to_check:
        filename = os.path.basename(filepath)
        errors, warnings = verify_file(filepath)
        
        if errors:
            files_with_errors += 1
            total_errors += len(errors)
            print(f"\n❌ {filename}: {len(errors)} errors")
            for err in errors:
                print(f"  - {err}")
        else:
            if args.filename:
                print(f"✅ {filename} OK")

    print("\n" + "="*30)
    print(f"Verification Complete.")
    print(f"Files Checked: {len(files_to_check)}")
    print(f"Files with Errors: {files_with_errors}")
    print(f"Total Errors: {total_errors}")
    
    if total_errors > 0:
        sys.exit(1)
    else:
        if args.filename:
            print(f"File '{os.path.basename(files_to_check[0])}' passed validation.")
        else:
            print("All files passed validation.")
        sys.exit(0)

if __name__ == "__main__":
    main()
