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
    ContributionCards,
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

    // Helper: Hide nav if we are deeper in the hierarchy (District page)
    // We check if the path has a segment after the state slug that represents a district
    // Known state-level sub-routes:
    const stateSubRoutes = ['festivals', 'places', 'homestays', 'shopping', 'culture'];
    const pathParts = location.pathname.split('/').filter(Boolean);
    // [0]=northeast, [1]=stateSlug, [2]=potentialDistrictOrSubRoute
    const isDistrictPage = pathParts.length > 2 && !stateSubRoutes.includes(pathParts[2]);

    return (
        <div className="region-page">
            {/* Floating Navigation - Only show if NOT on a district page */}
            <nav className={`floating-nav ${isNavVisible && !isDistrictPage ? 'visible' : 'hidden'}`}>
                <div className="floating-nav-container">
                    <NavLink to={basePath} end className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Overview
                    </NavLink>
                    <NavLink to={`${basePath}/festivals`} className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Festivals
                    </NavLink>
                    <NavLink to={`${basePath}/culture/festivals`} className={({ isActive }) => `floating-nav-item ${isActive || location.pathname.includes('/culture/') ? 'active' : ''}`}>
                        Culture
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

    const FALLBACK_SLIDES = [
        { url: 'https://images.unsplash.com/photo-1571676674483-e18e87d0c3bc?q=80&w=1920', caption: displayName },
        { url: 'https://images.unsplash.com/photo-1626084288019-3e3902319ec8?q=80&w=1920', caption: 'Natural Beauty' },
        { url: 'https://images.unsplash.com/photo-1598555813876-b6d3763f350c?q=80&w=1920', caption: 'Rich Heritage' }
    ];

    const heroSlides = (data.heroImages && data.heroImages.length > 0)
        ? data.heroImages
        : FALLBACK_SLIDES;

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
                images={(data.collageImages && data.collageImages.length > 0) ? data.collageImages : heroSlides}
            />

            <DefiningThemesSection themes={data?.definingThemes} />

            {/* Section: Contributions (What This State Gives) */}
            {data.contributions?.length > 0 && (
                <ContributionCards
                    contributions={data.contributions}
                    title={`What ${data.name} Gives to India`}
                />
            )}

            {data.glance && (
                <StateAtAGlanceSection glance={data.glance} stateName={data.name} />
            )}

            <ShoppingSection title={`Crafts of ${data.name}`} />

            {/* Section: Shared Story */}
            {data.sharedStory?.paragraphs?.length > 0 && (
                <NarrativeBlock
                    paragraphs={data.sharedStory.paragraphs}
                    title={data.sharedStory.title || `A Story of ${data.name}`}
                    tone="philosophical"
                    align="center"
                />
            )}

            {/* Section: Cultural Threads */}
            {data.culturalThreads?.length > 0 && (
                <CulturalThreadsScroll
                    threads={data.culturalThreads}
                    title={`Cultural Threads of ${data.name}`}
                    basePath={`/northeast/${stateSlug}`}
                />
            )}

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
