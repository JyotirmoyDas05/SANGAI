/**
 * GuidesView - Displays guides based on hierarchy level
 */
import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import './DestinationsView.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function GuidesView() {
    const { stateSlug, districtSlug } = useParams();
    const context = useOutletContext();

    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scope, setScope] = useState('northeast');

    useEffect(() => {
        async function fetchGuides() {
            try {
                setLoading(true);

                let apiUrl = `${API_BASE}/northeast`;
                if (stateSlug && districtSlug) {
                    apiUrl += `/${stateSlug}/${districtSlug}/guides`;
                    setScope('district');
                } else if (stateSlug) {
                    apiUrl += `/${stateSlug}/guides`;
                    setScope('state');
                } else {
                    apiUrl += '/guides';
                    setScope('northeast');
                }

                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.success) {
                    setGuides(data.data);
                } else {
                    throw new Error(data.message || 'Failed to fetch guides');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchGuides();
    }, [stateSlug, districtSlug]);

    const getTitle = () => {
        if (scope === 'district' && context?.districtName) {
            return `Local Guides in ${context.districtName}`;
        }
        if (scope === 'state' && context?.stateName) {
            return `Local Guides in ${context.stateName}`;
        }
        return 'Local Guides Across Northeast India';
    };

    if (loading) {
        return (
            <div className="destinations-view">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <span className="loading-text">Loading guides...</span>
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
                    {guides.length} local experts available
                </p>
            </header>

            <div className="destinations-grid">
                {guides.map((guide) => (
                    <GuideCard key={guide._id} guide={guide} />
                ))}
            </div>

            {guides.length === 0 && (
                <div className="empty-state">
                    <span className="material-symbols-outlined">person_search</span>
                    <h3>No guides found</h3>
                    <p>Check back later for local expert guides.</p>
                </div>
            )}
        </div>
    );
}

function GuideCard({ guide }) {
    const imageUrl = guide.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';

    return (
        <div className="destination-card guide-card">
            <div className="destination-image">
                <img src={imageUrl} alt={guide.name} loading="lazy" />
                {guide.rating && (
                    <div className="destination-type-badge">
                        <span className="material-symbols-outlined">star</span>
                        {guide.rating.toFixed(1)}
                    </div>
                )}
            </div>
            <div className="destination-content">
                <h3 className="destination-name">{guide.name}</h3>
                <p className="destination-location">
                    <span className="material-symbols-outlined">location_on</span>
                    {guide.districtId?.districtName || 'Northeast India'}
                </p>
                {guide.specialties?.length > 0 && (
                    <div className="guide-specialties">
                        {guide.specialties.slice(0, 3).map((specialty, i) => (
                            <span key={i} className="specialty-tag">{specialty}</span>
                        ))}
                    </div>
                )}
                {guide.languages?.length > 0 && (
                    <p className="guide-languages">
                        <span className="material-symbols-outlined">translate</span>
                        {guide.languages.join(', ')}
                    </p>
                )}
            </div>
        </div>
    );
}
