import React, { memo } from 'react';
import { useMapContext } from '../../context/MapContext';
import { generateId, STATE_COLORS } from './mapUtils';

/**
 * StatePath - Memoized component for individual state paths
 * Prevents re-renders of all 35+ states when only one is selected.
 */
const StatePath = memo(({
    feature,
    pathD,
    stateId,
    stateName,
    isWestBengal,
    isSelected,
    onSelect,
    setTooltip,
    hideTooltip,
    viewState
}) => {

    // Handlers
    const handleClick = (e) => {
        e.stopPropagation();
        if (stateName === 'West Bengal') return;
        if (viewState !== 'default') return;
        onSelect(stateName, feature);
    };

    const handleMouseEnter = () => {
        if (viewState === 'default' && !isWestBengal) {
            setTooltip({ content: stateName, visible: true });
        }
    };

    // Determine basic classes - Visibility is handled by CSS (MapTransitions.css)
    const className = `state-path ${isWestBengal ? 'west-bengal' : ''} ${isSelected ? 'selected' : ''}`;

    return (
        <path
            id={stateId}
            d={pathD}
            className={className}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={hideTooltip}
            style={{
                fill: isSelected ? '#FBEAAF' : (STATE_COLORS[stateName] || '#e8f4ea'),
                stroke: '#000000',
                strokeWidth: isSelected ? 2 : 1,
            }}
        />
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.viewState === nextProps.viewState &&
        prevProps.pathD === nextProps.pathD
    );
});

StatePath.displayName = 'StatePath';

export default function StatesLayer({ pathGenerator, statesData }) {
    const { viewState, selectedState, selectState, setTooltip, hideTooltip } = useMapContext();

    if (!pathGenerator || !statesData) {
        return null;
    }

    return (
        <g className="states-layer">
            {statesData.features.map((feature) => {
                const stateName = feature.properties.ST_NM;
                const stateId = generateId('state', stateName);
                const isWestBengal = stateName === 'West Bengal';
                const isSelected = selectedState === stateName;
                const pathD = pathGenerator(feature);

                if (!pathD) return null;

                return (
                    <StatePath
                        key={stateId}
                        stateId={stateId}
                        stateName={stateName}
                        feature={feature}
                        pathD={pathD}
                        isWestBengal={isWestBengal}
                        isSelected={isSelected}
                        viewState={viewState}
                        onSelect={selectState}
                        setTooltip={setTooltip}
                        hideTooltip={hideTooltip}
                    />
                );
            })}
        </g>
    );
}
