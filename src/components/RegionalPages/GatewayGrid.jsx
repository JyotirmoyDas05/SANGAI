/**
 * GatewayGrid - Navigation grid to child entities
 * Section 8 for Region pages (Gateway to States)
 * Also used for states (Explore Districts)
 */
import { Link } from 'react-router-dom';
import './RegionalPages.css';

export default function GatewayGrid({
    items = [],
    title = "Explore Further",
    basePath = '/',
    entityType = 'state' // 'state' | 'district'
}) {
    if (!items.length) return null;

    return (
        <section className="gateway-section">
            <h2 className="section-title">{title}</h2>

            <div className="gateway-grid">
                {items.map((item, index) => (
                    <Link
                        to={`${basePath}${item.slug}`}
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
