/**
 * ExplorationGrid - Soft tourism category cards
 * Section 7 for Region pages (Ways to Explore)
 */
import './RegionalPages.css';

export default function ExplorationGrid({
    categories = [],
    title = "Ways to Explore"
}) {
    if (!categories.length) return null;

    return (
        <section className="exploration-section">
            <h2 className="section-title">{title}</h2>

            <div className="exploration-grid">
                {categories.map((category, index) => (
                    <div className="exploration-card" key={index}>
                        <div className="exploration-icon">
                            <span className="material-symbols-outlined">
                                {category.icon || 'explore'}
                            </span>
                        </div>
                        <h3 className="exploration-title">{category.title}</h3>
                        <p className="exploration-description">{category.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
