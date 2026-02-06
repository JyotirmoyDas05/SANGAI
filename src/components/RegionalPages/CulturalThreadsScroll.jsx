/**
 * CulturalThreadsScroll - Horizontal scroll gallery
 * Section 5 for Region pages (Cultural Threads)
 * 
 * Fetches real images from CMS cultural items for each category
 */
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RegionalPages.css';

// Map thread titles to category slugs
const CATEGORY_MAP = {
    'Festival': 'festivals',
    'Music': 'music',
    'Woven': 'attire',
    'Attire': 'attire',
    'Food': 'food',
    'Wild': 'wildlife'
};

function getCategoryFromTitle(title) {
    for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
        if (title.includes(keyword)) return category;
    }
    return 'festivals';
}

export default function CulturalThreadsScroll({
    threads = [],
    title = "Cultural Threads",
    basePath = "" // Base path for constructing culture links (e.g., "/northeast" or "/northeast/manipur")
}) {
    const scrollRef = useRef(null);
    const [categoryImages, setCategoryImages] = useState({});

    // Fetch first image from each category
    useEffect(() => {
        const categories = ['festivals', 'music', 'attire', 'food', 'wildlife'];

        async function fetchCategoryImages() {
            const images = {};

            for (const category of categories) {
                try {
                    // Extract state code from basePath if present (e.g., "/northeast/assam" -> "AS")
                    const pathParts = basePath.split('/').filter(Boolean);
                    const stateSlug = pathParts.length > 1 ? pathParts[1] : null;

                    // Build API URL with scope - use full backend URL
                    const API_BASE = 'http://localhost:3001';
                    let url = `${API_BASE}/api/culture/${category}`;
                    if (stateSlug) {
                        // State-level: pass state code (we'll use first 2 chars uppercase as approximation)
                        url += `?scope=state&state=${stateSlug.substring(0, 2).toUpperCase()}`;
                    }

                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.success && data.data.length > 0) {
                        // Use the first item's image
                        images[category] = data.data[0].image;
                    }
                } catch (err) {
                    console.warn(`Failed to fetch ${category} image:`, err);
                }
            }

            setCategoryImages(images);
            console.log('CulturalThreads: Fetched category images:', images);
        }

        fetchCategoryImages();
    }, [basePath]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 340; // Card width + gap
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!threads.length) return null;

    return (
        <section className="cultural-threads-section">
            <div className="threads-header">
                <h2 className="section-title">{title}</h2>
                <div className="scroll-controls">
                    <button
                        className="scroll-btn"
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button
                        className="scroll-btn"
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>

            <div className="threads-scroller" ref={scrollRef}>
                {threads.map((thread, index) => {
                    // Get category from title
                    const category = getCategoryFromTitle(thread.title);

                    // Construct full path: basePath + /culture/ + category
                    const culturePath = basePath ? `${basePath}/culture/${category}` : `culture/${category}`;

                    // Use dynamic image from API if available, otherwise fallback to thread's mock image
                    const imageUrl = categoryImages[category] || thread.imageUrl;

                    return (
                        <Link
                            to={culturePath}
                            className="thread-card block transition-transform hover:scale-[1.02]"
                            key={index}
                        >
                            <div
                                className="thread-image"
                                style={{ backgroundImage: `url(${imageUrl})` }}
                            >
                                <div className="thread-overlay"></div>
                            </div>
                            <div className="thread-content">
                                <h3 className="thread-title">{thread.title}</h3>
                                <p className="thread-insight">{thread.insight}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
