/**
 * RegionPage - Dynamic page for states and districts
 * Accessed via /:region route (e.g., /manipur, /imphal_west)
 * 
 * Attempts to load as state first, then falls back to district lookup
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, NavLink, useParams, useLocation } from 'react-router-dom';
import { getRegionBySlug, getStateBySlug, getDistrictBySlug } from '../../api/apiService';
import { getAudioForRegion } from '../../config/audioMapping';
import {
    HeroSection,
    DescriptionSection,
    StateAtAGlanceSection,
    NarrativeBlock,
    CulturalThreadsScroll,
    ContributionCards,
    ExplorationGrid,
    GatewayGrid,
    DefiningThemesSection,
    ShoppingSection,
    VoicesSection
} from '../../components/RegionalPages';
import '../NortheastPage/NortheastPage.css'; // Reuse same styles

const HIDE_DELAY = 3000; // 3 seconds before auto-hide

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
    const isSubPageFullWidth = ['/destinations', '/festivals', '/essentials'].some(path => location.pathname.includes(path));
    const useFullWidth = isRootPath || isSubPageFullWidth;

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
                    <NavLink to={`/northeast/${region}`} end className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Overview
                    </NavLink>
                    <NavLink to={`/northeast/${region}/places`} className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Places
                    </NavLink>
                    <NavLink to={`/northeast/${region}/festivals`} className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
                        Festivals
                    </NavLink>
                    <NavLink to={`/northeast/${region}/homestays`} className={({ isActive }) => `floating-nav-item ${isActive ? 'active' : ''}`}>
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
    // Placeholder Slides (Northeast Hero + 6 Unsplash)
    const [heroSlides, setHeroSlides] = useState([
        { url: 'https://images.unsplash.com/photo-1571676674483-e18e87d0c3bc?q=80&w=1920', caption: 'Tea Gardens of Assam' },
        { url: 'https://images.unsplash.com/photo-1626084288019-3e3902319ec8?q=80&w=1920', caption: 'Majestic Himalayas' },
        { url: 'https://images.unsplash.com/photo-1598555813876-b6d3763f350c?q=80&w=1920', caption: 'Cascading Waterfalls' },
        { url: 'https://images.unsplash.com/photo-1533241517006-be2f985b8829?q=80&w=1920', caption: 'Vibrant Tribal Heritage' },
        { url: 'https://images.unsplash.com/photo-1473133604314-b633d7b8222b?q=80&w=1920', caption: 'Misty Forests' },
        { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920', caption: 'Pristine Rivers' },
        { url: 'https://images.unsplash.com/photo-1523544545175-654859aab053?q=80&w=1920', caption: 'Golden Hour in the Valley' },
        { url: 'https://images.unsplash.com/photo-1590053165219-c8872cd92348?q=80&w=1920', caption: 'Living Root Bridges' }
    ]);

    // Fetch primary Northeast image to replace the first placeholder slot if available
    // OR if generic region page, load its images
    useEffect(() => {
        // If we have specific data with heroImages, use those
        if (data && data.heroImages && data.heroImages.length > 0) {
            setHeroSlides(data.heroImages);
            return;
        }

        // Otherwise fallback to Northeast defaults (fetching Northeast image 0)
        async function fetchPlaceholder() {
            try {
                const regionData = await getRegionBySlug('northeast');
                if (regionData?.heroImages?.[0]) {
                    setHeroSlides(prev => [regionData.heroImages[0], ...prev.slice(1)]);
                }
            } catch (err) {
                console.error("Failed to fetch northeast placeholder image", err);
            }
        }

        // Only fetch placeholder if we don't have data images
        if (!data || !data.heroImages || data.heroImages.length === 0) {
            fetchPlaceholder();
        }
    }, [data]);

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
        return <StateOverview data={data} heroSlides={heroSlides} />;
    }

    return <DistrictOverview data={data} heroSlides={heroSlides} />;
}

/**
 * StateOverview - 8-section layout for state pages
 */
