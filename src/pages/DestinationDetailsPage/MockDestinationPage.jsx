import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MockDestinationPage.css';

export default function MockDestinationPage() {
    // eslint-disable-next-line no-unused-vars
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const heroImage = 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&q=80';

    // Weather Logic
    const [weather, setWeather] = React.useState(null);

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

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Coordinates for Nohkalikai (Cherrapunji)
                const lat = 25.27;
                const lng = 91.73;

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

        fetchWeather();
    }, []);

    return (
        <div className="mock-destination-page">
            {/* Back Button */}


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
                    alt=""
                    className="mdp-hero__image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="mdp-hero__overlay"></div>

                <div className="mdp-hero__title-container">
                    <h1 className="mdp-hero__title">Hidden Place</h1>
                </div>
            </header>

            {/* ----- CONTENT SECTION ----- */}
            <main className="mdp-content">
                <div className="mdp-content__container">
                    <div className="mdp-content__grid">

                        {/* Left Column */}
                        <div className="mdp-left-col">
                            {/* Intro Quote */}
                            <blockquote className="mdp-quote">
                                "A dramatic plunge waterfall in Meghalaya, renowned for its towering drop and the striking turquoise pool below, set against the backdrop of rugged cliffs and dense forests."
                            </blockquote>

                            {/* Description */}
                            <p className="mdp-description">
                                Nohkalikai Falls is one of India's tallest plunge and most breathtaking waterfalls, plunging 340 meters into a deep, emerald-green pool. Located near Cherrapunjee, one of the wettest places on Earth, this awe-inspiring natural wonder is fed by rainwater collected on a small plateau, making it a sight to behold throughout the year. The sheer force of the waterfall, combined with the surrounding misty cliffs and lush greenery, creates a mesmerizing spectacle that draws visitors from far and wide. Despite its beauty, Nohkalikai Falls carries a tragic legend, adding an air of mystery to its already captivating presence.
                            </p>

                            {/* Info Section: Getting There & Nearby */}
                            <div className="mdp-info-section">
                                <div className="mdp-info-col">
                                    <div className="mdp-info-block">
                                        <h2>How to Get There</h2>
                                        <ul className="mdp-info-list">
                                            <li>Nohkalikai Falls is located in the East Khasi Hills District of Meghalaya, approximately 7.5 km from Sohra (Cherrapunji).</li>
                                            <li>Cabs or local transport can be taken from Shillong or Guwahati to Sohra (Cherrapunji), the nearest major town. From Sohra (Cherrapunji), it's about a 20-minute drive to the falls.</li>
                                            <li>Although the tourist places in Meghalaya are enduring and calling, it is advisable to arrange for a local tourist buddy or guide who is knowledgeable of the location and the language.</li>
                                        </ul>
                                    </div>

                                    <div className="mdp-info-block">
                                        <h2>When and Where</h2>
                                        <ul className="mdp-info-list">
                                            <li>Nohkalikai Falls is in the East Khasi Hills district of Meghalaya, India, with the nearest town, Sohra (Cherrapunji), being 7.5 km away.</li>
                                            <li>The distance from Shillong Airport is 79 km and 167 km from Guwahati Airport.</li>
                                            <li>The best time to visit Nohkalikai Falls is between October and December, when the monsoon season enhances the waterfall, creating a spectacular sight.</li>
                                            <li>Nohkalikai Falls is open from 8:00 AM to 5:00 PM daily.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mdp-attractions-col">
                                    <h3>Nearby Attractions</h3>

                                    <div className="mdp-attraction-card">
                                        <img src="https://images.unsplash.com/photo-1705861144411-926a793c1ba2?w=600&q=80" alt="Arwah Cave" />
                                        <div className="mdp-attraction-overlay"></div>
                                        <div className="mdp-attraction-name">Arwah Cave</div>
                                    </div>

                                    <div className="mdp-attraction-card">
                                        <img src="https://images.unsplash.com/photo-1707055744274-1317d74bd89b?w=600&q=80" alt="Mawsmai Cave" />
                                        <div className="mdp-attraction-overlay"></div>
                                        <div className="mdp-attraction-name">Mawsmai Cave</div>
                                    </div>
                                </div>
                            </div>

                            {/* Homestay Options */}
                            <div className="mdp-homestays">
                                <h2 className="mdp-homestays__title">Where to Stay</h2>

                                {/* Homestay Card 1 */}
                                <div className="mdp-homestay-card" onClick={() => navigate('APRIL_SPRINGS_HOMESTAY')} style={{ cursor: 'pointer' }}>
                                    <div className="mdp-homestay-card__image">
                                        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" alt="" />
                                    </div>
                                    <div className="mdp-homestay-card__content">
                                        <div className="mdp-homestay-card__header">
                                            <h3 className="mdp-homestay-card__name">APRIL SPRINGS HOMESTAY</h3>
                                            <div className="mdp-homestay-card__rating">
                                                <span className="rating-text">Good</span>
                                                <span className="rating-badge">4.3★</span>
                                            </div>
                                        </div>
                                        <div className="mdp-homestay-card__location">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                                            <span>UB 23, Upper Nongrim Hills, Opp NEC Building, Shillong</span>
                                            <span className="reviews">(4 Reviews)</span>
                                        </div>
                                        <div className="mdp-homestay-card__price">₹ 3,500.00</div>
                                        <div className="mdp-homestay-card__details">1 Night, 1 Adult</div>
                                        <div className="mdp-homestay-card__amenities">
                                            <span>📶 WiFi</span>
                                            <span>🍳 Breakfast</span>
                                            <span>🍽️ Lunch</span>
                                            <span>🍽️ Dinner</span>
                                            <span>🅿️ Parking</span>
                                        </div>
                                        <button className="mdp-homestay-card__btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                                            See Availability
                                        </button>
                                    </div>
                                </div>

                                {/* Homestay Card 2 */}
                                <div className="mdp-homestay-card" onClick={() => navigate('HILLS_VALLEY_GUESTHOUSE')} style={{ cursor: 'pointer' }}>
                                    <div className="mdp-homestay-card__image">
                                        <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80" alt="" />
                                    </div>
                                    <div className="mdp-homestay-card__content">
                                        <div className="mdp-homestay-card__header">
                                            <h3 className="mdp-homestay-card__name">HILLS & VALLEY GUESTHOUSE</h3>
                                            <div className="mdp-homestay-card__rating">
                                                <span className="rating-text">Excellent</span>
                                                <span className="rating-badge">4.7★</span>
                                            </div>
                                        </div>
                                        <div className="mdp-homestay-card__location">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                                            <span>Near Mawkdok View Point, Sohra (Cherrapunji)</span>
                                            <span className="reviews">(12 Reviews)</span>
                                        </div>
                                        <div className="mdp-homestay-card__price">₹ 4,200.00</div>
                                        <div className="mdp-homestay-card__details">1 Night, 1 Adult</div>
                                        <div className="mdp-homestay-card__amenities">
                                            <span>📶 WiFi</span>
                                            <span>🍳 Breakfast</span>
                                            <span>🚗 Pick-up</span>
                                            <span>🅿️ Parking</span>
                                        </div>
                                        <button className="mdp-homestay-card__btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                                            See Availability
                                        </button>
                                    </div>
                                </div>

                                {/* Homestay Card 3 */}
                                <div className="mdp-homestay-card" onClick={() => navigate('CHERRAPUNJI_HOLIDAY_RESORT')} style={{ cursor: 'pointer' }}>
                                    <div className="mdp-homestay-card__image">
                                        <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" alt="" />
                                    </div>
                                    <div className="mdp-homestay-card__content">
                                        <div className="mdp-homestay-card__header">
                                            <h3 className="mdp-homestay-card__name">CHERRAPUNJI HOLIDAY RESORT</h3>
                                            <div className="mdp-homestay-card__rating">
                                                <span className="rating-text">Very Good</span>
                                                <span className="rating-badge">4.5★</span>
                                            </div>
                                        </div>
                                        <div className="mdp-homestay-card__location">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                                            <span>Laitkynsew, Near Seven Sisters Falls, Sohra</span>
                                            <span className="reviews">(8 Reviews)</span>
                                        </div>
                                        <div className="mdp-homestay-card__price">₹ 5,800.00</div>
                                        <div className="mdp-homestay-card__details">1 Night, 2 Adults</div>
                                        <div className="mdp-homestay-card__amenities">
                                            <span>📶 WiFi</span>
                                            <span>🍳 Breakfast</span>
                                            <span>🍽️ Dinner</span>
                                            <span>🌄 View</span>
                                            <span>🅿️ Parking</span>
                                        </div>
                                        <button className="mdp-homestay-card__btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                                            See Availability
                                        </button>
                                    </div>
                                </div>

                                {/* Homestay Card 4 */}
                                <div className="mdp-homestay-card" onClick={() => navigate('SOHRA_PINE_COTTAGE')} style={{ cursor: 'pointer' }}>
                                    <div className="mdp-homestay-card__image">
                                        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80" alt="" />
                                    </div>
                                    <div className="mdp-homestay-card__content">
                                        <div className="mdp-homestay-card__header">
                                            <h3 className="mdp-homestay-card__name">SOHRA PINE COTTAGE</h3>
                                            <div className="mdp-homestay-card__rating">
                                                <span className="rating-text">Good</span>
                                                <span className="rating-badge">4.1★</span>
                                            </div>
                                        </div>
                                        <div className="mdp-homestay-card__location">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                                            <span>Main Road, Cherrapunji Market Area, Sohra</span>
                                            <span className="reviews">(6 Reviews)</span>
                                        </div>
                                        <div className="mdp-homestay-card__price">₹ 2,800.00</div>
                                        <div className="mdp-homestay-card__details">1 Night, 1 Adult</div>
                                        <div className="mdp-homestay-card__amenities">
                                            <span>📶 WiFi</span>
                                            <span>🍳 Breakfast</span>
                                            <span>🅿️ Parking</span>
                                        </div>
                                        <button className="mdp-homestay-card__btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                                            See Availability
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <aside className="mdp-sidebar">
                            {/* Map Widget */}
                            <div className="mdp-map-widget">
                                <iframe
                                    title="Location Map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.854583826503!2d91.68359282611154!3d25.2754767285243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37508d4d52a66213%3A0x1e4a36d9696f9c41!2sNohKaLikai%20Falls!5e0!3m2!1sen!2sin"
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>

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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                                        </svg>
                                        <div>
                                            <span className="mdp-weather__temp">--°</span>
                                            <span className="mdp-weather__desc">Loading...</span>
                                        </div>
                                    </div>
                                )}
                                <a
                                    href="https://www.google.com/search?q=weather+Cherrapunji"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mdp-weather__link"
                                >
                                    Weather Forecast
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                                </a>
                            </div>

                            {/* Contact Widget */}
                            <div className="mdp-contact-widget">
                                <p className="mdp-contact__title">
                                    Please call for assistance at the <strong>Helpline</strong>
                                </p>
                                <div className="mdp-contact-list">
                                    {/* Phone */}
                                    <a href="tel:+916002972179" className="mdp-contact__item">
                                        <div className="mdp-contact__icon-wrap">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                        </div>
                                        <div>
                                            <div className="mdp-contact__label">Call Our Helpline</div>
                                            <div className="mdp-contact__value">+91 6002972179</div>
                                        </div>
                                    </a>

                                    {/* WhatsApp */}
                                    <a href="https://wa.me/916002972179" target="_blank" rel="noopener noreferrer" className="mdp-contact__item">
                                        <div className="mdp-contact__icon-wrap">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                        </div>
                                        <div>
                                            <div className="mdp-contact__label">WhatsApp / SMS</div>
                                            <div className="mdp-contact__value">+91 6002972179</div>
                                        </div>
                                    </a>

                                    {/* Email */}
                                    <a href="mailto:duljit29@gmail.com" className="mdp-contact__item">
                                        <div className="mdp-contact__icon-wrap">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                        </div>
                                        <div>
                                            <div className="mdp-contact__label">Email Our Travel Desk</div>
                                            <div className="mdp-contact__value">duljit29@gmail.com</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
