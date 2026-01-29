/**
 * ContributionCards - Impact/contribution display
 * Section 6 for Region pages (Ecological & Cultural Contribution)
 */
import './RegionalPages.css';

const CATEGORY_ICONS = {
    'Biodiversity': 'eco',
    'Knowledge': 'psychology',
    'Agriculture': 'agriculture',
    'Crafts': 'brush',
    'Culture': 'theater_comedy',
    'Ecology': 'forest',
    'Ideas': 'lightbulb'
};

export default function ContributionCards({
    contributions = [],
    title = "What This Region Gives Back"
}) {
    if (!contributions.length) return null;

    return (
        <section className="contributions-section">
            <h2 className="section-title">{title}</h2>

            <div className="contributions-grid">
                {contributions.map((contribution, index) => (
                    <div className="contribution-card" key={index}>
                        <div className="contribution-icon">
                            <span className="material-symbols-outlined">
                                {CATEGORY_ICONS[contribution.category] || 'star'}
                            </span>
                        </div>
                        <div className="contribution-category">
                            {contribution.category}
                        </div>
                        <h3 className="contribution-title">
                            {contribution.title}
                        </h3>
                        <p className="contribution-description">
                            {contribution.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
