import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { getNextImage, loadImageCategories } from '../../services/ImageService';

export const MediaPanel: React.FC = () => {
    const { settings } = useAppStore();
    const [currentImage, setCurrentImage] = useState<string>('');
    const [fade, setFade] = useState(false);

    // Initial Load of Config
    useEffect(() => {
        loadImageCategories().then(() => {
            // Set initial image
            setCurrentImage(getNextImage(settings));
        });
    }, []);

    // Rotation Logic
    useEffect(() => {
        // Immediate update if source/categories change (optional, but good UX)
        // setCurrentImage(getNextImage(settings)); 
        // actually, let's just let the timer handle it OR trigger on change.
        // If user changes category, they want to see result immediately.
        const newImg = getNextImage(settings);
        if (newImg) setCurrentImage(newImg);

        const ms = settings.imageChangeFrequency || 3600000; // Default 1h

        const interval = setInterval(() => {
            // Fade out effect could be added here
            setFade(true);
            setTimeout(() => {
                setCurrentImage(getNextImage(settings));
                setFade(false);
            }, 500); // Wait for fade out
        }, ms);

        return () => clearInterval(interval);
    }, [settings.imageCategories, settings.imageSource, settings.imageChangeFrequency, settings.localImagePath]);

    return (
        <div className="w-full h-full relative bg-slate-900 overflow-hidden">
            {currentImage ? (
                <img
                    src={currentImage}
                    alt="Background"
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${fade ? 'opacity-0' : 'opacity-100'} filter brightness-[0.75]`}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                    No image source selected
                </div>
            )}

            <div className="absolute bottom-8 left-8 text-white/80 text-sm font-light tracking-wide bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                {settings.imageSource === 'local' ? 'Local Source' : settings.imageCategories?.join(' • ') || 'Gallery'}
            </div>
        </div>
    );
};
