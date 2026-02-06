import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaceById } from '../../api/apiService';
import './MockDestinationPage.css';

export default function MockDestinationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPlaceData();
    }, [id]);

    const fetchPlaceData = async () => {
        try {
            setLoading(true);
            const data = await getPlaceById(id);
            setPlace(data);

            // Fetch weather if location exists
            if (data.location && data.location.lat && data.location.lng) {
                fetchWeather(data.location.lat, data.location.lng);
            }
        } catch (err) {
            console.error("Failed to fetch place:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Weather Codes Helper
    const getWeatherDetails = (code) => {
        if (code === 0) return { desc: 'Clear Sky', icon: 'clear_day' };
        if (code >= 1 && code <= 3) return { desc: 'Partly Cloudy', icon: 'partly_cloudy_day' };
        if (code >= 45 && code <= 48) return { desc: 'Foggy', icon: 'foggy' };
        if (code >= 51 && code <= 67) return { desc: 'Rainy', icon: 'rainy' };
        if (code >= 71 && code <= 77) return { desc: 'Snow', icon: 'ac_unit' };
        if (code >= 80 && code <= 82) return { desc: 'Showers', icon: 'rainy' };
        if (code >= 95 && code <= 99) return { desc: 'Thunderstorm', icon: 'thunderstorm' };
        return { desc: 'Unknown', icon: 'cloud' };
    };

    const fetchWeather = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code`
            );

            if (response.ok) {
                const data = await response.json();
                const current = data.current;
                const details = getWeatherDetails(current.weather_code);

                setWeather({
                    temp: Math.round(current.temperature_2m),
                    condition: details.desc,
                    icon: details.icon
                });
            }
        } catch (error) {
            console.error("Failed to fetch weather:", error);
        }
    };

    if (loading) return <div className="loading-screen">Loading destination...</div>;
    if (error || !place) return <div className="error-screen">Destination not found.</div>;

    const heroImage = place.images?.[0]?.url || 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&q=80';

    return (
        <div className="mock-destination-page">
            {/* Back Button */}
            <button className="mdp-back-btn" onClick={() => navigate(-1)} style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">arrow_back</span>
            </button>

            {/* Book Now Sticky Button */}
            <button className="mdp-book-btn">
                <span>Book Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
            </button>

            {/* ----- HERO SECTION ----- */}
            <header className="mdp-hero">
                <img
                    src={heroImage}
                    alt={place.name}
                    className="mdp-hero__image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="mdp-hero__overlay"></div>

                <div className="mdp-hero__title-container">
                    <h1 className="mdp-hero__title">{place.name}</h1>
                    {place.type && <span className="mdp-hero__subtitle" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', display: 'block', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>{place.type}</span>}
                </div>
            </header>

            {/* ----- CONTENT SECTION ----- */}
            <main className="mdp-content">
                <div className="mdp-content__container">
                    <div className="mdp-content__grid">

                        {/* Left Column */}
                        <div className="mdp-left-col">
                            {/* Description / Overview */}
                            <div className="mdp-description">
                                <h3>Overview</h3>
                                <p>{place.story?.overview || place.shortDescription}</p>

                                {place.story?.culturalSignificance && (
                                    <>
                                        <h3 style={{ marginTop: '20px' }}>Cultural Significance</h3>
                                        <p>{place.story.culturalSignificance}</p>
                                    </>
                                )}

                                {place.story?.localBelief && (
                                    <>
                                        <h3 style={{ marginTop: '20px' }}>Local Beliefs & Legends</h3>
                                        <p>{place.story.localBelief}</p>
                                    </>
                                )}
                            </div>

                            {/* Info Section: Getting There & Nearby */}
                            <div className="mdp-info-section">
                                <div className="mdp-info-col">
                                    <div className="mdp-info-block">
                                        <h2>How to Get There</h2>
                                        {place.logistics ? (
                                            <ul className="mdp-info-list">
                                                {place.logistics.nearestTown && <li><strong>Nearest Town:</strong> {place.logistics.nearestTown} {place.logistics.distanceFromNearestTown && `(${place.logistics.distanceFromNearestTown})`}</li>}
                                                {place.logistics.distanceFromShillong && <li><strong>From Shillong:</strong> {place.logistics.distanceFromShillong}</li>}
                                                {place.logistics.distanceFromGuwahati && <li><strong>From Guwahati:</strong> {place.logistics.distanceFromGuwahati}</li>}
                                                {place.logistics.transportationInfo && <li style={{ marginTop: '10px' }}>{place.logistics.transportationInfo}</li>}
                                            </ul>
                                        ) : (
                                            <ul className="mdp-info-list">
                                                <li>Located in {place.districtId?.name || 'Northeast India'}.</li>
                                                <li>Use local cabs or transport from major towns relative to {place.districtId?.name}.</li>
                                            </ul>
                                        )}
                                    </div>

                                    <div className="mdp-info-block">
                                        <h2>Best Time to Visit</h2>
                                        <ul className="mdp-info-list">
                                            <li>{place.bestTimeToVisit || 'October to April is generally the best time to visit Northeast India.'}</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Nearby Attractions Placeholder - could be dynamic later */}
                                <div className="mdp-attractions-col">
                                    {place.experience?.highlights?.length > 0 && (
                                        <div className="mdp-highlights" style={{ marginBottom: '30px' }}>
                                            <h3>Don't Miss</h3>
                                            <ul className="mdp-info-list">
                                                {place.experience.highlights.map((h, i) => (
                                                    <li key={i}>{h}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <h3>Gallery</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        {place.images?.slice(1, 5).map((img, idx) => (
                                            <div key={idx} className="mdp-attraction-card">
                                                <img src={img.url || img} alt="" style={{ height: '100px', objectFit: 'cover' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Homestay Options - Placeholder or Generic for now */}
                            <div className="mdp-homestays">
                                <h2 className="mdp-homestays__title">Where to Stay</h2>
                                <p style={{ color: '#ccc' }}>Homestay options near {place.name} coming soon.</p>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <aside className="mdp-sidebar">
                            {/* Map Widget */}
                            {place.location?.lat && (
                                <div className="mdp-map-widget">
                                    <iframe
                                        title="Location Map"
                                        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY || ''}&q=${place.location.lat},${place.location.lng}&zoom=14`}
                                        width="100%"
                                        height="300"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                    ></iframe>
                                    {/* Fallback frame if no key */}
                                    {!import.meta.env.VITE_GOOGLE_MAPS_KEY && (
                                        <div style={{ background: '#333', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                            Map Unavailable (No Key)
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Visitor Tips Widget */}
                            {place.experience?.visitorTips?.length > 0 && (
                                <div className="mdp-weather-widget" style={{ marginBottom: '20px', background: '#222' }}>
                                    <p className="mdp-weather__title">Essential Tips</p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: '#ddd' }}>
                                        {place.experience.visitorTips.map((tip, i) => (
                                            <li key={i} style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
                                                <span style={{ color: '#ffd700' }}>•</span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Weather Widget */}
                            <div className="mdp-weather-widget">
                                <p className="mdp-weather__title">Weather Today</p>
                                {weather ? (
                                    <div className="mdp-weather__content">
                                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'white' }}>
                                            {weather.icon}
                                        </span>
                                        <div>
                                            <span className="mdp-weather__temp">{weather.temp}°</span>
                                            <span className="mdp-weather__desc">{weather.condition}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mdp-weather__content">
                                        <span className="mdp-weather__desc">Loading weather...</span>
                                    </div>
                                )}
                            </div>

                            {/* Contact Widget */}
                            {/* Contact Widget */}
                            {(place.contact?.phone || place.contact?.whatsapp || place.contact?.email) && (
                                <div className="mdp-contact-widget">
                                    <p className="mdp-contact__title">
                                        Need assistance? Call our <strong>Helpline</strong>
                                    </p>
                                    <div className="mdp-contact-list">
                                        {place.contact.phone && (
                                            <a href={`tel:${place.contact.phone}`} className="mdp-contact__item">
                                                <div className="mdp-contact__icon-wrap">
                                                    <span className="material-symbols-outlined">call</span>
                                                </div>
                                                <div>
                                                    <div className="mdp-contact__label">Call Our Helpline</div>
                                                    <div className="mdp-contact__value">{place.contact.phone}</div>
                                                </div>
                                            </a>
                                        )}
                                        {place.contact.whatsapp && (
                                            <a href={`https://wa.me/${place.contact.whatsapp.replace(/[^0-9]/g, '')}`} className="mdp-contact__item" target="_blank" rel="noopener noreferrer">
                                                <div className="mdp-contact__icon-wrap">
                                                    <span className="material-symbols-outlined" style={{ color: '#25D366' }}>chat</span>
                                                </div>
                                                <div>
                                                    <div className="mdp-contact__label">WhatsApp Us</div>
                                                    <div className="mdp-contact__value">{place.contact.whatsapp}</div>
                                                </div>
                                            </a>
                                        )}
                                        {place.contact.email && (
                                            <a href={`mailto:${place.contact.email}`} className="mdp-contact__item">
                                                <div className="mdp-contact__icon-wrap">
                                                    <span className="material-symbols-outlined">mail</span>
                                                </div>
                                                <div>
                                                    <div className="mdp-contact__label">Email Us</div>
                                                    <div className="mdp-contact__value" style={{ fontSize: '0.8rem' }}>{place.contact.email}</div>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}

