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

    return (
        <div className="mock-destination-page">
            {/* Back Button */}
            <button
                className="mdp-back-btn"
                onClick={() => navigate(-1)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                </svg>
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

                            {/* Homestay Options */}
                            <div className="mdp-homestays">
                                <h2 className="mdp-homestays__title">Where to Stay</h2>

                                {/* Homestay Card 1 */}
                                <div className="mdp-homestay-card">
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
                                <div className="mdp-homestay-card">
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
                                <div className="mdp-homestay-card">
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
                                <div className="mdp-homestay-card">
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
                                <div className="mdp-weather__content">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white' }}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>
                                    <div>
                                        <span className="mdp-weather__temp">7°</span>
                                        <span className="mdp-weather__desc">Few Clouds</span>
                                    </div>
                                </div>
                                <button className="mdp-weather__link">
                                    Weather Forecast
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                                </button>
                            </div>

                            {/* Contact Widget */}
                            <div className="mdp-contact-widget">
                                <p className="mdp-contact__title">
                                    Please call for assistance at the <strong>toll free number</strong>
                                </p>
                                <div className="mdp-contact__item">
                                    <div className="mdp-contact__icon-wrap">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    </div>
                                    <div>
                                        <div className="mdp-contact__label">Call Our Helpline</div>
                                        <div className="mdp-contact__value">1800 599 2026</div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
