/**
 * DefiningThemesGrid - Icon-based theme cards
 * Section 2 for Region pages
 */
import './RegionalPages.css';

export default function DefiningThemesGrid({ themes = [], title = "What Defines This Region" }) {
    if (!themes.length) return null;

    return (
        <section className="defining-themes-section">
            <h2 className="section-title">{title}</h2>

            <div className="themes-grid">
                {themes.map((theme, index) => (
                    <div className="theme-card" key={index}>
                        <div className="theme-icon">
                            <span className="material-symbols-outlined">
                                {theme.icon || 'category'}
                            </span>
                        </div>
                        <h3 className="theme-title">{theme.title}</h3>
                        <p className="theme-description">{theme.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
