import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

    const renderSafeString = (val) => {
        if (typeof val === 'string') return val;
        if (typeof val === 'number') return String(val);
        return '';
    };

    const getDistrictName = () => {
        try {
            if (!place.districtId) return 'Meghalaya';
            if (typeof place.districtId === 'string') return 'Meghalaya';
            return place.districtId.districtName || place.districtId.name || place.districtId.slug || 'Meghalaya';
        } catch (e) {
            return 'Meghalaya';
        }
    };

    if (loading) return <div className="mock-destination-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    if (error || !place) return <div className="mock-destination-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Destination not found.</div>;

    const heroImage = place.images?.[0]?.url || 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&q=80';

    return (
        <div className="mock-destination-page">
            <button className="mdp-back-btn" onClick={() => navigate(-1)}>
                <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <button className="mdp-book-btn">
                <span>Book Now</span>
                <span className="material-symbols-outlined">calendar_month</span>
            </button>

            {/* HERO SECTION */}
            <header className="mdp-hero">
                <img src={heroImage} alt={renderSafeString(place.name)} className="mdp-hero__image" />
                <div className="mdp-hero__overlay"></div>

                <div className="mdp-hero__title-container">
                    <h1 className="mdp-hero__title">{renderSafeString(place.name)}</h1>
                </div>

                <div className="mdp-breadcrumbs">
                    <nav className="mdp-breadcrumbs__nav">
                        <span className="material-symbols-outlined" style={{ fontSize: '1em', marginRight: '5px' }}>home</span>
                        <span>Home</span>
                        <span className="mdp-breadcrumbs__separator">/</span>
                        <span>Destinations</span>
                        <span className="mdp-breadcrumbs__separator">/</span>
                        <span>{getDistrictName()}</span>
                        <span className="mdp-breadcrumbs__separator">/</span>
                        <span className="mdp-breadcrumbs__current">{renderSafeString(place.name)}</span>
                    </nav>
                </div>
            </header>

            {/* CONTENT GRID */}
            <div className="mdp-content">
                <div className="mdp-content__container">
                    <div className="mdp-content__grid">

                        {/* LEFT COLUMN */}
                        <div className="mdp-left-col">

                            {/* Quote & Description */}
                            {place.story?.quote && (
                                <blockquote className="mdp-quote">
                                    "{renderSafeString(place.story.quote)}"
                                </blockquote>
                            )}

                            <p className="mdp-description">
                                {renderSafeString(place.story?.overview || place.shortDescription)}
                            </p>

                            {/* Info Cards (Best Time, Distance, etc) */}
                            <div className="mdp-cards-grid">
                                {place.bestTimeToVisit && (
                                    <div className="mdp-card">
                                        <div className="mdp-card__icon">
                                            <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>calendar_month</span>
                                        </div>
                                        <div className="mdp-card__title">Best Time</div>
                                        <div className="mdp-card__text">{renderSafeString(place.bestTimeToVisit)}</div>
                                    </div>
                                )}

                                <div className="mdp-card">
                                    <div className="mdp-card__icon">
                                        <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>near_me</span>
                                    </div>
                                    <div className="mdp-card__title">Distance</div>
                                    <div className="mdp-card__text">
                                        {renderSafeString(place.logistics?.distanceFromShillong ? `${place.logistics.distanceFromShillong} from Shillong` : 'Check map for details')}
                                    </div>
                                </div>

                                <div className="mdp-card">
                                    <div className="mdp-card__icon">
                                        <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>hiking</span>
                                    </div>
                                    <div className="mdp-card__title">Activity</div>
                                    <div className="mdp-card__text">{renderSafeString(place.type || 'Sightseeing')}</div>
                                </div>
                            </div>

                            {/* Don't Miss Section */}
                            {place.experience?.dontMiss && place.experience.dontMiss.length > 0 && (
                                <section className="mdp-section">
                                    <h2 className="section-title" style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Don't miss!</h2>
                                    <div className="mdp-cards-grid">
                                        {place.experience.dontMiss.map((item, idx) => (
                                            <div key={idx} className="mdp-card" style={{ background: '#222' }}>
                                                <div className="mdp-card__title" style={{ fontSize: '1rem' }}>{renderSafeString(item.title)}</div>
                                                <div className="mdp-card__text">{renderSafeString(item.description)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* How to Get There & Nearby (Info Section) */}
                            <div className="mdp-info-section">
                                <div className="mdp-info-col">
                                    <div className="mdp-info-block">
                                        <h2>How to Get There</h2>
                                        <ul className="mdp-info-list">
                                            <li>
                                                <strong>Nearest Town:</strong> {renderSafeString(place.logistics?.nearestTown || 'N/A')}
                                                {place.logistics?.distanceFromNearestTown && ` (${renderSafeString(place.logistics.distanceFromNearestTown)})`}
                                            </li>
                                            <li>
                                                <strong>From Shillong:</strong> {renderSafeString(place.logistics?.distanceFromShillong || 'N/A')}
                                            </li>
                                            <li>
                                                <strong>From Guwahati:</strong> {renderSafeString(place.logistics?.distanceFromGuwahati || 'N/A')}
                                            </li>
                                            {place.logistics?.transportationInfo && (
                                                <li>{renderSafeString(place.logistics.transportationInfo)}</li>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="mdp-info-block">
                                        <h2>When and Where</h2>
                                        <p className="mdp-description">{renderSafeString(place.story?.culturalSignificance || 'Plan your visit during the daylight hours for the best experience.')}</p>
                                    </div>
                                </div>

                                <div className="mdp-attractions-col">
                                    <h3>Nearby Attractions</h3>
                                    {/* Placeholder for nearby attractions if data exists, or generic ones */}
                                    <div className="mdp-attraction-card">
                                        <img src="https://images.unsplash.com/photo-1590452366110-38435882e88a?w=800&q=80" alt="Attraction" />
                                        <div className="mdp-attraction-overlay"></div>
                                        <div className="mdp-attraction-name">Arwah Cave</div>
                                    </div>
                                    <div className="mdp-attraction-card">
                                        <img src="https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&q=80" alt="Attraction" />
                                        <div className="mdp-attraction-overlay"></div>
                                        <div className="mdp-attraction-name">Mawsmai Cave</div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT SIDEBAR */}
                        <aside className="mdp-sidebar">
                            {/* Map Widget */}
                            <div className="mdp-map-widget">
                                {place.location?.lat ? (
                                    <iframe
                                        title="Map"
                                        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=${place.location.lat},${place.location.lng}&zoom=14`}
                                        loading="lazy"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Map Unavailable</div>
                                )}
                            </div>

                            {/* Weather Widget */}
                            <div className="mdp-weather-widget">
                                <div className="mdp-weather__title">Weather Today</div>
                                {weather ? (
                                    <div className="mdp-weather__content">
                                        <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#ffbd59' }}>{weather.icon}</span>
                                        <div>
                                            <div className="mdp-weather__temp">{weather.temp}°</div>
                                            <div className="mdp-weather__desc">{weather.condition}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ color: '#666' }}>Loading...</div>
                                )}
                                <button className="mdp-weather__link">
                                    Weather Forecast <span className="material-symbols-outlined">arrow_right_alt</span>
                                </button>
                            </div>

                            {/* Contact Widget */}
                            <div className="mdp-contact-widget">
                                <div className="mdp-contact__title">Please tell us about your <strong>toll free number</strong></div>

                                {place.contact?.phone && (
                                    <a href={`tel:${place.contact.phone}`} className="mdp-contact__item">
                                        <div className="mdp-contact__icon-wrap">
                                            <span className="material-symbols-outlined">call</span>
                                        </div>
                                        <div>
                                            <div className="mdp-contact__label">Call Our Helpline</div>
                                            <div className="mdp-contact__value">{renderSafeString(place.contact.phone)}</div>
                                        </div>
                                    </a>
                                )}

                                {place.contact?.whatsapp && (
                                    <a href={`https://wa.me/${place.contact.whatsapp}`} className="mdp-contact__item">
                                        <div className="mdp-contact__icon-wrap">
                                            <span className="material-symbols-outlined">chat</span>
                                        </div>
                                        <div>
                                            <div className="mdp-contact__label">WhatsApp / SMS</div>
                                            <div className="mdp-contact__value">{renderSafeString(place.contact.whatsapp)}</div>
                                        </div>
                                    </a>
                                )}

                                <a href="mailto:info@meghalayatourism.in" className="mdp-contact__item">
                                    <div className="mdp-contact__icon-wrap">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <div className="mdp-contact__label">Email Our Travel Desk</div>
                                        <div className="mdp-contact__value">info@meghalayatourism.in</div>
                                    </div>
                                </a>
                            </div>

                            {/* Visitor Tips */}
                            {place.experience?.visitorTips && place.experience.visitorTips.length > 0 && (
                                <div className="mdp-contact-widget">
                                    <div className="mdp-contact__title"><strong>Visitor Tips</strong></div>
                                    <ul className="mdp-info-list">
                                        {place.experience.visitorTips.map((tip, idx) => (
                                            <li key={idx}>{renderSafeString(tip)}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </aside>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="mdp-footer">
                <div className="mdp-footer__container">
                    <div className="mdp-footer__grid">

                        {/* Brand Column */}
                        <div className="mdp-footer__col">
                            <div className="mdp-footer__brand" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
                                SANGAI
                            </div>
                            <p className="mdp-footer__text">
                                Welcome to Meghalaya, the homeland of the Khasi, Jaintia, and Garo tribes. Immerse yourself in stunning landscapes and rich heritage.
                            </p>
                            <div className="mdp-footer__social">
                                <a href="#"><span className="material-symbols-outlined">public</span></a>
                                <a href="#"><span className="material-symbols-outlined">photo_camera</span></a>
                                <a href="#"><span className="material-symbols-outlined">play_arrow</span></a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="mdp-footer__col">
                            <h4 className="mdp-footer__title">Quick Links</h4>
                            <ul className="mdp-footer__links">
                                <li><a href="#">About Meghalaya Tourism</a></li>
                                <li><a href="#">NIDHI - Ministry of Tourism</a></li>
                                <li><a href="#">Social Investment Databank (SID-Goal)</a></li>
                                <li><a href="#">Sustainable & Responsible Tourism Tip</a></li>
                                <li><a href="#">Image Credits</a></li>
                                <li><a href="#">Sitemap</a></li>
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div className="mdp-footer__col">
                            <h4 className="mdp-footer__title">Contact Us</h4>
                            <ul className="mdp-footer__contact">
                                <li>
                                    <span className="material-symbols-outlined">location_on</span>
                                    <span>3rd Secretariat, Nokrek Building, Lower Lachumiere, Shillong 793001, Meghalaya, India</span>
                                </li>
                                <li>
                                    <span className="material-symbols-outlined">call</span>
                                    <span>+91 364 2222731</span>
                                </li>
                                <li>
                                    <span className="material-symbols-outlined">mail</span>
                                    <span>info@meghalayatourism.gov.in</span>
                                </li>
                            </ul>
                        </div>

                        {/* App Downloads */}
                        <div className="mdp-footer__col">
                            <h4 className="mdp-footer__title">Get the App</h4>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                <button style={{ background: 'black', color: 'white', border: '1px solid #333', borderRadius: '4px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <span className="material-symbols-outlined">apple</span>
                                    <div style={{ textAlign: 'left', lineHeight: '1' }}>
                                        <div style={{ fontSize: '0.6rem' }}>Download on the</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>App Store</div>
                                    </div>
                                </button>
                                <button style={{ background: 'black', color: 'white', border: '1px solid #333', borderRadius: '4px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <span className="material-symbols-outlined">android</span>
                                    <div style={{ textAlign: 'left', lineHeight: '1' }}>
                                        <div style={{ fontSize: '0.6rem' }}>GET IT ON</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="mdp-footer__bottom">
                        <div>© 2026 Meghalaya Tourism. All Rights Reserved.</div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" style={{ color: '#888', textDecoration: 'none' }}>Privacy Policy</a>
                            <a href="#" style={{ color: '#888', textDecoration: 'none' }}>Terms of Use</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
