
export interface GeocodingResult {
    lat: number;
    long: number;
    displayName: string;
}

export const searchLocation = async (city: string, country: string): Promise<GeocodingResult | null> => {
    if (!city && !country) return null;

    try {
        const query = [city, country].filter(Boolean).join(', ');
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'en',
                // Nominatim policy requires a User-Agent. 
                // In a browser, we can't set User-Agent easily due to CORS/security, 
                // but usually simple fetch works for low volume.
            }
        });

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                long: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};
