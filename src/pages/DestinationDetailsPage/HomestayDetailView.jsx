import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './HomestayDetailView.css';

// Import mock images
// Import mock images
import img1 from '../../assets/intro page/nilotpal-kalita-IpRIguCAQes-unsplash.jpg';
import img2 from '../../assets/intro page/pexels-amshiv-1476065-25311368.jpg';
import img3 from '../../assets/intro page/pexels-north-bengal-tourism-2152588305-33769041.jpg';
import img4 from '../../assets/intro page/woman-wearing-hill-tribe-dress-strawberry-garden-doi-ang-khang-chiang-mai-thailand.jpg';

export default function HomestayDetailView() {
    // eslint-disable-next-line no-unused-vars
    const { region, id, homestayId } = useParams();
    const [activeTab, setActiveTab] = useState('Overview');

    // Helper to render appropriate tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewTab />;
            case 'Amenities':
                return <AmenitiesTab onReturn={() => setActiveTab('Overview')} />;
            case 'Policies':
                return <PoliciesTab onReturn={() => setActiveTab('Overview')} />;
            default:
                return null;
        }
    };

    return (
        <div className="homestay-detail-view">
            <div className="hdv-container">
                {/* Header */}
                <div className="hdv-row">
                    <div className="hdv-col-12 heading-section">
                        <div className="heading-content">
                            <h3>KRANGSHURI HOMESTAY & CAMPING</h3>
                            <div className="address-row">
                                <i className="ri-map-pin-2-line"></i>
                                <span className="address-text">Krangshuri Road, Krangshuri, Amlarem</span>
                            </div>
                        </div>
                        <button className="share-btn">
                            <i className="ri-share-fill"></i>
                            <span>Share</span>
                        </button>
                    </div>
                </div>

                {/* Gallery */}
                <div className="hdv-row gallery-grid">
                    <div className="hdv-col-lg-6">
                        <div className="gallery-main-img">
                            <img src={img1} alt="Main" />
                        </div>
                    </div>
                    <div className="hdv-col-lg-6">
                        <div className="gallery-sub-row">
                            <div className="gallery-sub-item">
                                <img src={img2} alt=" Sub 1" />
                            </div>
                            <div className="gallery-sub-item">
                                <img src={img3} alt="Sub 2" />
                            </div>
                        </div>
                        <div className="gallery-sub-row">
                            <div className="gallery-sub-item">
                                <img src={img4} alt="Sub 3" />
                            </div>
                            <div className="gallery-sub-item">
                                <div className="gallery-overlay">
                                    <span> + 1 Photo </span>
                                </div>
                                <img src={img1} alt="Sub 4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Area */}
                <div className="hotel-details-area">
                    {/* Tabs */}
                    <div className="tabs-nav">
                        {['Overview', 'Amenities', 'Policies'].map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="tabs-container">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OverviewTab() {
    return (
        <div className="overview-content">
            <div className="hdv-row">
                {/* Left: Contact Info */}
                <div className="hdv-col-xl-8 hdv-col-lg-6">
                    <div className="contact-info">
                        <p><i className="ri-phone-fill contact-icon"></i><b>Contact Number: </b> &nbsp;6002704160</p>
                        <p><i className="ri-mail-line contact-icon"></i><b>Email:</b> &nbsp;buamlinus45@gmail.com</p>
                        <p><i className="ri-logout-box-r-line contact-icon"></i><b>Check-In Time:</b> &nbsp;11:00 am</p>
                        <p><i className="ri-logout-box-line contact-icon"></i><b>Check-Out Time:</b> &nbsp;12:00 pm</p>
                    </div>
                </div>
                {/* Right: Facilities */}
                <div className="hdv-col-xl-4 hdv-col-lg-6">
                    <div className="facilities">
                        <div className="facilities-title">
                            <h3>Available Amenities</h3>
                            <i className="ri-information-line ml-10" style={{ marginLeft: '10px' }}></i>
                        </div>
                        <ul className="facilities-list">
                            <li><i className="ri-temp-hot-line"></i> Room Heater</li>
                            <li><i className="ri-fire-line"></i> Campfire</li>
                            <li><i className="ri-car-line"></i> Parking</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Date Pickers Placeholder */}
            <div className="date-picker-row">
                <div className="picker-box">
                    <i className="ri-calendar-event-fill"></i>
                    <input type="text" placeholder="Check in date" readOnly value="2026-01-31" />
                </div>
                <div className="picker-box">
                    <i className="ri-calendar-event-fill"></i>
                    <input type="text" placeholder="Check out date" readOnly value="2026-02-01" />
                </div>
                <div className="picker-box">
                    <i className="ri-user-3-line"></i>
                    <span>1 Adult</span>
                </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center', color: 'red', fontWeight: 'bold' }}>
                Please select at least 1 Room.
            </div>

            {/* Reviews Section */}
            <div className="review-section">
                <div className="section-header">
                    <p className="review-header-title">Reviews and Ratings</p>
                </div>
                {/* Reviews Content Placeholder - keeping it simple for now */}
                <div className="review-list">
                    <div className="review-item">
                        <div className="review-header">
                            <div className="review-user">
                                <div className="user-avatar">A</div>
                                <p className="reviewed-by" style={{ fontWeight: '600' }}>Anjli Bajpeyi</p>
                            </div>
                        </div>
                        <div className="review-body">
                            <div className="stars">★★★★★</div>
                            <p className="review-text">👍👍👍👍</p>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '20px', color: '#22c55e', cursor: 'pointer', fontWeight: '600' }}>
                    See all reviews
                </div>
            </div>
        </div>
    );
}

