import React, { useMemo, useCallback, memo, useState, useEffect, useRef } from 'react';
import { useMapContext } from '../../context/MapContext';
import { generateId, STATE_COLORS, getParentShade } from './mapUtils';

/**
 * DistrictPath - Memoized component for individual district paths
 */
const DistrictPath = memo(({
    feature,
    pathD,
    districtId,
    districtName,
    normalizedStateName,
    fillColor,
    isSelected,
    onSelect,
    setTooltip,
    hideTooltip
}) => {
    // Inline click handler that calls the parent-provided memoized handler
    const handleClick = (e) => onSelect(feature, e);

    // CSS handles pointer-events based on visibility
    const handleMouseEnter = () => setTooltip({ content: districtName, visible: true });

    return (
        <path
            id={districtId}
            d={pathD}
            data-state={normalizedStateName}
            data-district={districtName}
            className={`district-path ${isSelected ? 'is-selected' : ''}`}
            onClick={handleClick}
            onMouseLeave={hideTooltip}
            onMouseEnter={handleMouseEnter}
            style={{
                fill: isSelected ? '#FBEAAF' : fillColor,
                stroke: '#4A4A4A',
                strokeWidth: isSelected ? 0.3 : 0.15,
            }}
        />
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.fillColor === nextProps.fillColor &&
        prevProps.pathD === nextProps.pathD &&
        prevProps.onSelect === nextProps.onSelect
    );
});

DistrictPath.displayName = 'DistrictPath';

/**
 * DistrictsLayer - Renders visible districts
 * UPDATED: Implements Graceful Exit (delayed culling) for smooth zoom-out transitions.
 */
export default function DistrictsLayer({ pathGenerator, allDistricts }) {
    const { viewState, selectDistrict, setTooltip, hideTooltip, selectedState, selectedDistrict } = useMapContext();

    // 1. Memoize Data Preparation (unchanged)
    const districtElements = useMemo(() => {
        if (!pathGenerator || !allDistricts || allDistricts.length === 0) return [];

        return allDistricts.map((feature) => {
            const districtName = feature.properties.DISTRICT;
            const stateName = feature.properties.ST_NM;

            // Generate stable ID
            const districtId = generateId('district', districtName);
            const pathD = pathGenerator(feature);

            if (!pathD) return null;

            const normalizedStateName = stateName === 'Arunanchal Pradesh' ? 'Arunachal Pradesh' : stateName;
            const effectiveStateName = districtName === 'Upper Siang' ? 'Arunachal Pradesh' : normalizedStateName;
            const parentColor = STATE_COLORS[effectiveStateName] || '#D8D4C5';
            const fillColor = getParentShade(parentColor, districtName);

            return {
                feature,
                pathD,
                districtId,
                districtName,
                normalizedStateName,
                fillColor,
                stateName
            };
        }).filter(Boolean);
    }, [allDistricts, pathGenerator]);

    // 2. Stable Callbacks (unchanged)
    const viewStateRef = useRef(viewState);
    useEffect(() => { viewStateRef.current = viewState; }, [viewState]);

    const handleDistrictClick = useCallback((feature, e) => {
        e.stopPropagation();
        if (viewStateRef.current !== 'state') return;
        selectDistrict(feature.properties.DISTRICT, feature);
    }, [selectDistrict]);

    // 3. Graceful Exit Logic (Hybrid Pattern)
    // We want INSTANT appearance on Zoom In, but DELAYED disappearance on Zoom Out.

    // State to control what is actually rendered
    const [renderingState, setRenderingState] = useState(selectedState);
    const prevSelectedState = useRef(selectedState);
    const fadeTimerRef = useRef(null);

    // PATTERN: Synchronous State Update for Zoom In (Derived State)
    // If we receive a new valid state, update IMMEDIATELY during render to avoid 1-frame gap.
    if (selectedState && selectedState !== renderingState) {
        setRenderingState(selectedState);
        prevSelectedState.current = selectedState;
        // Clear any pending fade-out
        if (fadeTimerRef.current) {
            clearTimeout(fadeTimerRef.current);
            fadeTimerRef.current = null;
        }
    }

    // Effect for Zoom Out (Delayed)
    useEffect(() => {
        // Only trigger if we are transitioning TO null (Zoom Out)
        // (Zoom In is handled synchronously above)
        if (!selectedState && prevSelectedState.current) {
            // We are zooming out. Keep the OLD state for 800ms.
            fadeTimerRef.current = setTimeout(() => {
                setRenderingState(null);
            }, 800);
        }

        // Update ref for next pass
        if (selectedState !== prevSelectedState.current) {
            prevSelectedState.current = selectedState;
        }

        return () => {
            if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
        };
    }, [selectedState]);

    // 4. View-Dependent Culling
    // Use `renderingState` to determine what to show
    const visibleDistricts = useMemo(() => {
        // If we have no state to render, show nothing.
        if (!renderingState) return [];

        const activeStateName = renderingState === 'Arunachal Pradesh' ? 'Arunanchal Pradesh' : renderingState;

        return districtElements.filter(d => {
            return d.stateName === activeStateName || d.normalizedStateName === renderingState;
        });
    }, [renderingState, districtElements]);

    if (!visibleDistricts || visibleDistricts.length === 0) {
        return <g className="districts-layer" />;
    }

    return (
        <g className="districts-layer">
            {visibleDistricts.map((data) => (
                <DistrictPath
                    key={data.districtId}
                    {...data}
                    isSelected={selectedDistrict === data.districtName}
                    onSelect={handleDistrictClick}
                    setTooltip={setTooltip}
                    hideTooltip={hideTooltip}
                />
            ))}
        </g>
    );
}
