/**
 * DistrictPage - Page for district-level in hierarchy
 * Accessed via /northeast/:stateSlug/:districtSlug
 * 
 * Provides district details and content views
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, NavLink, useParams, useLocation, useOutletContext } from 'react-router-dom';
import { getDistrictBySlug } from '../../api/apiService';
import { getAudioForRegion } from '../../config/audioMapping';
import {
    HeroSection,
    DescriptionSection,
    StateAtAGlanceSection,
    NarrativeBlock,
    DefiningThemesSection,
    ShoppingSection,
    ExplorationGrid,
    GatewayGrid
} from '../../components/RegionalPages';
import '../NortheastPage/NortheastPage.css';

const HIDE_DELAY = 3000;

function toDisplayName(slug) {
    return slug
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function DistrictPage() {
    const { stateSlug, districtSlug } = useParams();
    const location = useLocation();
    const parentContext = useOutletContext(); // From StatePage
    const displayName = toDisplayName(districtSlug);

    // Check if at root district path
    const basePath = `/northeast/${stateSlug}/${districtSlug}`;
    const isRootPath = location.pathname === basePath;
    // Always use full width for district pages and their children
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
                    <DistrictOverview
                        stateSlug={stateSlug}
                        districtSlug={districtSlug}
                        displayName={displayName}
                        stateName={parentContext?.stateName}
                    />
                ) : (
                    <Outlet context={{ stateSlug, districtSlug, stateName: parentContext?.stateName, districtName: displayName }} />
                )}
            </main>
        </div>
    );
}

/**
 * DistrictOverview - Default content for district page
 */
function DistrictOverview({ stateSlug, districtSlug, displayName, stateName }) {
    const [data, setData] = useState(null);
    const [siblingDistricts, setSiblingDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Fetch district data
                const districtData = await getDistrictBySlug(districtSlug);
                setData(districtData);

                // Fetch all sibling districts from the parent state API
                const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
                const stateResponse = await fetch(`${API_BASE}/northeast/${stateSlug}`);
                const stateResult = await stateResponse.json();

                if (stateResult.success && stateResult.data.districts) {
                    // Filter out current district from the list
                    const siblings = stateResult.data.districts.filter(
                        d => d.slug !== districtSlug
                    );
                    setSiblingDistricts(siblings);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [districtSlug, stateSlug]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <span className="loading-text">Discovering {displayName}...</span>
            </div>
        );
    }

    if (error || !data) {
        return <FallbackOverview displayName={displayName} stateName={stateName} />;
    }

    // Priority: New 'heroImages' > Legacy 'images.hero' > Legacy 'heroImage' > Default
    let heroSlides = [];

    if (data.heroImages && data.heroImages.length > 0) {
        heroSlides = data.heroImages;
    } else if (data.images?.hero?.length > 0) {
        heroSlides = data.images.hero.map(url => ({ url, caption: displayName }));
    } else {
        heroSlides = [
            { url: data.heroImage?.url || 'https://images.unsplash.com/photo-1571676674483-e18e87d0c3bc?q=80&w=1920', caption: displayName }
        ];
    }

    return (
        <div className="region-overview">
            <HeroSection
                title={data.districtName}
                tagline={data.tagline}
                subtitle={data.senseOfPlace?.oneLiner}
                heroImages={heroSlides}
                audioTrack={getAudioForRegion(null, data.stateName?.toLowerCase().replace(/ /g, '_'))}
                badge={{ icon: 'place', text: data.stateName || stateName }}
                size="medium"
            />

            <DescriptionSection
                title={`Welcome to ${data.districtName}`}
                description={data.description?.content || `Explore the unique culture and natural beauty of ${data.districtName}.`}
                images={heroSlides}
            />

            <DefiningThemesSection
                themes={data.definingThemes?.map(t => ({
                    icon: t.icon || 'explore',
                    title: t.title,
                    description: t.description
                }))}
            />

            <StateAtAGlanceSection
                glance={{
                    capital: data.districtName,
                    landscapeType: data.context?.landscapeType || 'Varied Terrain',
                    languages: ['Local Dialects', 'English'],
                    population: data.population || 'N/A',
                    area: data.area || 'N/A'
                }}
                stateName={data.stateName}
                coordinates={data.location ? { lat: data.location.lat, lng: data.location.lng } : null}
                locationName={data.districtName}
            />

            <ShoppingSection
                title={`Crafts of ${data.districtName}`}
                subtitle="Unique, Eco-Friendly, Natural Products"
            />

            {data.landAndMemory && (
                <NarrativeBlock
                    paragraphs={[data.landAndMemory.content]}
                    title={data.landAndMemory.title || "Land & Memory"}
                    tone="philosophical"
                    align="center"
                />
            )}

            {data.experiences?.length > 0 && (
                <ExplorationGrid
                    categories={data.experiences.map(e => ({
                        title: e.title,
                        description: e.description,
                        icon: e.type || 'explore'
                    }))}
                    title="Experiences Await"
                />
            )}

            {/* Show all sibling districts from the parent state */}
            {siblingDistricts.length > 0 && (
                <GatewayGrid
                    items={siblingDistricts.map(d => ({
                        ...d,
                        path: `/northeast/${stateSlug}/${d.slug}`
                    }))}
                    title={`Explore More of ${stateName || 'This State'}`}
                    description={`Discover all ${siblingDistricts.length} other districts in ${stateName || 'this state'}`}
                    basePath={`/northeast/${stateSlug}`}
                    entityType="district"
                />
            )}
        </div>
    );
}

function FallbackOverview({ displayName, stateName }) {
    return (
        <div className="region-overview">
            <section className="region-hero">
                <div className="region-hero-content">
                    <div className="region-badge">
                        <span className="material-symbols-outlined">place</span>
                        <span>{stateName || 'Northeast India'}</span>
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
