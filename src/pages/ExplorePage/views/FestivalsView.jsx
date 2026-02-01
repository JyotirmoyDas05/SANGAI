import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUpcomingFestivals, getFestivals } from '../../../api/apiService';
import './FestivalsView.css';

/**
 * Festivals View - Events Calendar Layout
 * Date-focused cards for festivals - Now using real API data
 */
export default function FestivalsView() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [activeFilter] = useState('all');
    const [festivals, setFestivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFestivals = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = activeTab === 'upcoming'
                    ? await getUpcomingFestivals(20)
                    : await getFestivals();

                // Transform API data to match component structure
                const transformedFestivals = (data || []).map(fest => ({
                    id: fest._id || fest.id,
                    name: fest.name || fest.festivalMaster?.name || 'Festival',
                    desc: fest.description || fest.festivalMaster?.description || '',
                    date: formatDate(fest.startDate, fest.endDate),
                    image: fest.image || fest.festivalMaster?.image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
                    tags: fest.tags || (fest.ecoCertified ? ['Eco-Certified'] : []),
                    location: fest.location || fest.districtId?.districtName || 'Northeast India'
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
    }, [activeTab]);

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


    return (
        <div className="festivals-view">


            {/* HEADER */}
            <div className="fest-header">
                <div>
                    <h1>Festivals & Events</h1>
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
