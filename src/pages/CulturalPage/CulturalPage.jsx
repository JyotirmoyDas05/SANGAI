import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './CulturalPage.css';

// State slug to code mapping
const STATE_SLUG_TO_CODE = {
    'manipur': 'MN',
    'assam': 'AS',
    'meghalaya': 'ML',
    'nagaland': 'NL',
    'arunachal_pradesh': 'AR',
    'mizoram': 'MZ',
    'tripura': 'TR',
    'sikkim': 'SK'
};

const CATEGORIES = [
    { id: 'festivals', label: 'Festivals', icon: 'celebration' },
    { id: 'music', label: 'Music & Dance', icon: 'music_note' },
    { id: 'attire', label: 'Woven Attire', icon: 'checkroom' },
    { id: 'food', label: 'Traditional Food', icon: 'restaurant' },
    { id: 'wildlife', label: 'Wild Sanctuaries', icon: 'nature' },
];

export default function CulturalPage() {
    const { stateSlug, category = 'festivals' } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const pageRef = useRef(null);

    // State management
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayName, setDisplayName] = useState('');

    // Detect if we're at region or state level
    const isRegionLevel = !stateSlug || location.pathname.startsWith('/northeast/culture');
    const scopeLabel = isRegionLevel ? 'Northeast India' : stateSlug?.replace(/_/g, ' ');

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    // Fetch cultural items from API
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError(null);
            try {
                // Build query params based on scope
                const params = new URLSearchParams();
                if (!isRegionLevel && stateSlug) {
                    params.append('scope', 'state');
                    // Convert slug to 2-letter state code
                    const stateCode = STATE_SLUG_TO_CODE[stateSlug.toLowerCase()];
                    if (stateCode) {
                        params.append('state', stateCode);
                    }
                }

                const res = await fetch(`${API_BASE}/culture/${category}?${params}`);
                const data = await res.json();

                if (data.success) {
                    setItems(data.data);
                } else {
                    setError('Failed to load content');
                    setItems([]);
                }
            } catch (err) {
                console.error('API fetch failed:', err);
                setError('Failed to load content');
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
        setDisplayName(scopeLabel);
        window.scrollTo(0, 0);
    }, [category, stateSlug, isRegionLevel]);


    // GSAP Reveal Animation
    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.cultural-hero__content',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
            );

            gsap.fromTo('.cultural-card',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
            );
        }, pageRef);

        return () => ctx.revert();
    }, [category, loading]);

    // Handle category change navigation
    const handleCategoryChange = (newCategory) => {
        const path = isRegionLevel
            ? `/northeast/culture/${newCategory}`
            : `/northeast/${stateSlug}/culture/${newCategory}`;
        navigate(path);
    };

    // Build item link path
    const getItemPath = (itemId) => {
        return isRegionLevel
            ? `/northeast/culture/${category}/${itemId}`
            : `/northeast/${stateSlug}/culture/${category}/${itemId}`;
    };

    return (
        <div className="cultural-page" ref={pageRef}>
            {/* Standard Hero Section */}
            <header className="cultural-hero">
                {/* Hero Backdrop - Placeholder for now, can be dynamic */}
                <img
                    src="https://images.unsplash.com/photo-1626015099719-217a151b6601?auto=format&fit=crop&q=80&w=2000"
                    alt="Culture Hero"
                    className="cultural-hero__bg"
                />
                <div className="cultural-hero__overlay"></div>

                <div className="cultural-hero__content">
                    <span className="cultural-hero__tag">
                        Cultural Heritage of {displayName}
                    </span>
                    <h1 className="cultural-hero__title">
                        Discover the Soul of the Land
                    </h1>
                    <p className="cultural-hero__desc">
                        Immerse yourself in the traditions, festivals, and distinct ways of life
                        that define this region. A journey through memory and celebration.
                    </p>
                </div>
            </header>

            {/* Standard Filter Bar */}
            <div className="cultural-filter-container">
                <nav className="cultural-filter-list">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`cultural-filter-btn ${category === cat.id ? 'active' : ''}`}
                        >
                            <span className="material-symbols-outlined">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Grid */}
            <main className="cultural-grid">
                {loading ? (
                    <div className="col-span-full text-center py-20">
                        <p className="text-xl text-stone-400">Loading cultural content...</p>
                    </div>
                ) : items.map((item) => (
                    <Link
                        key={item.id}
                        to={getItemPath(item.id)}
                        className="cultural-card"
                    >
                        <div className="cultural-card__img-container">
                            {item.isHiddenGem && <span className="cultural-card__overlay-tag">Hidden Gem</span>}
                            <img
                                src={item.image}
                                alt={item.name}
                                className="cultural-card__img"
                            />
                        </div>
                        <div className="cultural-card__content">
                            <h3 className="cultural-card__title">
                                {item.name}
                            </h3>
                            <div className="cultural-card__location">
                                <span className="material-symbols-outlined">location_on</span>
                                {item.location}
                            </div>
                        </div>
                    </Link>
                ))}

                {!loading && items.length === 0 && (
                    <div className="col-span-full text-center py-20">
                        <p className="text-xl text-stone-400">Content coming soon...</p>
                    </div>
                )}
            </main>
        </div>
    );
}

