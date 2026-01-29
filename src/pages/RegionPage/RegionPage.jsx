/**
 * RegionPage - Dynamic page for states and districts
 * Accessed via /:region route (e.g., /manipur, /imphal_west)
 * 
 * Attempts to load as state first, then falls back to district lookup
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, NavLink, useParams, useLocation } from 'react-router-dom';
import { getStateBySlug, getDistrictBySlug } from '../../api/apiService';
import {
    HeroSection,
    StateGlance,
    NarrativeBlock,
    CulturalThreadsScroll,
    ContributionCards,
    ExplorationGrid,
    GatewayGrid,
    VoicesSection
} from '../../components/RegionalPages';
import '../NortheastPage/NortheastPage.css'; // Reuse same styles

const HIDE_DELAY = 5000; // 5 seconds before auto-hide

/**
 * Convert URL slug back to display name
 * e.g., 'imphal_west' → 'Imphal West'
 */
function toDisplayName(slug) {
    return slug
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function RegionPage() {
    const { region } = useParams();
    const location = useLocation();
    const displayName = toDisplayName(region);

    // Check if we're at the root region path (no subpage)
    const isRootPath = location.pathname === `/${region}`;

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
                    <NavLink to={`/${region}`} end className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Overview
                    </NavLink>
                    <NavLink to={`/${region}/destinations`} className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Destinations
                    </NavLink>
                    <NavLink to={`/${region}/essentials`} className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Essentials
                    </NavLink>
                    <NavLink to={`/${region}/festivals`} className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Festivals
                    </NavLink>
                </div>
            </nav>

            {/* Content Area */}
            <main className="region-content">
                {isRootPath ? (
                    <RegionOverview regionSlug={region} displayName={displayName} />
                ) : (
                    <Outlet context={{ regionName: displayName, regionSlug: region }} />
                )}
            </main>
        </div>
    );
}

/**
 * RegionOverview - Fetches data and determines if this is a State or District page
 */
function RegionOverview({ regionSlug, displayName }) {
    const [data, setData] = useState(null);
    const [entityType, setEntityType] = useState(null); // 'state' or 'district'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                // Try to load as state first
                try {
                    const stateData = await getStateBySlug(regionSlug);
                    if (stateData) {
                        setData(stateData);
                        setEntityType('state');
                        return;
                    }
                } catch {
                    // Not a state, try district
                }

                // Try to load as district
                try {
                    const districtData = await getDistrictBySlug(regionSlug);
                    if (districtData) {
                        setData(districtData);
                        setEntityType('district');
                        return;
                    }
                } catch {
                    // Not a district either
                }

                // Neither found
                setError('Location not found');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [regionSlug]);

    // Loading state
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <span className="loading-text">Discovering {displayName}...</span>
            </div>
        );
    }

    // Error/Not found - show fallback
    if (error || !data) {
        return <FallbackOverview displayName={displayName} />;
    }

    // Render appropriate view based on entity type
    if (entityType === 'state') {
        return <StateOverview data={data} />;
    }

    return <DistrictOverview data={data} />;
}

/**
 * StateOverview - 8-section layout for state pages
 */
function StateOverview({ data }) {
    return (
        <div className="region-overview">
            {/* Section 1: Hero */}
            <HeroSection
                title={data.name}
                tagline={data.tagline}
                heroImage={data.heroImage}
                badge={{ icon: 'location_on', text: 'Northeast India' }}
                size="large"
            />

            {/* Section 2: At a Glance */}
            {data.glance && (
                <StateGlance glance={data.glance} />
            )}

            {/* Section 3: Land & Memory */}
            {data.landMemory?.narrative && (
                <NarrativeBlock
                    paragraphs={[data.landMemory.narrative]}
                    title="Land & Memory"
                    tone="philosophical"
                    align="center"
                />
            )}

            {/* Section 5: Cultural Life (Festivals as horizontal cards) */}
            {data.culturalLife?.festivals?.length > 0 && (
                <CulturalThreadsScroll
                    threads={data.culturalLife.festivals.map(f => ({
                        title: f.name,
                        insight: f.meaning,
                        imageUrl: null
                    }))}
                    title="Cultural Celebrations"
                />
            )}

            {/* Section 6: Contributions */}
            {data.contributions?.length > 0 && (
                <ContributionCards
                    contributions={data.contributions.map(c => ({
                        category: c.type,
                        title: c.title,
                        description: c.description
                    }))}
                    title="What This State Contributes"
                />
            )}

            {/* Section 7: Ways to Experience */}
            {data.experienceCategories?.length > 0 && (
                <ExplorationGrid
                    categories={data.experienceCategories}
                    title="Ways to Experience"
                />
            )}

            {/* Section 8: Explore Districts */}
            {data.districts?.length > 0 && (
                <GatewayGrid
                    items={data.districts}
                    title={`Explore ${data.name}'s Districts`}
                    basePath="/"
                    entityType="district"
                />
            )}
        </div>
    );
}

/**
 * DistrictOverview - Intimate 8-section layout for district pages
 */
function DistrictOverview({ data }) {
    return (
        <div className="region-overview">
            {/* Section 1: Hero */}
            <HeroSection
                title={data.districtName}
                tagline={data.tagline}
                subtitle={data.senseOfPlace?.oneLiner}
                heroImage={data.heroImage}
                badge={{ icon: 'place', text: data.stateName }}
                size="medium"
            />

            {/* Section 2: Context */}
            {data.context?.geographicNote && (
                <NarrativeBlock
                    paragraphs={[data.context.geographicNote]}
                    title="The Lay of the Land"
                    tone="informative"
                    align="left"
                />
            )}

            {/* Section 6: Possible Experiences */}
            {data.experiences?.length > 0 && (
                <ExplorationGrid
                    categories={data.experiences.map(e => ({
                        title: e.title,
                        description: e.note,
                        icon: e.icon || 'explore'
                    }))}
                    title="Experiences Await"
                />
            )}

            {/* Section 7: Voices & Stories */}
            {data.voicesAndStories && (
                <VoicesSection voices={data.voicesAndStories} />
            )}

            {/* Section 8: Nearby Districts */}
            {data.nearbyDistricts?.length > 0 && (
                <GatewayGrid
                    items={data.nearbyDistricts}
                    title="Continue Your Journey"
                    basePath="/"
                    entityType="district"
                />
            )}
        </div>
    );
}

/**
 * FallbackOverview - Shown when data can't be loaded
 */
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
                        Explore the rich culture, stunning destinations, and vibrant festivals of {displayName}.
                    </p>
                </div>
            </section>

            <section className="defining-themes-section">
                <h2 className="section-title">About {displayName}</h2>
                <p className="section-description" style={{ maxWidth: '600px', margin: '24px auto', textAlign: 'center' }}>
                    This page is being prepared with detailed content about {displayName}.
                    Check back soon for information about destinations, festivals, and local experiences.
                </p>
            </section>
        </div>
    );
}
