import type { Settings } from '../store/AppContext';

// We can import the JSON directly if configured, or fetch it. 
// For simplicity and performance in this setup, we'll fetch it once or rely on the known structure.
// However, the user specifically asked for "relevant directory in Images dir".
// The structure is established as: /UtilityFiles/Media/Images/{CategoryName}/{id}_{1-5}.jpg
// We need the mapping from Name (e.g. "Nature") to ID (e.g. "nature") because the folder name is "Nature" (Capitalized) but the file prefix is "nature" (lowercase) based on my download script.
// Wait, my download script used:
// cat_path = category['path'] -> "UtilityFiles/Media/Images/Nature"
// filename = f"{cat_id}_{i}.jpg" -> "nature_1.jpg"
// So folder is "Nature", file is "nature_1.jpg".

interface CategoryConfig {
    id: string;
    name: string;
    path: string;
    allowed: boolean;
}

let categoryConfigs: CategoryConfig[] = [];

// Fetch config once
export const loadImageCategories = async () => {
    try {
        const response = await fetch('/UtilityFiles/ImageCategory.json');
        if (response.ok) {
            categoryConfigs = await response.json();
        }
    } catch (error) {
        console.error("Failed to load image categories", error);
    }
};

export const getNextImage = (settings: Settings): string => {
    // 1. Local Source
    if (settings.imageSource === 'local') {
        // If it's a file path (ends in .jpg/.png), return it.
        // If it's a directory, we can't really "list" it from browser security. 
        // We'll return the path as is, assuming user provided a full direct link or localhost path.
        return settings.localImagePath || '';
    }

    // 2. Category Source
    // a. Get enabled categories from settings
    const enabledNames = settings.imageCategories || [];

    // b. Filter config to find matching Allowed categories
    // If config isn't loaded yet (rare race condition), we might fall back or return empty.
    // If no config loaded, we can infer ID = name.toLowerCase() as a fallback.

    const candidates = enabledNames.filter(name => {
        const conf = categoryConfigs.find(c => c.name === name);
        // If conf exists, check allowed. If not found, assume allowed (custom?) or ignore.
        return conf ? conf.allowed : true;
    });

    if (candidates.length === 0) return ''; // No category selected

    // c. Pick Random Category
    const randomCatName = candidates[Math.floor(Math.random() * candidates.length)];
    const config = categoryConfigs.find(c => c.name === randomCatName);

    // Fallbacks if config missing
    const catId = config ? config.id : randomCatName.toLowerCase();
    const catFolder = config ? config.path.split('/').pop() : randomCatName; // "Nature"

    // d. Pick Random Image Index (1-5)
    const randomIndex = Math.floor(Math.random() * 5) + 1;

    // Construct URL
    // Expected: /UtilityFiles/Media/Images/Nature/nature_1.jpg
    return `/UtilityFiles/Media/Images/${catFolder}/${catId}_${randomIndex}.jpg`;
};
