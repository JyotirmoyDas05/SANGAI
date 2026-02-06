import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFestivalById } from '../../../api/apiService';
import './FestivalDetailView.css';

export default function FestivalDetailView() {
    const { id } = useParams();
    const [festival, setFestival] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFestival = async () => {
            try {
                const data = await getFestivalById(id);
                setFestival(data);
            } catch (err) {
                console.error("Failed to fetch festival:", err);
                setError("Failed to load festival details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFestival();
        }
    }, [id]);

    // Placeholder Data (Shillong Cherry Blossom)
    const placeholderFestival = {
        name: "Shillong Cherry Blossom Festival",
        description: "In autumn, Shillong, the capital of Meghalaya, transforms into a mesmerising Sakura wonderland as thousands of cherry blossoms paint the landscape in shades of pink. This breathtaking spectacle draws tourists from across the country, with the autumn-winter months being the best time to experience Meghalaya’s raw beauty and witness the blooming cherry blossoms. Timed to coincide with the rare autumnal bloom of Himalayan cherry blossom trees (Prunus cerasoides), the festival typically takes place in November, transforming the city into a canvas of delicate pink and white.",
        image: "https://meghtour.web-assets.org/cdn-cgi/image/format=auto,width=1366,quality=90,fit=scale-down,slow-connection-quality=45/events/cherry-blossom-2025.jpg",
        startDate: "2025-11-14",
        endDate: "2025-11-15",
        location: { address: "Jawaharlal Nehru Stadium, Shillong" },
        bookingLink: "https://rockskitickets.com/"
    };

    // Use API data if available, otherwise placeholder
    const displayFestival = festival || placeholderFestival;

    // Helper to extract data based on API structure vs Placeholder structure
    // API returns: { name, description, images: { hero: [], content: [] }, occurrences: [{ startDate, districtId: { districtName } }] }
    // Placeholder returns: { name, description, image, startDate, location: { address } }

    const isApiData = !!festival;

    // 1. Get relevant occurrence (API only)
    let targetOccurrence = null;
    if (isApiData && festival.occurrences && festival.occurrences.length > 0) {
        // Try to find upcoming
        targetOccurrence = festival.occurrences.find(occ => new Date(occ.startDate) >= new Date());
        // Fallback to latest
        if (!targetOccurrence) {
            targetOccurrence = festival.occurrences[festival.occurrences.length - 1];
        }
    }

    // 2. Extract Fields
    const name = displayFestival.name;
    const description = displayFestival.description;

    // Image: Try hero[0], then preview, then fallback (API) OR displayFestival.image (Placeholder)
    let image = displayFestival.image; // Placeholder default
    if (isApiData) {
        if (displayFestival.images?.hero?.length > 0) image = displayFestival.images.hero[0];
        else if (displayFestival.images?.preview) image = displayFestival.images.preview;
    }

    // Dates
    let startDateObj = displayFestival.startDate ? new Date(displayFestival.startDate) : null;
    let endDateObj = displayFestival.endDate ? new Date(displayFestival.endDate) : null;

    if (isApiData && targetOccurrence) {
        startDateObj = new Date(targetOccurrence.startDate);
        endDateObj = new Date(targetOccurrence.endDate);
    }

    const startDate = startDateObj ? startDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : "TBD";
    const endDate = endDateObj ? endDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "";
    const fullDate = `${startDate} ${endDate ? `- ${endDate}` : ''}`;

    // Location
    let locationName = "Northeast India";
    if (isApiData && targetOccurrence?.districtId?.districtName) {
        locationName = `${targetOccurrence.districtId.districtName}, ${targetOccurrence.districtId.stateName || 'India'}`;
    } else if (displayFestival.location?.address) {
        locationName = displayFestival.location.address;
    }

    const bookingLink = displayFestival.bookingLink || "#";
    const contentImages = isApiData ? (displayFestival.images?.content || []) : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
        );
    }

    return (
        <div className="festival-detail-view">
            {/* HERO SECTION */}
            <section className="fd-hero">
                <div className="fd-hero-image">
                    <img src={image} alt={name} />
                </div>
                <div className="fd-hero-overlay">
                    <h1 className="fd-hero-title">{name}</h1>

                    <div className="fd-breadcrumb-strip">
                        <div className="fd-container">
                            <nav className="fd-breadcrumbs">
                                <Link to="/">
                                    <span className="material-symbols-outlined">home</span>
                                </Link>
                                <span className="separator">/</span>
                                <Link to="/explore">Experiences</Link>
                                <span className="separator">/</span>
                                <Link to=".." relative="path">Festivals & Events</Link>
                                <span className="separator">/</span>
                                <span className="current">{name}</span>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section className="fd-content">
                <div className="fd-main-info">
                    <div>
                        <h2 className="fd-section-title">About the Festival</h2>
                        <div className="fd-description">
                            {/* Render CMS Story Content if available */}
                            {displayFestival.story ? (
                                <>
                                    {displayFestival.story.overview && (
                                        <p className="fd-story-paragraph">{displayFestival.story.overview}</p>
                                    )}

                                    {displayFestival.story.culturalSignificance && (
                                        <div className="fd-story-section">
                                            <h3>Cultural Significance</h3>
                                            <p>{displayFestival.story.culturalSignificance}</p>
                                        </div>
                                    )}

                                    {displayFestival.story.history && (
                                        <div className="fd-story-section">
                                            <h3>History & Traditions</h3>
                                            <p>{displayFestival.story.history}</p>
                                        </div>
                                    )}

                                    {displayFestival.story.localInsight && (
                                        <div className="fd-story-insight">
                                            <h4><span className="material-symbols-outlined">lightbulb</span> Local Insight</h4>
                                            <p>"{displayFestival.story.localInsight}"</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Fallback to legacy description */
                                <p>{description}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - IMAGES */}
                <div className="fd-media-column">
                    {contentImages.length > 0 ? (
                        <div className="fd-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                            {contentImages.map((img, idx) => (
                                <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', height: '180px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                                    <img src={img} alt={`${name} ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="fd-content-image-wrapper">
                            <img src={image} alt={name} className="fd-content-image" />
                        </div>
                    )}
                </div>

                <div className="fd-details-grid">
                    <div className="fd-detail-item">
                        <span className="material-symbols-outlined fd-detail-icon">calendar_today</span>
                        <span className="fd-detail-label">Date</span>
                        <span className="fd-detail-value">{fullDate}</span>
                    </div>
                    <div className="fd-detail-item">
                        <span className="material-symbols-outlined fd-detail-icon">location_on</span>
                        <span className="fd-detail-label">Venue</span>
                        <span className="fd-detail-value">{locationName}</span>
                    </div>
                    {bookingLink && bookingLink !== '#' && (
                        <div className="fd-detail-item">
                            <span className="material-symbols-outlined fd-detail-icon">confirmation_number</span>
                            <span className="fd-detail-label">Booking</span>
                            <a href={bookingLink} target="_blank" rel="noopener noreferrer" className="fd-booking-link">
                                Book Tickets <span className="material-symbols-outlined" style={{ fontSize: '1em', verticalAlign: 'middle' }}>arrow_outward</span>
                            </a>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
