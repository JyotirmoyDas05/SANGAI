import React from 'react';
import './ShoppingSection.css';

const ShoppingSection = ({
    title = "Buy A Piece of Northeast India",
    subtitle = "Unique, Eco Friendly, Natural Products",
    ctaLink = "https://themeghalayanage.store/",
    items = []
}) => {
    // Default items based on the user's snippet if none provided
    const displayItems = items.length > 0 ? items : [
        {
            title: "Craft",
            subtitle: "Handwoven & Handmade Treasures",
            image: "https://meghtour.web-assets.org/cdn-cgi/image/format=auto,width=1200,quality=100,fit=scale-down,slow-connection-quality=45/home/store-section/basket.png",
            link: "https://themeghalayanage.store/collections/craft"
        },
        {
            title: "Textile",
            subtitle: "Traditional Threads & Patterns",
            image: "https://meghtour.web-assets.org/cdn-cgi/image/format=auto,width=1200,quality=100,fit=scale-down,slow-connection-quality=45/home/store-section/shawl.png",
            link: "https://themeghalayanage.store/collections/textile"
        },
        {
            title: "Food",
            subtitle: "Homegrown Flavors & Preserves",
            image: "https://meghtour.web-assets.org/cdn-cgi/image/format=auto,width=1200,quality=100,fit=scale-down,slow-connection-quality=45/home/store-section/honey.png",
            link: "https://themeghalayanage.store/collections/food"
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
                        <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="view-all-btn">
                            View All Products
                        </a>
                    </div>
                </div>

                <div className="shopping-grid">
                    {displayItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
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
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShoppingSection;
