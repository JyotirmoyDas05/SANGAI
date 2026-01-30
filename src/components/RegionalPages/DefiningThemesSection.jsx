import React from 'react';
import './DefiningThemesSection.css';

// Import Intro Page images for placeholder
import landscapeImg from '../../assets/intro page/woman-wearing-hill-tribe-dress-strawberry-garden-doi-ang-khang-chiang-mai-thailand.jpg';
import groupsImg from '../../assets/intro page/pexels-north-bengal-tourism-2152588305-33769041.jpg';
import routeImg from '../../assets/intro page/nilotpal-kalita-IpRIguCAQes-unsplash.jpg';
import ecoImg from '../../assets/intro page/pexels-amshiv-1476065-25311368.jpg';

const THEMES = [
    {
        id: 'landscape',
        tag: 'landscape',
        title: 'Ancient Landscapes',
        description: 'From snow-capped peaks to living root bridges, hills and valleys that have shaped life for millennia.',
        image: landscapeImg,
        icon: 'terrain'
    },
    {
        id: 'groups',
        tag: 'groups',
        title: 'Cultural Mosaic',
        description: 'Over 200 tribes, each with distinct languages, beliefs, and traditions woven into daily life.',
        image: groupsImg,
        icon: 'diversity_3'
    },
    {
        id: 'route',
        tag: 'route',
        title: 'Borderland Identity',
        description: 'A region where ancient trade routes meet, creating unique exchanges and resilient communities.',
        image: routeImg,
        icon: 'explore'
    },
    {
        id: 'eco',
        tag: 'eco',
        title: 'Living Biodiversity',
        description: "One of the world's biodiversity hotspots, where communities have preserved nature for generations.",
        image: ecoImg,
        icon: 'eco'
    }
];

export default function DefiningThemesSection() {
    return (
        <section className="defining-themes-section">
            <div className="themes-header">
                <h2 className="themes-main-title">What Defines This Land</h2>
                <div className="themes-title-line"></div>
            </div>

            <div className="themes-scroll-container">
                {THEMES.map((theme) => (
                    <div key={theme.id} className="theme-scroll-card">
                        <div className="theme-card-inner">
                            <div
                                className="theme-card-image"
                                style={{ backgroundImage: `url(${theme.image})` }}
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
