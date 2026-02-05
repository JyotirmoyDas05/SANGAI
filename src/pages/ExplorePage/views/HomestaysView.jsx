/**
 * HomestaysView - Displays homestays based on hierarchy level
 */
import { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import './DestinationsView.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function HomestaysView() {
    const { stateSlug, districtSlug } = useParams();
    const context = useOutletContext();

    const [homestays, setHomestays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scope, setScope] = useState('northeast');

    useEffect(() => {
        async function fetchHomestays() {
            try {
                setLoading(true);

                let apiUrl = `${API_BASE}/northeast`;
                if (stateSlug && districtSlug) {
                    apiUrl += `/${stateSlug}/${districtSlug}/homestays`;
                    setScope('district');
                } else if (stateSlug) {
                    apiUrl += `/${stateSlug}/homestays`;
                    setScope('state');
                } else {
                    apiUrl += '/homestays';
                    setScope('northeast');
                }

                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.success) {
                    setHomestays(data.data);
                } else {
                    throw new Error(data.message || 'Failed to fetch homestays');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchHomestays();
    }, [stateSlug, districtSlug]);

    const getTitle = () => {
        if (scope === 'district' && context?.districtName) {
            return `Homestays in ${context.districtName}`;
        }
        if (scope === 'state' && context?.stateName) {
            return `Homestays in ${context.stateName}`;
        }
        return 'Homestays Across Northeast India';
    };

    if (loading) {
        return (
            <div className="destinations-view">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <span className="loading-text">Loading homestays...</span>
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
                    {homestays.length} authentic homestays
                </p>
            </header>

            <div className="destinations-grid">
                {homestays.map((homestay) => (
                    <HomestayCard key={homestay._id} homestay={homestay} />
                ))}
            </div>

            {homestays.length === 0 && (
                <div className="empty-state">
                    <span className="material-symbols-outlined">home</span>
                    <h3>No homestays found</h3>
                    <p>Check back later for authentic local stays.</p>
                </div>
            )}
        </div>
    );
}

function HomestayCard({ homestay }) {
    const imageUrl = homestay.images?.[0] || 'https://images.unsplash.com/photo-1571676674483-e18e87d0c3bc?w=400';

    return (
        <div className="destination-card">
            <div className="destination-image">
                <img src={imageUrl} alt={homestay.name} loading="lazy" />
                {homestay.rating && (
                    <div className="destination-type-badge">
                        <span className="material-symbols-outlined">star</span>
                        {homestay.rating.toFixed(1)}
                    </div>
                )}
            </div>
            <div className="destination-content">
                <h3 className="destination-name">{homestay.name}</h3>
                <p className="destination-location">
                    <span className="material-symbols-outlined">location_on</span>
                    {homestay.districtId?.districtName || 'Northeast India'}
                </p>
                {homestay.pricePerNight && (
                    <p className="destination-price">
                        ₹{homestay.pricePerNight} / night
                    </p>
                )}
                {homestay.hostName && (
                    <p className="destination-host">
                        <span className="material-symbols-outlined">person</span>
                        Hosted by {homestay.hostName}
                    </p>
                )}
            </div>
        </div>
    );
}
