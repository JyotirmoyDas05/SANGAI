import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const MapContext = createContext(null);

// View states: 'default' | 'state' | 'district'
const STORAGE_KEY = 'sangai_map_state';

// Helper to get saved state
const getSavedState = () => {
    try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.warn('Failed to load map state', e);
        return null;
    }
};

export function MapProvider({ children }) {
    // Initialize state from storage if available
    const savedState = getSavedState();

    // Current view state
    const [viewState, setViewState] = useState(savedState?.viewState || 'default');

    // Selected state and district
    const [selectedState, setSelectedState] = useState(savedState?.selectedState || null);
    const [selectedDistrict, setSelectedDistrict] = useState(savedState?.selectedDistrict || null);

    // Label shown at bottom-left
    const [currentLabel, setCurrentLabel] = useState(savedState?.currentLabel || 'Northeast India');

    // Zoom target feature (for calculating zoom bounds)
    const [zoomTarget, setZoomTarget] = useState(savedState?.zoomTarget || null);

    // Counter to force zoom effect re-trigger (incremented on each zoom action)
    // We increment if restored to ensure trigger calls effect
    const [zoomCounter, setZoomCounter] = useState((savedState?.zoomCounter || 0) + 1);

    // Store the state feature for when we go back from district view
    // Initialize from storage if available
    const stateFeatureRef = useRef(savedState?.stateFeature || null);

    // Persist state changes
    useEffect(() => {
        const stateToSave = {
            viewState,
            selectedState,
            selectedDistrict,
            currentLabel,
            zoomTarget,
            zoomCounter,
            stateFeature: stateFeatureRef.current
        };
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (e) {
            console.warn('Failed to save map state', e);
        }
    }, [viewState, selectedState, selectedDistrict, currentLabel, zoomTarget, zoomCounter]);

    // Select a state - transition from default to state view
    const selectState = useCallback((stateName, stateFeature) => {
        if (stateName === 'West Bengal') return; // West Bengal is not interactive

        // Set zoom target first (triggers D3 animation)
        setZoomTarget(stateFeature);
        stateFeatureRef.current = stateFeature;

        // Solution B: Defer DOM-changing state updates to next frame
        // This allows D3 animation to start before React mounts new components
        requestAnimationFrame(() => {
            setZoomCounter(c => c + 1);
            setSelectedState(stateName);
            setSelectedDistrict(null);
            setCurrentLabel(stateName);
            setViewState('state');
        });
    }, []);

    // Select a district - transition from state to district view
    const selectDistrict = useCallback((districtName, districtFeature) => {
        // Set zoom target first (triggers D3 animation)
        setZoomTarget(districtFeature);

        // Solution B: Defer DOM-changing state updates to next frame
        requestAnimationFrame(() => {
            setZoomCounter(c => c + 1);
            setSelectedDistrict(districtName);
            setCurrentLabel(districtName);
            setViewState('district');
        });
    }, []);

    // Go back one level
    const goBack = useCallback(() => {
        if (viewState === 'district') {
            // Go back to state view - restore the state feature as zoom target
            setZoomTarget(stateFeatureRef.current);

            // Solution B: Defer DOM-changing state updates
            requestAnimationFrame(() => {
                setZoomCounter(c => c + 1);
                setSelectedDistrict(null);
                setCurrentLabel(selectedState);
                setViewState('state');
            });
        } else if (viewState === 'state') {
            // Go back to default view
            setZoomTarget(null);

            // Solution B: Defer DOM-changing state updates
            requestAnimationFrame(() => {
                setZoomCounter(c => c + 1);
                setSelectedState(null);
                setSelectedDistrict(null);
                setCurrentLabel('Northeast India');
                stateFeatureRef.current = null;
                setViewState('default');
            });
        }
    }, [viewState, selectedState]);

    // Reset to default view
    const resetView = useCallback(() => {
        setViewState('default');
        setSelectedState(null);
        setSelectedDistrict(null);
        setCurrentLabel('Northeast India');
        setZoomTarget(null);
        stateFeatureRef.current = null;
        setZoomCounter(c => c + 1);
        sessionStorage.removeItem(STORAGE_KEY); // Clear storage on explicit reset
    }, []);

    // Tooltip State
    const [tooltipData, setTooltipData] = useState({ content: '', x: 0, y: 0, visible: false });

    // Show Tooltip with content and position
    const setTooltip = useCallback((data) => {
        setTooltipData(prev => ({ ...prev, ...data, visible: true }));
    }, []);

    const hideTooltip = useCallback(() => {
        setTooltipData(prev => ({ ...prev, visible: false }));
    }, []);

    return (
        <MapContext.Provider
            value={{
                viewState,
                selectedState,
                selectedDistrict,
                currentLabel,
                zoomTarget,
                zoomCounter,
                selectState,
                selectDistrict,
                goBack,
                resetView,
                tooltipData,
                setTooltip,
                hideTooltip,
            }}
        >
            {children}
        </MapContext.Provider>
    );
}

export function useMapContext() {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMapContext must be used within a MapProvider');
    }
    return context;
}

