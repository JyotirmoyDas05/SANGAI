/**
 * PeopleGallery - Circular portrait gallery
 * Section 4 for Region pages (People of the Region)
 */
import './RegionalPages.css';

export default function PeopleGallery({
    title = "People of This Land",
    description,
    portraits = []
}) {
    return (
        <section className="people-section">
            <div className="people-header">
                <h2 className="section-title">{title}</h2>
                {description && <p className="section-description">{description}</p>}
            </div>

            {portraits.length > 0 && (
                <div className="portraits-gallery">
                    {portraits.map((portrait, index) => (
                        <div className="portrait-item" key={index}>
                            <div className="portrait-image">
                                <img
                                    src={portrait.imageUrl}
                                    alt={portrait.attribution || 'Portrait'}
                                    loading="lazy"
                                />
                            </div>
                            {portrait.attribution && (
                                <span className="portrait-caption">{portrait.attribution}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