function StateOverview({ data, heroSlides }) {
    return (
        <div className="region-overview">
            {/* Section 1: Hero */}
            <HeroSection
                title={data.name}
                tagline={data.tagline}
                heroImages={heroSlides} // Use slideshow
                audioTrack={getAudioForRegion(data.slug)} // Audio based on state slug
                badge={{ icon: 'location_on', text: 'Northeast India' }}
                size="large"
            />

            {/* Description Section */}
            <DescriptionSection
                title={`Welcome to ${data.name}`}
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                images={heroSlides}
            />

            <DefiningThemesSection themes={data?.definingThemes} />

            <ShoppingSection title={`Buy A Piece of ${data.name}`} />

            {/* Section 2: At a Glance (Redesigned) */}
            {data.glance && (
                <StateAtAGlanceSection glance={data.glance} stateName={data.name} />
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

            {/* Section 5: Cultural Threads (Same as /northeast) */}
            <CulturalThreadsScroll
                threads={[
                    {
                        title: 'Festival Rhythms',
                        insight: 'From Hornbill to Bihu, festivals here are not celebrations but the heartbeat of communities',
                        imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000'
                    },
                    {
                        title: 'Music as Memory',
                        insight: 'Every song carries a story, every dance a prayer—music is how history travels through time',
                        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000'
                    },
                    {
                        title: 'Woven Stories',
                        insight: 'In the patterns of shawls and fabrics, you can read the identity of entire communities',
                        imageUrl: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=1000'
                    },
                    {
                        title: 'Food as Climate',
                        insight: 'Fermented, smoked, dried—preservation techniques tell of monsoons and winters endured',
                        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000'
                    },
                    {
                        title: 'Wild Sanctuaries',
                        insight: 'Home to rare species and vast forests, nature here is not just a resource but a living deity',
                        imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&q=80&w=1000'
                    }
                ]}
                title="Cultural Threads That Bind"
            />

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
                    basePath={`/northeast/${region}`}
                    entityType="district"
                />
            )}
        </div>
    );
}

/**
 * DistrictOverview - Intimate 8-section layout for district pages
 */
function DistrictOverview({ data, heroSlides }) {
    return (
        <div className="region-overview">
            {/* Section 1: Hero */}
            <HeroSection
                title={data.districtName}
                tagline={data.tagline}
                subtitle={data.senseOfPlace?.oneLiner}
                heroImages={heroSlides} // Use slideshow
                audioTrack={getAudioForRegion(null, data.stateName?.toLowerCase().replace(/ /g, '_'))} // Use parent state audio
                badge={{ icon: 'place', text: data.stateName }}
                size="medium" // This will now take full height due to overrides if 'region-full-content' is active
            />

            {/* Description Section */}
            <DescriptionSection
                title={`Welcome to ${data.districtName}`}
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                images={heroSlides}
            />

            <DefiningThemesSection themes={data?.definingThemes} />

            {/* At a Glance Section */}
            <StateAtAGlanceSection
                glance={{
                    capital: data.districtName,
                    landscapeType: data.context?.geographicNote?.slice(0, 50) || 'Hilly Terrain',
                    languages: ['Local Dialects', 'English'],
                    population: data.population || 'N/A',
                    area: data.area || 'N/A'
                }}
                stateName={data.stateName}
                coordinates={data.location ? { lat: data.location.lat, lng: data.location.lng } : null}
                locationName={data.districtName}
            />

            <ShoppingSection
                title={`Buy A Piece of ${data.districtName}`}
                subtitle="Unique, Eco Friendly, Natural Products"
            />

            {/* Land & Memory Section */}
            <NarrativeBlock
                paragraphs={[
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                ]}
                title="Land & Memory"
                tone="philosophical"
                align="center"
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
                    basePath="/northeast"
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
