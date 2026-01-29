import React, { useMemo } from 'react';
import { useMapContext } from '../../context/MapContext';
import { generateId, STATE_COLORS, getParentShade } from './mapUtils';

/**
 * DistrictsLayer - Renders ALL districts always for CSS transition stability
 * 
 * CRITICAL: For CSS transitions to work, DOM elements must EXIST before
 * the class change. We render ALL districts and use CSS classes to control
 * visibility (opacity 0/1) rather than conditional rendering.
 */
export default function DistrictsLayer({ pathGenerator, allDistricts, selectedStateName }) {
    const { viewState, selectedDistrict, selectDistrict, setTooltip, hideTooltip } = useMapContext();

    // Memoize the expensive path generation and data preparation
    // This prevents recalculating 700+ paths on every render (especially during zoom)
    const districtElements = useMemo(() => {
        if (!pathGenerator || !allDistricts || allDistricts.length === 0) return [];

        return allDistricts.map((feature) => {
            const districtName = feature.properties.DISTRICT;
            const stateName = feature.properties.ST_NM;
            const districtId = generateId('district', districtName);
            const pathD = pathGenerator(feature);

            if (!pathD) return null;

            // Handle the Arunachal Pradesh name mismatch in GeoJSON
            const normalizedStateName = stateName === 'Arunanchal Pradesh'
                ? 'Arunachal Pradesh'
                : stateName;

            const parentColor = STATE_COLORS[stateName] || '#e8f4ea';
            const fillColor = getParentShade(parentColor, districtName);

            return {
                feature,
                pathD,
                districtId,
                districtName,
                stateName,
                normalizedStateName,
                fillColor
            };
        }).filter(Boolean);
    }, [allDistricts, pathGenerator]);

    // Always render the group, even if empty (maintains DOM structure)
    if (!districtElements || districtElements.length === 0) {
        return <g className="districts-layer" />;
    }

    const handleDistrictClick = (feature, e) => {
        e.stopPropagation();

        // Only allow clicks in state view
        if (viewState !== 'state') return;

        const districtName = feature.properties.DISTRICT;
        selectDistrict(districtName, feature);
    };

    return (
        <g className="districts-layer">
            {districtElements.map((data) => {
                const { feature, pathD, districtId, districtName, normalizedStateName, fillColor } = data;

                // Dynamic checks happen during render (cheap compared to path generation)
                const isSelected = selectedDistrict === districtName;
                const belongsToSelectedState = selectedStateName &&
                    normalizedStateName === selectedStateName;

                // Build CSS classes for visibility:
                // - 'visible': District belongs to selected state AND we're in state/district view
                // - 'hidden': In district view and this is not the selected district
                // - (default): No class = opacity:0 as per CSS base state
                let visibilityClass = '';

                if (viewState === 'state' && belongsToSelectedState) {
                    // In state view, show all districts of selected state
                    visibilityClass = 'visible';
                } else if (viewState === 'district') {
                    if (isSelected) {
                        // Selected district is visible
                        visibilityClass = 'visible';
                    } else if (belongsToSelectedState) {
                        // Other districts of same state - hidden
                        visibilityClass = 'hidden';
                    }
                    // Districts from other states stay at base opacity:0
                }

                return (
                    <path
                        key={districtId}
                        id={districtId}
                        d={pathD} // Validated pre-calculated path
                        data-state={normalizedStateName}
                        data-district={districtName}
                        className={`district-path ${isSelected ? 'selected' : ''} ${visibilityClass}`}
                        onClick={(e) => handleDistrictClick(feature, e)}
                        // Single onMouseLeave handler
                        onMouseLeave={() => hideTooltip()}
                        onMouseEnter={() => {
                            // Only show tooltip for visible districts
                            if (visibilityClass === 'visible') {
                                setTooltip({ content: districtName, visible: true });
                            }
                        }}
                        style={{
                            fill: isSelected ? '#34ab48' : fillColor,
                            stroke: '#000000',
                            strokeWidth: isSelected ? 0.25 : 0.15,
                        }}
                    >
                    </path>
                );
            })}
        </g>
    );
}
