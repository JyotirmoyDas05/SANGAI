import { useEffect, useMemo, useRef, useCallback } from 'react';
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
    }, [navigate, selectedState, selectedDistrict]);

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

    // D3 OPACITY TRANSITIONS
    // These run when viewState changes (which is deferred by RAF)
    // Use setTimeout to stagger slightly after zoom starts (avoids CPU spike)
    useEffect(() => {
        if (!svgRef.current) return;

        const svg = select(svgRef.current);
        const TRANSITION_DURATION = 1000;

        // Delay opacity transitions by 50ms to avoid competing with zoom calculations
        const timeoutId = setTimeout(() => {
            const DISTRICT_DELAY = 300;

            if (viewState === 'default') {
                // DEFAULT VIEW: All states visible, all districts hidden
                svg.selectAll('.state-path')
                    .transition('opacity')
                    .duration(TRANSITION_DURATION)
                    .ease(easeCubicInOut)
                    .style('opacity', function () {
                        return select(this).classed('west-bengal') ? 0.3 : 1;
                    });

                // Optimization: Only transition districts that are currently visible (opacity > 0)
                // If they are already 0, no need to create a transition
                svg.selectAll('.district-path')
                    .filter(function () {
                        return this.style.opacity > 0;
                    })
                    .transition('opacity')
                    .duration(600)
                    .ease(easeCubicInOut)
                    .style('opacity', 0);

            } else if (viewState === 'state') {
                // STATE VIEW: Non-selected states fade out, selected stays visible
                svg.selectAll('.state-path')
                    .transition('opacity')
                    .duration(TRANSITION_DURATION)
                    .ease(easeCubicInOut)
                    .style('opacity', function () {
                        const pathId = select(this).attr('id') || '';
                        const isSelected = pathId.includes(selectedState?.toLowerCase().replace(/\s+/g, '-'));
                        return isSelected ? 1 : 0;
                    });

                // Optimization: Target districts of selected state (to show) 
                // AND currently visible districts (to hide, if any)
                svg.selectAll('.district-path')
                    .filter(function () {
                        const districtState = select(this).attr('data-state');
                        const isTarget = districtState === selectedState;
                        const isVisible = this.style.opacity > 0;
                        return isTarget || isVisible;
                    })
                    .transition('opacity')
                    .duration(TRANSITION_DURATION)
                    .ease(easeCubicInOut)
                    .style('opacity', function () {
                        const districtState = select(this).attr('data-state');
                        return districtState === selectedState ? 1 : 0;
                    });

            } else if (viewState === 'district') {
                // DISTRICT VIEW: All states hidden, only selected district visible
                svg.selectAll('.state-path')
                    .transition('opacity')
                    .duration(TRANSITION_DURATION)
                    .ease(easeCubicInOut)
                    .style('opacity', 0);

                // Optimization: Target selected district (to show)
                // AND currently visible districts (to hide others)
                svg.selectAll('.district-path')
                    .filter(function () {
                        const districtName = select(this).attr('data-district');
                        const isTarget = districtName === selectedDistrict;
                        const isVisible = this.style.opacity > 0;
                        return isTarget || isVisible;
                    })
                    .transition('opacity')
                    .duration(TRANSITION_DURATION)
                    .ease(easeCubicInOut)
                    .style('opacity', function () {
                        const districtName = select(this).attr('data-district');
                        return districtName === selectedDistrict ? 1 : 0;
                    });
            }

        }, 50);

        return () => clearTimeout(timeoutId);

    }, [viewState, selectedState, selectedDistrict]);

    // Initialize d3-zoom and handle transitions
    // Combined into a single effect to ensure proper initialization
    useEffect(() => {
        if (!svgRef.current || !gRef.current) return;

        const svg = select(svgRef.current);
        const g = select(gRef.current);

        // Initialize zoom behavior if not already done
        if (!zoomBehaviorRef.current) {
            const zoomBehavior = zoom()
                .scaleExtent([0.5, 20])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform.toString());
                });

            svg.call(zoomBehavior);

            // Disable default zoom interactions (we only want programmatic zoom)
            svg.on('dblclick.zoom', null);
            svg.on('wheel.zoom', null);

            zoomBehaviorRef.current = zoomBehavior;
        }


        const zoomBehavior = zoomBehaviorRef.current;
        if (!zoomBehavior || !pathGenerator || !projection) return;

        // CRITICAL: Skip if this zoomCounter was already processed FOR ZOOM-IN only
        // This prevents the effect from re-running when viewState changes (RAF pattern)
        // But we ALWAYS process zoom-out to default (when zoomTarget is null)
        const isZoomIn = zoomTarget !== null;
        if (isZoomIn && zoomCounter === lastZoomCounterRef.current && zoomCounter !== 0) {
            return; // Already processed this zoom-in action
        }
        if (isZoomIn) {
            lastZoomCounterRef.current = zoomCounter;
        }

        // Check zoomTarget FIRST (fixes RAF deferral timing issue)
        // zoomTarget is set immediately, viewState is deferred via RAF
        if (zoomTarget) {
            // Calculate bounds for the target feature
            let x0, y0, x1, y1;

            // Try using pathGenerator.bounds first
            const bounds = pathGenerator.bounds(zoomTarget);
            [[x0, y0], [x1, y1]] = bounds;

            // Check if bounds are valid
            const isValidBounds =
                isFinite(x0) && isFinite(y0) && isFinite(x1) && isFinite(y1) &&
                x1 > x0 && y1 > y0 &&
                Math.abs(x1 - x0) < MAP_WIDTH * 10 &&
                Math.abs(y1 - y0) < MAP_HEIGHT * 10;

            if (!isValidBounds) {
                // Calculate bounds manually from coordinates
                const coords = zoomTarget.geometry.coordinates;
                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

                function processCoords(c) {
                    if (typeof c[0] === 'number' && typeof c[1] === 'number') {
                        const projected = projection(c);
                        if (projected) {
                            minX = Math.min(minX, projected[0]);
                            maxX = Math.max(maxX, projected[0]);
                            minY = Math.min(minY, projected[1]);
                            maxY = Math.max(maxY, projected[1]);
                        }
                    } else if (Array.isArray(c)) {
                        c.forEach(processCoords);
                    }
                }
                processCoords(coords);

                x0 = minX; y0 = minY; x1 = maxX; y1 = maxY;
            }

            // Calculate zoom transform
            const dx = x1 - x0;
            const dy = y1 - y0;
            const cx = (x0 + x1) / 2;
            const cy = (y0 + y1) / 2;

            // Determine zoom type from target feature properties (not viewState, which may be deferred)
            // District features have a DISTRICT property, state features only have ST_NM
            const isDistrictZoom = zoomTarget.properties && zoomTarget.properties.DISTRICT;
            const padding = isDistrictZoom ? 30 : 40;
            const scaleFactor = isDistrictZoom ? 0.97 : 0.93;

            const scale = scaleFactor * Math.min(
                MAP_WIDTH / (dx + padding * 2),
                MAP_HEIGHT / (dy + padding * 2)
            );
            const clampedScale = Math.max(Math.min(scale, 15), 1);

            const tx = MAP_WIDTH / 2 - clampedScale * cx;
            const ty = MAP_HEIGHT / 2 - clampedScale * cy;

            const newTransform = zoomIdentity.translate(tx, ty).scale(clampedScale);

            isTransitioningRef.current = true;
            svg.transition('zoom')  // Named transition to avoid conflict with opacity
                .duration(1500)
                .ease(easeCubicInOut)
                .call(zoomBehavior.transform, newTransform)
                .on('end', () => {
                    isTransitioningRef.current = false;
                });
        } else if (viewState === 'default') {
            // Reset to identity transform (no zoom) - only when no target
            isTransitioningRef.current = true;
            svg.transition('zoom')  // Named transition to avoid conflict with opacity
                .duration(1500)
                .ease(easeCubicInOut)
                .call(zoomBehavior.transform, zoomIdentity)
                .on('end', () => {
                    isTransitioningRef.current = false;
                });
        }

        // Cleanup function - only remove zoom handlers when component unmounts
        return () => {
            // Don't clear zoomBehaviorRef here, only on unmount
        };
    }, [viewState, zoomTarget, zoomCounter, pathGenerator, projection]);


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

            <div className="region-label">
                {currentLabel}
            </div>

            {/* Map container - centered SVG */}
            <div
                className="map-container"
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
