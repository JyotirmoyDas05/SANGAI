import { useState, useEffect } from 'react';
import './RegionalPages.css';

export default function HeroSection({
    title,
    tagline,
    subtitle,
    heroImage, // Backward compatibility or single image
    heroImages, // Array of image objects or strings
    badge,
    size = 'large' // 'large' | 'medium' | 'small'
}) {
    // Normalize images to an array of simple objects { url, caption }
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Prepare list of images
        let imgList = [];
        if (heroImages && heroImages.length > 0) {
            imgList = heroImages.map(img =>
                typeof img === 'string' ? { url: img } : img
            );
        } else if (heroImage) {
            imgList = [heroImage];
        }

        setImages(imgList);
    }, [heroImage, heroImages]);

    // Slideshow interval
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 3000); // 3 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className={`hero-section hero-${size}`}>
            {/* Background Slides */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`hero-slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${img.url})` }}
                />
            ))}

            {/* If no images, fallback background color handled by CSS */}

            <div className="hero-overlay"></div>
            <div className="hero-content">
                {badge && (
                    <div className="hero-badge">
                        <span className="material-symbols-outlined">{badge.icon || 'public'}</span>
                        <span>{badge.text || tagline}</span>
                    </div>
                )}

                <h1 className="hero-title">{title}</h1>

                {subtitle && (
                    <p className="hero-subtitle">{subtitle}</p>
                )}

                {/* Caption logic: show caption of current image if available */}
                {images[currentIndex]?.caption && (
                    <span className="hero-caption fade-in-caption">
                        {images[currentIndex].caption}
                    </span>
                )}
            </div>
        </section>
    );
}
