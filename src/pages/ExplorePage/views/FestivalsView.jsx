import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, useOutletContext } from 'react-router-dom';
import './FestivalsView.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Festivals View - Events Calendar Layout
 * Now supports hierarchical routing: /northeast, /northeast/:state, /northeast/:state/:district
 */
export default function FestivalsView() {
    const navigate = useNavigate();
    const location = useLocation();
    const { stateSlug, districtSlug } = useParams();
    const context = useOutletContext();

    const [activeTab, setActiveTab] = useState('upcoming');
    const [activeFilter] = useState('all');
    const [festivals, setFestivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scope, setScope] = useState('northeast');

    useEffect(() => {
        const fetchFestivals = async () => {
            setLoading(true);
            setError(null);
            try {
                // Build API URL based on hierarchy level
                let apiUrl = `${API_BASE}/northeast`;
                if (stateSlug && districtSlug) {
                    apiUrl += `/${stateSlug}/${districtSlug}/festivals`;
                    setScope('district');
                } else if (stateSlug) {
                    apiUrl += `/${stateSlug}/festivals`;
                    setScope('state');
                } else {
                    apiUrl += '/festivals';
                    setScope('northeast');
                }

                // Add query params
                if (activeTab === 'upcoming') {
                    apiUrl += '?upcoming=true';
                }

                const response = await fetch(apiUrl);
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message || 'Failed to fetch festivals');
                }

                // Transform API data to match component structure
                const transformedFestivals = (result.data || []).map(fest => ({
                    id: fest._id || fest.id,
                    name: fest.festivalId?.name || fest.name || 'Festival',
                    desc: fest.festivalId?.description || fest.description || '',
                    date: formatDate(fest.startDate, fest.endDate),
                    image: fest.festivalId?.image || fest.image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
                    tags: fest.festivalId?.tags || fest.tags || [],
                    location: fest.districtId?.districtName || 'Northeast India'
                }));

                setFestivals(transformedFestivals);
            } catch (err) {
                console.error('Error fetching festivals:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFestivals();
    }, [activeTab, stateSlug, districtSlug]);

    // Helper to format date range
    function formatDate(startDate, endDate) {
        if (!startDate) return 'TBD';
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (end && start.getMonth() === end.getMonth()) {
            return `${months[start.getMonth()]} ${start.getDate()}-${end.getDate()}`;
        } else if (end) {
            return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}`;
        }
        return `${months[start.getMonth()]} ${start.getDate()}`;
    }

    // Determine title based on scope
    const getTitle = () => {
        if (scope === 'district' && context?.districtName) {
            return `Festivals in ${context.districtName}`;
        }
        if (scope === 'state' && context?.stateName) {
            return `Festivals in ${context.stateName}`;
        }
        return 'Festivals & Events';
    };


    return (
        <div className="festivals-view">


            {/* HEADER */}
            <div className="fest-header">
                <div>
                    <h1>{getTitle()}</h1>
                    <p>Discover the living culture and vibrant traditions of the Jewel of India.</p>
                </div>

                <button className="btn-map-view">
                    <span className="material-symbols-outlined">map</span>
                    <span>Map View</span>
                </button>
            </div>

            {/* TABS */}
            <div className="fest-tabs">
                <button className={`tab-link ${activeTab === 'current' ? 'active' : ''}`} onClick={() => setActiveTab('current')}>Current</button>
                <button className={`tab-link ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>Upcoming</button>
                <button className={`tab-link ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>Past</button>
            </div>

            {/* FILTERS */}
            <div className="fest-filters">
                <button className={`chip ${activeFilter === 'all' ? 'active-light' : ''}`}>All Types</button>
                <button className="chip"><span className="material-symbols-outlined">music_note</span> Music</button>
                <button className="chip"><span className="material-symbols-outlined">theater_comedy</span> Dance</button>
                <button className="chip"><span className="material-symbols-outlined">temple_buddhist</span> Religious</button>
                <button className="chip"><span className="material-symbols-outlined">restaurant</span> Food</button>
                <button className="chip eco-chip"><span className="material-symbols-outlined">eco</span> Eco-Certified</button>
            </div>

            {/* EVENTS GRID */}
            <div className="events-grid">
                {loading && (
                    <div className="loading-state">
                        <span className="material-symbols-outlined spinning">progress_activity</span>
                        <p>Loading festivals...</p>
                    </div>
                )}

                {error && (
                    <div className="error-state">
                        <span className="material-symbols-outlined">error</span>
                        <p>Failed to load festivals: {error}</p>
                    </div>
                )}

                {!loading && !error && festivals.length === 0 && (
                    <div className="empty-state">
                        <span className="material-symbols-outlined">event_busy</span>
                        <p>No festivals found</p>
                    </div>
                )}

                {!loading && !error && festivals.map(fest => (
                    <div
                        className="event-card group cursor-pointer"
                        key={fest.id}
                        onClick={() => {
                            // Ensure we navigate to the child route regardless of current trailing slash
                            const currentPath = location.pathname.replace(/\/+$/, '');
                            navigate(`${currentPath}/${fest.id}`);
                        }}
                    >
                        <div className="event-media">
                            <img src={fest.image} alt={fest.name} />
                            <div className="media-overlay"></div>

                            <div className="date-badge">
                                {fest.date}
                            </div>

                            {fest.tags && fest.tags.includes('Eco-Certified') && (
                                <div className="eco-badge-bottom">
                                    <span className="material-symbols-outlined">eco</span>
                                    <span>Eco-Certified</span>
                                </div>
                            )}

                            {fest.tags && fest.tags.includes('Zero Waste') && (
                                <div className="eco-badge-bottom">
                                    <span className="material-symbols-outlined">eco</span>
                                    <span>Zero Waste</span>
                                </div>
                            )}
                        </div>

                        <div className="event-content">
                            <h3>{fest.name}</h3>
                            <p>{fest.desc}</p>
                            <div className="view-details">
                                <span>View Details</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* LOAD MORE */}
            <div className="load-more-container">
                <button className="btn-load-more">
                    Load More Events
                    <span className="material-symbols-outlined">expand_more</span>
                </button>
            </div>
        </div>
    );
}