function AmenitiesTab({ onReturn }) {
    return (
        <div className="amenities-content">
            <div className="hdv-row">
                <div className="hdv-col-lg-4 hdv-col-md-6">
                    <div className="single-amenities">
                        <h4><i className="ri-temp-hot-line"></i>Room Heater</h4>
                        <p>In the hotel room, a room heater is provided as an additional amenity to enhance guests' comfort during colder seasons. This compact and safe electric heater effectively warms up the space, ensuring a cozy and pleasant stay for guests seeking respite from chilly weather.</p>
                    </div>
                </div>
                <div className="hdv-col-lg-4 hdv-col-md-6">
                    <div className="single-amenities">
                        <h4><i className="ri-fire-line"></i>Campfire</h4>
                        <p>Imagine the crackling of wood, the warmth of glowing embers, and the camaraderie of friends and family gathered under a starlit sky—that's the essence of our campfire experience. Nestled amidst the tranquil beauty of our outdoor space, our campfire beckons you to unwind and connect with nature.</p>
                    </div>
                </div>
                <div className="hdv-col-lg-4 hdv-col-md-6">
                    <div className="single-amenities">
                        <h4><i className="ri-car-line"></i>Parking</h4>
                        <p>Convenient parking awaits at our property, with ample well-lit spaces near the entrance for easy access and peace of mind throughout your stay.</p>
                    </div>
                </div>
            </div>

            <button className="return-btn" onClick={onReturn}>
                <span>Return To Overview</span>
            </button>
        </div>
    );
}

function PoliciesTab({ onReturn }) {
    return (
        <div className="policies-content">
            <div className="single-policies">
                <h3>Property Rules</h3>
                <div style={{ margin: '15px' }}>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        <li>A valid Government ID (Passport, Aadhar, Driving License, Voter ID) is required for all guests traveling for check-in. <br /> For foreign nationals, it is mandatory to present both passport and visa.</li>
                        <li>The minimum age for check-in is 18 years.</li>
                        <li>Children 18 years and above will be charged as adults at the property.</li>
                        <li>Pets are allowed.</li>
                        <li style={{ marginBottom: '12px' }}>Unmarried couples are allowed.</li>
                    </ul>
                    <a href="#" className="read-more" style={{ color: '#3b82f6', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>Read all Property Rules</a>
                </div>

                <h3>Cancellation Policy</h3>
                <p>1. You can cancel your booking using the Meghalaya Tourism - Official website or mobile app.</p>
                <p>2. The applicable refund amount will be credited to you within 7-14 working days.</p>

                <div className="policies-table-container">
                    <h5 style={{ fontSize: '16px', marginTop: '20px', marginBottom: '10px' }}>The following cancellation policy has been set up by the property</h5>
                    <table className="policies-table">
                        <thead>
                            <tr>
                                <th>No. Of days before Check In Date</th>
                                <th>Refund Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>30 - 15 Days</td>
                                <td>100% of total booking amount</td>
                            </tr>
                            <tr>
                                <td>15 - Days</td>
                                <td>50% of total booking amount</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <button className="return-btn" onClick={onReturn}>
                <span>Return To Overview</span>
            </button>
        </div>
    );
}
