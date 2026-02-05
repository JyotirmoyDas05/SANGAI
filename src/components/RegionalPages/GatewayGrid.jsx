/**
 * GatewayGrid - Navigation grid to child entities (Redesigned)
 * Section 8 for Region pages (Gateway to States)
 * Horizontal scrolling 100vh section
 */
import { Link } from 'react-router-dom';
import './GatewayGrid.css'; // Import specific new styles

export default function GatewayGrid({
    items = [],
    title = "Explore the Eight Sisters",
    description = "Journey through the diverse landscapes and cultures of the eight northeastern states, each offering a unique tapestry of experiences, from mist-covered hills to vibrant festivals.",
    basePath = '/',
    entityType = 'state' // 'state' | 'district'
}) {
    if (!items.length) return null;

    return (
        <section className="gateway-section">
            <div className="gateway-header">
                <h2 className="gateway-title">{title}</h2>
                <p className="gateway-description">{description}</p>
            </div>

            <div className="gateway-scroll-container">
                {items.map((item, index) => (
                    <Link
                        to={`${basePath}/${item.slug}`}
                        className="gateway-card"
                        key={item._id || index}
                    >
                        <div
                            className="gateway-image"
                            style={{
                                backgroundImage: item.heroImage?.url
                                    ? `url(${item.heroImage.url})`
                                    : 'none'
                            }}
                        >
                            <div className="gateway-overlay"></div>
                        </div>
                        <div className="gateway-content">
                            <h3 className="gateway-name">
                                {entityType === 'state' ? item.name : item.districtName}
                            </h3>
                            <p className="gateway-tagline">{item.tagline}</p>
                            {item.districtCount && (
                                <span className="gateway-meta">
                                    {item.districtCount} districts
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
