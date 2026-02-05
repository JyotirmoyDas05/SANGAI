import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './ShoppingSection.css';

const ShoppingSection = ({
    title = "Buy A Piece of Northeast India",
    subtitle = "Unique, Eco Friendly, Natural Products",
    ctaLink = "https://themeghalayanage.store/",
    items = []
}) => {
    const navigate = useNavigate();
    const { region } = useParams();
    const currentRegion = region || 'northeast';

    // Default items based on the user's snippet if none provided
    const displayItems = items.length > 0 ? items : [
        {
            title: "Craft",
            subtitle: "Handwoven & Handmade Treasures",
            image: "https://meghtour.web-assets.org/cdn-cgi/image/format=auto,width=1200,quality=100,fit=scale-down,slow-connection-quality=45/home/store-section/basket.png",
            link: "/collections/craft"
        },
        {
            title: "Textile",
            subtitle: "Traditional Threads & Patterns",
            image: "https://meghtour.web-assets.org/cdn-cgi/image/format=auto,width=1200,quality=100,fit=scale-down,slow-connection-quality=45/home/store-section/shawl.png",
            link: "/collections/textile"
        },
        {
            title: "Food",
            subtitle: "Homegrown Flavors & Preserves",
            image: "https://meghtour.web-assets.org/cdn-cgi/image/format=auto,width=1200,quality=100,fit=scale-down,slow-connection-quality=45/home/store-section/honey.png",
            link: "/collections/food"
        }
    ];

    return (
        <section className="shopping-section">
            <div className="shopping-container">
                <div className="shopping-header">
                    <div className="shopping-text-group">
                        <h3 className="shopping-title">{title}</h3>
                        <p className="shopping-subtitle">{subtitle}</p>
                    </div>
                    <div className="shopping-cta">
                        <button
                            onClick={() => navigate('/shopping')}
                            className="view-all-btn"
                        >
                            View All Products
                        </button>
                    </div>
                </div>

                <div className="shopping-grid">
                    {displayItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className="shopping-card"
                        >
                            <div className="shopping-card-text">
                                <p className="card-title">{item.title}</p>
                                <p className="card-subtitle">{item.subtitle}</p>
                            </div>
                            <figure className="shopping-card-figure">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="shopping-card-image"
                                    loading="lazy"
                                />
                            </figure>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShoppingSection;
