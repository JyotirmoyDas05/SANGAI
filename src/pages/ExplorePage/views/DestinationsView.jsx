import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlaces } from '../../../api/apiService';
import './DestinationsView.css';

/**
 * Destinations View - Masonry Grid Layout
 * Displays refined destination cards - Now using real API data
 */
export default function DestinationsView() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaces = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = { limit: 12 };

                // Apply filter
                if (filter === 'hidden') {
                    params.isHiddenGem = true;
                }

                const response = await getPlaces(params);

                // Transform API data for display
                const transformedPlaces = (response.data || []).map(place => ({
                    id: place._id || place.id,
                    name: place.name,
                    location: place.districtId?.stateName || 'Northeast India',
                    district: place.districtId?.districtName || '',
                    type: place.type || 'destination',
                    image: place.images?.[0]?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                    shortDescription: place.shortDescription || '',
                    isHiddenGem: place.isHiddenGem || false,
                    tags: place.tagIds?.map(t => t.name) || []
                }));

                setPlaces(transformedPlaces);
            } catch (err) {
                console.error('Error fetching places:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, [filter]);

    // Get card height class based on index for masonry effect
    const getHeightClass = (index) => {
        const pattern = ['h-tall', 'h-short', 'h-medium', 'h-short', 'h-tall', 'h-medium'];
        return pattern[index % pattern.length];
    };

    // Get badge for place
    const getBadge = (place, index) => {
        if (place.isHiddenGem) return { text: 'Hidden Gem', class: 'gem' };
        if (index === 0) return { text: 'Must Visit', class: 'primary' };
        if (place.tags?.includes('trekking')) return { text: 'Adventure', class: 'orange' };
        return null;
    };

    return (
        <div className="destinations-view">
            <div className="content-surface" style={{ background: 'var(--bg-dark)', position: 'relative', zIndex: 10, padding: '40px 0' }}>
                {/* HEADER */}
                <div className="view-header" style={{ padding: '0 5%' }}>
                    <div className="header-content">
                        <div className="section-tag">
                            <span className="h-line"></span>
                            <span>Explore Northeast</span>
                        </div>
                        <h1>Places to Visit</h1>
                        <p>Curated destinations for the conscious traveler. From mist-covered valleys to river islands.</p>
                    </div>

                    <div className="filter-bar">
                        <button className={`filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`filter-pill ${filter === 'popular' ? 'active' : ''}`} onClick={() => setFilter('popular')}>Popular</button>
                        <button className={`filter-pill ${filter === 'hidden' ? 'active' : ''}`} onClick={() => setFilter('hidden')}>Hidden Gems</button>
                        <button className={`filter-pill ${filter === 'new' ? 'active' : ''}`} onClick={() => setFilter('new')}>New</button>
                    </div>
                </div>

                {/* LOADING STATE */}
                {loading && (
                    <div className="loading-container" style={{ padding: '60px', textAlign: 'center' }}>
                        <span className="material-symbols-outlined spinning" style={{ fontSize: '48px', color: 'var(--accent)' }}>progress_activity</span>
                        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading destinations...</p>
                    </div>
                )}

                {/* ERROR STATE */}
                {error && (
                    <div className="error-container" style={{ padding: '60px', textAlign: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ef4444' }}>error</span>
                        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Failed to load places: {error}</p>
                    </div>
                )}

                {/* MASONRY GRID */}
                {!loading && !error && (
                    <div className="masonry-grid">
                        {places.map((place, index) => {
                            const badge = getBadge(place, index);
                            return (
                                <div className="masonry-item" key={place.id}>
                                    <div className="dest-card">
                                        <div className={`card-media ${getHeightClass(index)}`}>
                                            <img src={place.image} alt={place.name} />
                                            <div className="card-overlay"></div>
                                            {badge && (
                                                <div className={`card-badge ${badge.class}`}>{badge.text}</div>
                                            )}
                                        </div>
                                        <div className="card-details">
                                            <h3>{place.name}</h3>
                                            <div className="location-row">
                                                <span className="material-symbols-outlined">location_on</span>
                                                <span>{place.district ? `${place.district}, ${place.location}` : place.location}</span>
                                            </div>
                                            <div className="card-action-row">
                                                <span className="category-label">{place.type}</span>
                                                <button
                                                    className="btn-sm"
                                                    onClick={() => navigate(`/mock-destination/${place.id}`)}
                                                >
                                                    Learn More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && !error && places.length === 0 && (
                    <div className="empty-container" style={{ padding: '60px', textAlign: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--text-secondary)' }}>explore_off</span>
                        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>No destinations found</p>
                    </div>
                )}

                {/* LOAD MORE */}
                {!loading && !error && places.length > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <button className="btn-load-more" style={{
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            padding: '12px 32px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            Load More
                            <span className="material-symbols-outlined">expand_more</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
