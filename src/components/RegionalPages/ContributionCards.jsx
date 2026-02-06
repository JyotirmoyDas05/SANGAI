/**
 * ContributionCards - Impact/contribution display
 * Section 6 for Region pages (Ecological & Cultural Contribution)
 */
import './ContributionCards.css';

import boatImg from '../../assets/intro page/nilotpal-kalita-IpRIguCAQes-unsplash.jpg';
import teaImg from '../../assets/intro page/pexels-amshiv-1476065-25311368.jpg';
import cultureImg from '../../assets/intro page/pexels-north-bengal-tourism-2152588305-33769041.jpg';
import craftImg from '../../assets/intro page/woman-wearing-hill-tribe-dress-strawberry-garden-doi-ang-khang-chiang-mai-thailand.jpg';

const CATEGORY_ICONS = {
    'Biodiversity': 'eco',
    'Knowledge': 'psychology',
    'Agriculture': 'agriculture',
    'Crafts': 'brush',
    'Culture': 'theater_comedy',
    'Ecology': 'forest',
    'Ideas': 'lightbulb'
};

const CATEGORY_IMAGES = {
    'Biodiversity': teaImg,
    'Knowledge': cultureImg,
    'Agriculture': teaImg,
    'Crafts': craftImg,
    'Culture': cultureImg,
    'Ecology': boatImg,
    'Ideas': boatImg
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
                        <div className="card-image-container">
                            <img
                                src={contribution.image?.url || CATEGORY_IMAGES[contribution.category] || boatImg}
                                alt={contribution.image?.caption || contribution.category}
                                className="card-image"
                            />
                            <div className="card-icon-circle">
                                <span className="material-symbols-outlined">
                                    {contribution.icon || CATEGORY_ICONS[contribution.category] || 'star'}
                                </span>
                            </div>
                        </div>
                        <div className="contribution-card-content">
                            <h3 className="contribution-card-title">
                                {contribution.title}
                            </h3>
                            <p className="contribution-card-desc">
                                {contribution.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
