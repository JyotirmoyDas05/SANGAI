/**
 * PlacesView - Displays places based on hierarchy level
 * Reads stateSlug and districtSlug from route params to determine scope
 */
import { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import './DestinationsView.css'; // Reuse destinations view styles

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function PlacesView() {
    const { stateSlug, districtSlug } = useParams();
    const context = useOutletContext();

    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scope, setScope] = useState('northeast');

    useEffect(() => {
        async function fetchPlaces() {
            try {
                setLoading(true);

                // Build API URL based on hierarchy level
                let apiUrl = `${API_BASE}/northeast`;
                if (stateSlug && districtSlug) {
                    apiUrl += `/${stateSlug}/${districtSlug}/places`;
                    setScope('district');
                } else if (stateSlug) {
                    apiUrl += `/${stateSlug}/places`;
                    setScope('state');
                } else {
                    apiUrl += '/places';
                    setScope('northeast');
                }

                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.success) {
                    setPlaces(data.data);
                } else {
                    throw new Error(data.message || 'Failed to fetch places');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPlaces();
    }, [stateSlug, districtSlug]);

    // Determine title based on scope
    const getTitle = () => {
        if (scope === 'district' && context?.districtName) {
            return `Places in ${context.districtName}`;
        }
        if (scope === 'state' && context?.stateName) {
            return `Places in ${context.stateName}`;
        }
        return 'Places Across Northeast India';
    };

    if (loading) {
        return (
            <div className="destinations-view">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <span className="loading-text">Loading places...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="destinations-view">
                <div className="error-message">
                    <span className="material-symbols-outlined">error</span>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="destinations-view">
            <header className="destinations-header">
                <h1 className="destinations-title">{getTitle()}</h1>
                <p className="destinations-subtitle">
                    {places.length} places to explore
                </p>
            </header>

            <div className="destinations-grid">
                {places.map((place) => (
                    <PlaceCard key={place._id} place={place} />
                ))}
            </div>

            {places.length === 0 && (
                <div className="empty-state">
                    <span className="material-symbols-outlined">landscape</span>
                    <h3>No places found</h3>
                    <p>Check back later for more destinations.</p>
                </div>
            )}
        </div>
    );
}

function PlaceCard({ place }) {
    const imageUrl = place.images?.[0] || 'https://images.unsplash.com/photo-1571676674483-e18e87d0c3bc?w=400';

    return (
        <div className="destination-card">
            <div className="destination-image">
                <img src={imageUrl} alt={place.name} loading="lazy" />
                <div className="destination-type-badge">
                    <span className="material-symbols-outlined">
                        {place.type === 'waterfall' ? 'water_drop' :
                            place.type === 'temple' ? 'temple_hindu' :
                                place.type === 'lake' ? 'water' :
                                    place.type === 'forest' ? 'forest' : 'landscape'}
                    </span>
                    {place.type}
                </div>
            </div>
            <div className="destination-content">
                <h3 className="destination-name">{place.name}</h3>
                <p className="destination-location">
                    <span className="material-symbols-outlined">location_on</span>
                    {place.districtId?.districtName || 'Northeast India'}
                </p>
                {place.description && (
                    <p className="destination-description">
                        {place.description.substring(0, 100)}...
                    </p>
                )}
            </div>
        </div>
    );
}
