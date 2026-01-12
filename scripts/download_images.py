import json
import os
import subprocess
import time
import random

# Path to the categories configuration
CONFIG_PATH = 'public/UtilityFiles/ImageCategory.json'
BASE_URL = "https://loremflickr.com/1920/1080/"

def download_images():
    print(f"Reading configuration from {CONFIG_PATH}...")
    
    try:
        with open(CONFIG_PATH, 'r') as f:
            categories = json.load(f)
    except FileNotFoundError:
        print(f"Error: {CONFIG_PATH} not found.")
        return

    total_categories = len(categories)
    print(f"Found {total_categories} categories. Starting download...")

    for idx, category in enumerate(categories):
        cat_name = category['name']
        cat_id = category['id']
        # Remove leading forward slash from path to make it relative to CWD if running from root
        cat_path = category['path'].lstrip('/')
        
        print(f"[{idx+1}/{total_categories}] Processing '{cat_name}' -> {cat_path}")
        
        # Ensure directory exists (it should, but safety first)
        os.makedirs(cat_path, exist_ok=True)
        
        for i in range(1, 6):
            filename = f"{cat_id}_{i}.jpg"
            filepath = os.path.join(cat_path, filename)
            
            if os.path.exists(filepath):
                print(f"  - Skipping {filename} (already exists)")
                continue

            # Construct URL: base/category?random=seed
            # We use the category name for the keyword. 
            # Note: loremflickr uses simple keywords. 'Minimalism' might just be 'minimal'.
            # Let's use the category name as is, it's usually good enough.
            keyword = cat_name.lower()
            url = f"{BASE_URL}{keyword}?random={random.randint(1, 100000)}"
            
            print(f"  - Downloading image {i}/5: {filename} from {url}")
            
            try:
                # Use curl to download
                subprocess.run([
                    'curl', '-L', '-s', '-o', filepath, url
                ], check=True)
                
                # Small delay to be polite
                time.sleep(1) 
                
            except subprocess.CalledProcessError as e:
                print(f"    Failed to download {filename}: {e}")

    print("All downloads completed.")

if __name__ == "__main__":
    download_images()
