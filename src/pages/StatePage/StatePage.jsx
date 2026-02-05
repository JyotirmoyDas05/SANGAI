/**
 * StatePage - Page for state-level in hierarchy
 * Accessed via /northeast/:stateSlug
 * 
 * Provides state overview and acts as container for district children
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, NavLink, useParams, useLocation, useOutletContext } from 'react-router-dom';
import { getStateBySlug } from '../../api/apiService';
import { getAudioForRegion } from '../../config/audioMapping';
import {
    HeroSection,
    DescriptionSection,
    StateAtAGlanceSection,
    NarrativeBlock,
    CulturalThreadsScroll,
    DefiningThemesSection,
    ShoppingSection,
    GatewayGrid
} from '../../components/RegionalPages';
import '../NortheastPage/NortheastPage.css';

const HIDE_DELAY = 3000;

/**
 * Convert URL slug to display name
 */
function toDisplayName(slug) {
    return slug
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function StatePage() {
    const { stateSlug } = useParams();
    const location = useLocation();
    const displayName = toDisplayName(stateSlug);

    // Check if at root state path (no district specified)
    const isRootPath = location.pathname === `/northeast/${stateSlug}`;
    // Always use full width for state pages and their children
    const useFullWidth = true;

    // Floating nav visibility
    const [isNavVisible, setIsNavVisible] = useState(true);
    const hideTimeoutRef = useRef(null);

    const resetHideTimer = useCallback(() => {
        setIsNavVisible(true);
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
            setIsNavVisible(false);
        }, HIDE_DELAY);
    }, []);

    const handleMouseMove = useCallback(() => {
        resetHideTimer();
    }, [resetHideTimer]);

    useEffect(() => {
        hideTimeoutRef.current = setTimeout(() => {
            setIsNavVisible(false);
        }, HIDE_DELAY);

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, [handleMouseMove]);

    // Build base path for navigation
    const basePath = `/northeast/${stateSlug}`;

    return (
        <div className="region-page">
            {/* Floating Navigation */}
            <nav className={`floating-nav ${isNavVisible ? 'visible' : 'hidden'}`}>
                <div className="floating-nav-container">
                    <NavLink to={basePath} end className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Overview
                    </NavLink>
                    <NavLink to={`${basePath}/festivals`} className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Festivals
                    </NavLink>
                    <NavLink to={`${basePath}/places`} className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Places
                    </NavLink>
                    <NavLink to={`${basePath}/homestays`} className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Homestays
                    </NavLink>
                    <NavLink to="/shopping" className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Shopping
                    </NavLink>
                </div>
            </nav>

            {/* Content Area */}
            <main className={`region-content ${useFullWidth ? 'region-full-content' : ''}`}>
                {isRootPath ? (
                    <StateOverview stateSlug={stateSlug} displayName={displayName} />
                ) : (
                    <Outlet context={{ stateSlug, stateName: displayName }} />
                )}
            </main>
        </div>
    );
}

/**
 * StateOverview - Default content for state page
 */
function StateOverview({ stateSlug, displayName }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const stateData = await getStateBySlug(stateSlug);
                setData(stateData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [stateSlug]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <span className="loading-text">Discovering {displayName}...</span>
            </div>
        );
    }

    if (error || !data) {
        return <FallbackOverview displayName={displayName} />;
    }

    const heroSlides = [
        { url: 'https://images.unsplash.com/photo-1571676674483-e18e87d0c3bc?q=80&w=1920', caption: displayName },
        { url: 'https://images.unsplash.com/photo-1626084288019-3e3902319ec8?q=80&w=1920', caption: 'Natural Beauty' },
        { url: 'https://images.unsplash.com/photo-1598555813876-b6d3763f350c?q=80&w=1920', caption: 'Rich Heritage' }
    ];

    return (
        <div className="region-overview">
            <HeroSection
                title={data.name}
                tagline={data.tagline}
                heroImages={heroSlides}
                audioTrack={getAudioForRegion(data.slug)}
                badge={{ icon: 'location_on', text: 'Northeast India' }}
                size="large"
            />

            <DescriptionSection
                title={`Welcome to ${data.name}`}
                description={data.description || `Explore the rich culture, stunning landscapes, and vibrant traditions of ${data.name}.`}
                images={heroSlides}
            />

            <DefiningThemesSection />

            {data.glance && (
                <StateAtAGlanceSection glance={data.glance} stateName={data.name} />
            )}

            <ShoppingSection title={`Crafts of ${data.name}`} />

            {/* Explore Districts - Links to /northeast/:state/:district */}
            {data.districts?.length > 0 && (
                <GatewayGrid
                    items={data.districts.map(d => ({
                        ...d,
                        // Override path to use hierarchical route
                        path: `/northeast/${stateSlug}/${d.slug}`
                    }))}
                    title={`Explore ${data.name}'s Districts`}
                    basePath={`/northeast/${stateSlug}`}
                    entityType="district"
                />
            )}
        </div>
    );
}

function FallbackOverview({ displayName }) {
    return (
        <div className="region-overview">
            <section className="region-hero">
                <div className="region-hero-content">
                    <div className="region-badge">
                        <span className="material-symbols-outlined">location_on</span>
                        <span>Northeast India</span>
                    </div>
                    <h1 className="region-title">{displayName.toUpperCase()}</h1>
                    <p className="region-subtitle">
                        Explore the rich culture and traditions of {displayName}.
                    </p>
                </div>
            </section>
        </div>
    );
}
