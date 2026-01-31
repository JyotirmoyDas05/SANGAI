import { useEffect, useMemo, useRef, useCallback, useLayoutEffect, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { zoom, zoomIdentity } from 'd3-zoom';
import { useNavigate, useParams } from 'react-router-dom';
import { select } from 'd3-selection';
import { easeCubicInOut } from 'd3-ease';
import 'd3-transition'; // Required for .transition() to work with D3
import { useMapContext } from '../../context/MapContext';
import { preprocessGeoJSON } from './mapUtils';
import StatesLayer from './StatesLayer';
import DistrictsLayer from './DistrictsLayer';
import Tooltip from './Tooltip';
import rawStatesData from '../../MAP/NEW STATES.json';
import rawDistrictsData from '../../MAP/NEW DISTRICTS.json';
import gsap from 'gsap';
import './MapTransitions.css'; // Import GPU-accelerated transitions

const MAP_WIDTH = 900;
const MAP_HEIGHT = 700;
const PADDING = 40;

/**
 * Convert name to URL-safe slug (lowercase, spaces→underscores)
 */
function toUrlSlug(name) {
    return name.toLowerCase().replace(/\s+/g, '_');
}

// Bounds for Northeast India (including West Bengal)
const NE_BOUNDS = {
    west: 85.8,
    east: 97.41,
    south: 21.5,
    north: 29.46
};

export default function MapContainer() {
    const svgRef = useRef(null);
    const gRef = useRef(null);
    const zoomBehaviorRef = useRef(null);
    const isTransitioningRef = useRef(false); // Solution A: Transition guard
    const lastZoomCounterRef = useRef(0); // Track last processed zoomCounter to prevent double-run
    const isLoaded = true; // Map is considered loaded when component mounts
    const labelRef = useRef(null); // Ref for label animation

    const navigate = useNavigate();
    const {
        viewState,
        currentLabel,
        selectedState,
        selectedDistrict,
        zoomTarget,
        zoomCounter,
        goBack,
        selectState
    } = useMapContext();

    // Local state for sequenced label animation
    const [displayLabel, setDisplayLabel] = useState(currentLabel);

    /**
     * Handle Explore button click - navigate based on current selection
     */
    const handleExplore = useCallback(() => {
        if (selectedDistrict) {
            // District selected → navigate to /:district
            navigate(`/${toUrlSlug(selectedDistrict)}`);
        } else if (selectedState) {
            // State selected → navigate to /:state
            navigate(`/${toUrlSlug(selectedState)}`);
        } else {
            // No selection → navigate to /northeast
            navigate('/northeast');
        }
    }, [selectedState, selectedDistrict, navigate]);

    // Preprocess GeoJSON to fix winding order
    const statesData = useMemo(() => preprocessGeoJSON(rawStatesData), []);
    const districtsData = useMemo(() => preprocessGeoJSON(rawDistrictsData), []);

    // Calculate projection using known bounds
    const { pathGenerator, projection } = useMemo(() => {
        if (!statesData || !statesData.features || statesData.features.length === 0) {
            return { pathGenerator: null, projection: null };
        }

        const { west, east, south, north } = NE_BOUNDS;
        const centerLon = (west + east) / 2;
        const centerLat = (south + north) / 2;

        const availableWidth = MAP_WIDTH - PADDING * 2;
        const availableHeight = MAP_HEIGHT - PADDING * 2;

        let proj = geoMercator()
            .center([centerLon, centerLat])
            .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

        const nw = proj([west, north]);
        const se = proj([east, south]);

        if (nw && se) {
            const currentWidth = Math.abs(se[0] - nw[0]);
            const currentHeight = Math.abs(se[1] - nw[1]);

            const scaleX = availableWidth / currentWidth;
            const scaleY = availableHeight / currentHeight;
            const scaleFactor = Math.min(scaleX, scaleY);

            const newScale = proj.scale() * scaleFactor;

            proj = geoMercator()
                .center([centerLon, centerLat])
                .scale(newScale)
                .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
        }

        const pathGen = geoPath().projection(proj);

        return { pathGenerator: pathGen, projection: proj };
    }, [statesData]);

    // Get ALL districts - render all for DOM stability (CSS controls visibility)
    const allDistricts = useMemo(() => {
        if (!districtsData || !districtsData.features) return [];
        return districtsData.features;
    }, [districtsData]);

    // 1. Trigger OUT animation when context label changes
    useEffect(() => {
        if (!labelRef.current || currentLabel === displayLabel) return;

        // Kill existing tweens to prevent conflict
        gsap.killTweensOf(labelRef.current);

        gsap.to(labelRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => setDisplayLabel(currentLabel)
        });
    }, [currentLabel]);

    // 2. Trigger IN animation when local state updates (text actually changes in DOM)
    useEffect(() => {
        if (!labelRef.current) return;

        // Animate In: Slide Up + Fade In
        gsap.fromTo(labelRef.current,
            { y: 30, opacity: 0, scale: 0.95 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power3.out"
            }
        );
    }, [displayLabel]);

    // Initialize D3 Logic...

    // Initialize D3 Logic...

    // D3 ZOOM LOGIC (Pure Transform)
    // Runs on viewState/zoom change
    // Using simple transform allows CSS to handle opacity in parallel
    // D3 ZOOM LOGIC (Pure Transform)
    // Runs on viewState/zoom change
    // Using simple transform allows CSS to handle opacity in parallel
    // useLayoutEffect ensures the transform starts BEFORE the paint of the new view state
    useLayoutEffect(() => {
        if (!svgRef.current || !gRef.current) return;

        const svg = select(svgRef.current);
        const g = select(gRef.current);

        // Initialize zoom behavior if not already done
        if (!zoomBehaviorRef.current) {
            const zoomBehavior = zoom()
                .scaleExtent([0.5, 20])
                .on('zoom', (event) => {
                    if (gRef.current) {
                        // Directly set transform attribute for max performance (bypass D3 selection overhead if possible)
                        gRef.current.setAttribute('transform', event.transform.toString());
                    }
                });

            svg.call(zoomBehavior);

            // Disable default zoom interactions
            svg.on('dblclick.zoom', null);
            svg.on('wheel.zoom', null);

            zoomBehaviorRef.current = zoomBehavior;
        }

        const zoomBehavior = zoomBehaviorRef.current;
        if (!zoomBehavior || !pathGenerator || !projection) return;

        // CRITICAL: Skip duplicate zoom-in calls
        const isZoomIn = zoomTarget !== null;
        if (isZoomIn && zoomCounter === lastZoomCounterRef.current && zoomCounter !== 0) {
            return;
        }
        if (isZoomIn) {
            lastZoomCounterRef.current = zoomCounter;
        }

        // Apply Zoom Transform
        let targetTransform = zoomIdentity;
        let duration = 750;

        if (viewState === 'default') {
            targetTransform = zoomIdentity.translate(MAP_WIDTH / 2, MAP_HEIGHT / 2).scale(1).translate(-MAP_WIDTH / 2, -MAP_HEIGHT / 2);
        } else if (viewState === 'state' && selectedState) {
            // Find bounds of selected state... (Logic remains same, just simplified block)
            const feature = statesData?.features.find(f => f.properties.ST_NM === selectedState);
            if (feature) {
                const [[x0, y0], [x1, y1]] = pathGenerator.bounds(feature);
                const width = x1 - x0;
                const height = y1 - y0;
                const scale = 0.85 / Math.max(width / MAP_WIDTH, height / MAP_HEIGHT);
                const x = -(x0 + x1) / 2;
                const y = -(y0 + y1) / 2;
                targetTransform = zoomIdentity.translate(MAP_WIDTH / 2, MAP_HEIGHT / 2).scale(scale).translate(x, y);
            }
        } else if (viewState === 'district' && selectedDistrict) {
            const feature = districtsData?.features.find(f => f.properties.DISTRICT === selectedDistrict);
            if (feature) {
                const [[x0, y0], [x1, y1]] = pathGenerator.bounds(feature);
                const width = x1 - x0;
                const height = y1 - y0;
                const scale = 0.5 / Math.max(width / MAP_WIDTH, height / MAP_HEIGHT);
                const x = -(x0 + x1) / 2;
                const y = -(y0 + y1) / 2;
                targetTransform = zoomIdentity.translate(MAP_WIDTH / 2, MAP_HEIGHT / 2).scale(scale).translate(x, y);
            }
        }

        // Execute Zoom
        svg.transition()
            .duration(duration)
            .call(zoomBehavior.transform, targetTransform);

    }, [viewState, selectedState, selectedDistrict, zoomTarget, zoomCounter, statesData, districtsData, pathGenerator, projection]);




    // Sync Map with URL Params (External Control)
    const { stateId } = useParams();

    useEffect(() => {
        if (stateId && isLoaded && statesData && !selectedState) {
            // Find feature by name (assuming ID matches lowercase name)
            const feature = statesData.features.find(
                f => f.properties.NAME_1.toLowerCase() === stateId.toLowerCase()
            );

            if (feature) {
                console.log("Auto-selecting state from URL:", feature.properties.NAME_1);
                selectState(feature.properties.NAME_1, feature);
            }
        }
    }, [stateId, statesData, selectedState, selectState, isLoaded]);

    if (!isLoaded || !pathGenerator || !statesData) {
        return (
            <div className="map-loading">
                Loading map...
            </div>
        );
    }

    return (
        <div className="map-wrapper">
            {/* Back button and region label - positioned to full-width wrapper */}
            <button
                className={`back-button ${viewState !== 'default' ? 'visible' : ''}`}
                onClick={goBack}
            >
                ← Back
            </button>

            {/* Explore button - bottom-right corner, diagonal to Back */}
            <button
                className="explore-button"
                onClick={handleExplore}
            >
                Explore →
            </button>

            {/* Region Label - Animates on change */}
            <div className="region-label">
                <h1 ref={labelRef}>
                    {displayLabel}
                </h1>
            </div>

            {/* Map container - centered SVG */}
            <div
                className="map-container"
                data-view={viewState}
                data-selected-state={
                    selectedState === 'Arunanchal Pradesh' ? 'Arunachal Pradesh' : selectedState
                }
                data-selected-district={selectedDistrict}
                onMouseMove={(e) => {
                    const tooltip = document.querySelector('.custom-tooltip');
                    if (tooltip) {
                        tooltip.style.left = `${e.clientX}px`;
                        tooltip.style.top = `${e.clientY}px`;
                    }
                }}
            >
                <svg
                    ref={svgRef}
                    width={MAP_WIDTH}
                    height={MAP_HEIGHT}
                    viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                    className="map-svg"
                    style={{ background: 'transparent' }}
                >
                    <g ref={gRef}>
                        <StatesLayer
                            pathGenerator={pathGenerator}
                            statesData={statesData}
                        />

                        {/* Render ALL districts for DOM stability (CSS controls visibility)
                            This enables smooth CSS opacity transitions */}
                        <DistrictsLayer
                            pathGenerator={pathGenerator}
                            allDistricts={allDistricts}
                            selectedStateName={selectedState}
                        />
                    </g>
                </svg>

                <Tooltip />
            </div>
        </div>
    );
}
