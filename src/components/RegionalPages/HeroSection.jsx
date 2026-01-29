/**
 * HeroSection - Immersive hero with image and overlaid text
 * Used for Region, State, and District pages
 */
import './RegionalPages.css';

export default function HeroSection({
    title,
    tagline,
    subtitle,
    heroImage,
    badge,
    size = 'large' // 'large' | 'medium' | 'small'
}) {
    const heroStyle = heroImage?.url ? {
        backgroundImage: `url(${heroImage.url})`
    } : {};

    return (
        <section className={`hero-section hero-${size}`} style={heroStyle}>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                {badge && (
                    <div className="hero-badge">
                        <span className="material-symbols-outlined">{badge.icon || 'public'}</span>
                        <span>{badge.text || tagline}</span>
                    </div>
                )}

                <h1 className="hero-title">{title}</h1>

                {subtitle && (
                    <p className="hero-subtitle">{subtitle}</p>
                )}

                {heroImage?.caption && (
                    <span className="hero-caption">{heroImage.caption}</span>
                )}
            </div>
        </section>
    );
}
