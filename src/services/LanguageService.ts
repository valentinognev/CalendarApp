export interface LanguageDefault {
    code: string;
    name: string;
    direction: 'ltr' | 'rtl';
}

let languageCache: Record<string, LanguageDefault> | null = null;
let isFetching = false;
const waitQueue: (() => void)[] = [];

export const fetchLanguageDefaults = async (): Promise<Record<string, LanguageDefault>> => {
    if (languageCache) return languageCache;

    if (isFetching) {
        return new Promise(resolve => {
            waitQueue.push(() => resolve(languageCache!));
        });
    }

    isFetching = true;
    try {
        const response = await fetch('UtilityFiles/LanguageDefaults.csv?t=' + Date.now());
        const text = await response.text();
        languageCache = parseCSV(text);

        // Resolve queue
        waitQueue.forEach(cb => cb());
        waitQueue.length = 0;

        return languageCache;
    } catch (error) {
        console.error('Failed to load Language Defaults:', error);
        return {};
    } finally {
        isFetching = false;
    }
};

const parseCSV = (csvText: string): Record<string, LanguageDefault> => {
    const lines = csvText.split('\n');
    const map: Record<string, LanguageDefault> = {};

    // Header: Code,Name,Direction
    // indices: 0, 1, 2

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [code, name, direction] = line.split(',');
        if (code && direction) {
            map[code] = {
                code,
                name,
                direction: direction as 'ltr' | 'rtl'
            };
        }
    }
    return map;
};

export const getLanguageDirection = async (code: string): Promise<'ltr' | 'rtl'> => {
    const defaults = await fetchLanguageDefaults();
    return defaults[code]?.direction || 'ltr';
};
