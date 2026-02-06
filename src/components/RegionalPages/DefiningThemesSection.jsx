import React from 'react';
import './DefiningThemesSection.css';

// Import Intro Page images for fallback/default
import landscapeImg from '../../assets/intro page/woman-wearing-hill-tribe-dress-strawberry-garden-doi-ang-khang-chiang-mai-thailand.jpg';
import groupsImg from '../../assets/intro page/pexels-north-bengal-tourism-2152588305-33769041.jpg';
import routeImg from '../../assets/intro page/nilotpal-kalita-IpRIguCAQes-unsplash.jpg';
import ecoImg from '../../assets/intro page/pexels-amshiv-1476065-25311368.jpg';

// Default themes used when no API data is available
const DEFAULT_THEMES = [
    {
        id: 'landscape',
        title: 'Ancient Landscapes',
        description: 'From snow-capped peaks to living root bridges, hills and valleys that have shaped life for millennia.',
        image: { url: landscapeImg },
        icon: 'terrain'
    },
    {
        id: 'groups',
        title: 'Cultural Mosaic',
        description: 'Over 200 tribes, each with distinct languages, beliefs, and traditions woven into daily life.',
        image: { url: groupsImg },
        icon: 'diversity_3'
    },
    {
        id: 'route',
        title: 'Borderland Identity',
        description: 'A region where ancient trade routes meet, creating unique exchanges and resilient communities.',
        image: { url: routeImg },
        icon: 'explore'
    },
    {
        id: 'eco',
        title: 'Living Biodiversity',
        description: "One of the world's biodiversity hotspots, where communities have preserved nature for generations.",
        image: { url: ecoImg },
        icon: 'eco'
    }
];

/**
 * DefiningThemesSection - "What Defines This Land" section
 * @param {Array} themes - Array of theme objects from API (optional)
 * @param {String} title - Section title (optional, defaults to "What Defines This Land")
 */
export default function DefiningThemesSection({ themes, title = "What Defines This Land" }) {
    // Use provided themes if available and non-empty, otherwise use defaults
    const displayThemes = themes && themes.length > 0 ? themes : DEFAULT_THEMES;

    return (
        <section className="defining-themes-section">
            <div className="themes-header">
                <h2 className="themes-main-title">{title}</h2>
                <div className="themes-title-line"></div>
            </div>

            <div className="themes-scroll-container">
                {displayThemes.map((theme, index) => (
                    <div key={theme.id || index} className="theme-scroll-card">
                        <div className="theme-card-inner">
                            <div
                                className="theme-card-image"
                                style={{ backgroundImage: `url(${theme.image?.url || theme.image})` }}
                            >
                                <div className="theme-icon-circle">
                                    <span className="material-symbols-outlined">{theme.icon}</span>
                                </div>
                            </div>
                            <div className="theme-card-content">
                                <h3 className="theme-card-title">{theme.title}</h3>
                                <p className="theme-card-desc">{theme.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

