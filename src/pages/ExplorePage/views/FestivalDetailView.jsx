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

    // Adapt data to UI
    const name = displayFestival.name || displayFestival.festivalMaster?.name || "Festival Name";
    const description = displayFestival.description || displayFestival.festivalMaster?.description || "";
    const image = displayFestival.image || displayFestival.festivalMaster?.image;
    const startDate = displayFestival.startDate ? new Date(displayFestival.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : "TBD";
    const endDate = displayFestival.endDate ? new Date(displayFestival.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "";
    const fullDate = `${startDate} ${endDate ? `- ${endDate}` : ''}`;
    const locationName = displayFestival.location?.address || displayFestival.districtId?.districtName || "Megalaya";
    const bookingLink = displayFestival.bookingLink || "#";

    if (loading) {
        // Optional: Show loading or just render immediately with placeholder if preferred. 
        // For better UX during "placeholder mode", we might skip loading spinner if we just want to show the specific design.
        // But keeping spinner is standard.
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
                            <p>{description}</p>
                        </div>
                    </div>
                </div>

                <div className="fd-content-image-wrapper">
                    <img src={image} alt={name} className="fd-content-image" />
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
                    <div className="fd-detail-item">
                        <span className="material-symbols-outlined fd-detail-icon">confirmation_number</span>
                        <span className="fd-detail-label">Booking</span>
                        <a href={bookingLink} target="_blank" rel="noopener noreferrer" className="fd-booking-link">
                            Book Tickets <span className="material-symbols-outlined" style={{ fontSize: '1em', verticalAlign: 'middle' }}>arrow_outward</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
