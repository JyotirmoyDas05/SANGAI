/**
 * NortheastPage - Dedicated page for Northeast region overview
 * Accessed via /northeast route
 * 
 * Fetches data from API and renders 8-section content structure
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { getRegionBySlug } from '../../api/apiService';
import {
    HeroSection,
    DescriptionSection,
    NarrativeBlock,
    PeopleGallery,

    CulturalThreadsScroll,
    ContributionCards,
    ExplorationGrid,
    GatewayGrid,
    DefiningThemesSection,
    ShoppingSection,
    StateAtAGlanceSection
} from '../../components/RegionalPages';
import { REGION_AUDIO } from '../../config/audioMapping';
import './NortheastPage.css';

const HIDE_DELAY = 3000; // 3 seconds before auto-hide

export default function NortheastPage() {
    const location = useLocation();
    const isRootPath = location.pathname === '/northeast';

    // Floating nav visibility state
    const [isNavVisible, setIsNavVisible] = useState(true);
    const hideTimeoutRef = useRef(null);

    /**
     * Reset the hide timer - call this on any user activity
     */
    const resetHideTimer = useCallback(() => {
        // Show nav immediately
        setIsNavVisible(true);

        // Clear existing timeout
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }

        // Set new timeout to hide after 5 seconds
        hideTimeoutRef.current = setTimeout(() => {
            setIsNavVisible(false);
        }, HIDE_DELAY);
    }, []);

    /**
     * Handle mouse movement - show nav and reset timer
     */
    const handleMouseMove = useCallback(() => {
        resetHideTimer();
    }, [resetHideTimer]);

    // Set up mouse move listener and initial timer
    useEffect(() => {
        // Set initial hide timeout (without calling setState synchronously)
        hideTimeoutRef.current = setTimeout(() => {
            setIsNavVisible(false);
        }, HIDE_DELAY);

        // Listen for mouse movement on the document
        document.addEventListener('mousemove', handleMouseMove);

        // Cleanup
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, [handleMouseMove]);

    return (
        <div className="region-page">
            {/* Floating Navigation - Bottom Center */}
            <nav className={`floating-nav ${isNavVisible ? 'visible' : 'hidden'}`}>
                <div className="floating-nav-container">
                    <NavLink to="/northeast" end className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Overview
                    </NavLink>
                    <NavLink to="/northeast/destinations" className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Destinations
                    </NavLink>
                    <NavLink to="/northeast/essentials" className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Essentials
                    </NavLink>
                    <NavLink to="/northeast/festivals" className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Festivals
                    </NavLink>
                </div>
            </nav>

            {/* Content Area */}
            <main className={`region-content ${isRootPath ? 'northeast-content' : ''}`}>
                {isRootPath ? (
                    <NortheastOverview />
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
}

/**
 * NortheastOverview - Default content when no subpage is selected
 * Fetches data from API and renders 8-section layout
 */
function NortheastOverview() {
    const [regionData, setRegionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRegionData() {
            try {
                setLoading(true);
                const data = await getRegionBySlug('northeast');
                setRegionData(data);
            } catch (err) {
                console.error('Failed to fetch region data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchRegionData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <span className="loading-text">Discovering Northeast India...</span>
            </div>
        );
    }

    // Error state - show fallback content
    if (error || !regionData) {
        return <FallbackOverview />;
    }

    const HERO_SLIDES = [
        regionData.heroImages?.[0] || { url: 'https://images.unsplash.com/photo-1571676674483-e18e87d0c3bc?q=80&w=1920', caption: 'Tea Gardens of Assam' },
        { url: 'https://images.unsplash.com/photo-1626084288019-3e3902319ec8?q=80&w=1920', caption: 'Majestic Himalayas' },
        { url: 'https://images.unsplash.com/photo-1598555813876-b6d3763f350c?q=80&w=1920', caption: 'Cascading Waterfalls' },
        { url: 'https://images.unsplash.com/photo-1533241517006-be2f985b8829?q=80&w=1920', caption: 'Vibrant Tribal Heritage' },
        { url: 'https://images.unsplash.com/photo-1473133604314-b633d7b8222b?q=80&w=1920', caption: 'Misty Forests' },
        { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920', caption: 'Pristine Rivers' },
        { url: 'https://images.unsplash.com/photo-1523544545175-654859aab053?q=80&w=1920', caption: 'Golden Hour in the Valley' },
        { url: 'https://images.unsplash.com/photo-1590053165219-c8872cd92348?q=80&w=1920', caption: 'Living Root Bridges' }
    ];

    return (
        <div className="region-overview">
            {/* Section 1: Hero */}
            <HeroSection
                title={regionData.name || 'NORTHEAST INDIA'}
                tagline={regionData.tagline}
                subtitle="A land of eight sisters, bound by mountains, rivers, and a tapestry of over 200 tribes. Discover the unexplored paradise."
                heroImages={HERO_SLIDES} // Use new slides prop
                audioTrack={REGION_AUDIO['northeast']} // Background Audio
                badge={{ icon: 'public', text: 'The Hidden Jewel' }}
                size="large"
            />


            {/* Section 1.5: Description Split */}
            <DescriptionSection
                title="Welcome to Northeast India"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                images={HERO_SLIDES}
            />

            <DefiningThemesSection />

            <ShoppingSection />

            <StateAtAGlanceSection
                stateName="Northeast India"
                glance={{
                    states: "8 States",
                    landscapeType: "Mountains & Valleys",
                    languages: ["220+ Dialects", "English", "Hindi"],
                    population: "~50 Million",
                    area: "262,177 km²"
                }}
            />



            {/* Section 3: Shared Story */}
            {regionData.sharedStory?.paragraphs?.length > 0 && (
                <NarrativeBlock
                    paragraphs={regionData.sharedStory.paragraphs}
                    title={regionData.sharedStory.title || 'A Story of Connection'}
                    tone="philosophical"
                    align="center"
                />
            )}

            {/* Section 4: People */}
            {regionData.people && (
                <PeopleGallery
                    title={regionData.people.title || 'People of the Northeast'}
                    description={regionData.people.description}
                    portraits={regionData.people.portraits}
                />
            )}

            {/* Section 5: Cultural Threads */}
            {regionData.culturalThreads?.length > 0 && (
                <CulturalThreadsScroll
                    threads={regionData.culturalThreads}
                    title="Cultural Threads That Bind"
                />
            )}

            {/* Section 6: Contributions */}
            {regionData.contributions?.length > 0 && (
                <ContributionCards
                    contributions={regionData.contributions}
                    title="What the Northeast Gives India"
                />
            )}

            {/* Section 7: Ways to Explore */}
            {regionData.explorationCategories?.length > 0 && (
                <ExplorationGrid
                    categories={regionData.explorationCategories}
                    title="Ways to Explore"
                />
            )}

            {/* Section 8: Gateway to States */}
            {regionData.states?.length > 0 && (
                <GatewayGrid
                    items={regionData.states}
                    title="Explore the Eight Sisters"
                    basePath="/"
                    entityType="state"
                />
            )}
        </div>
    );
}

/**
 * FallbackOverview - Shown when API fails or data is unavailable
 * Contains static content for graceful degradation
 */
function FallbackOverview() {
    return (
        <div className="region-overview">
            <section className="region-hero">
                <div className="region-hero-content">
                    <div className="region-badge">
                        <span className="material-symbols-outlined">public</span>
                        <span>The Hidden Jewel</span>
                    </div>

                    <h1 className="region-title">NORTHEAST INDIA</h1>

                    <p className="region-subtitle">
                        A land of eight sisters, bound by mountains, rivers, and a tapestry of over 200 tribes. Discover the unexplored paradise.
                    </p>
                </div>
            </section>

            <section className="defining-themes-section">
                <h2 className="section-title">What Defines This Land</h2>
                <div className="themes-grid">
                    <div className="theme-card">
                        <div className="theme-icon">
                            <span className="material-symbols-outlined">forest</span>
                        </div>
                        <h3 className="theme-title">Living Landscapes</h3>
                        <p className="theme-description">Mountains that touch clouds, rivers that birth civilizations, and forests older than memory.</p>
                    </div>
                    <div className="theme-card">
                        <div className="theme-icon">
                            <span className="material-symbols-outlined">diversity_3</span>
                        </div>
                        <h3 className="theme-title">200+ Indigenous Communities</h3>
                        <p className="theme-description">Each hill, each valley harbors distinct languages, customs, and worldviews.</p>
                    </div>
                    <div className="theme-card">
                        <div className="theme-icon">
                            <span className="material-symbols-outlined">spa</span>
                        </div>
                        <h3 className="theme-title">Harmony with Nature</h3>
                        <p className="theme-description">Traditional knowledge systems that have sustained biodiversity for millennia.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
