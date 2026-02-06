import React from 'react';
import './DescriptionSection.css';

// Import Intro Page images for fallback
import heroImage from '../../assets/intro page/woman-wearing-hill-tribe-dress-strawberry-garden-doi-ang-khang-chiang-mai-thailand.jpg';
import cultureImage from '../../assets/intro page/pexels-north-bengal-tourism-2152588305-33769041.jpg';
import communityImage from '../../assets/intro page/nilotpal-kalita-IpRIguCAQes-unsplash.jpg';
import mapImage from '../../assets/intro page/pexels-amshiv-1476065-25311368.jpg';

const INTRO_IMAGES = [
    heroImage,
    cultureImage,
    communityImage,
    mapImage,
    // Reuse for 6-grid demo
    heroImage,
    cultureImage
];

/**
 * Description Section Component
 * 
 * Displays a collage of images on the left and a description block on the right.
 * Designed to take up full 100vh height.
 * 
 * Props:
 * @param {string} title - The title of the section (e.g., Region Name)
 * @param {string} description - The main description text
 * @param {Array} images - Array of image objects { url, caption } or strings. Failing that, uses Intro Page images.
 */
export default function DescriptionSection({
    title = "Experience the Unexplored",
    description,
    images = []
}) {
    // Use passed images if available, otherwise fallback to INTRO_IMAGES
    // Ensure we have at least 6 images for the grid by repeating if necessary
    let collageImages = (images && images.length > 0)
        ? images.map(img => typeof img === 'string' ? img : img.url)
        : INTRO_IMAGES;

    // Fill up to 6 images if needed
    while (collageImages.length < 6) {
        collageImages = [...collageImages, ...collageImages];
    }

    // Default Lorem Ipsum if no description provided
    const contentText = description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

    return (
        <section className="description-section">
            <div className="desc-container">
                {/* Left: Image Collage */}
                <div className="desc-collage">
                    <div className="collage-grid">
                        {collageImages.slice(0, 6).map((img, index) => (
                            <div
                                key={index}
                                className={`collage-item item-${index + 1}`}
                                style={{ backgroundImage: `url(${img})` }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Right: Content */}
                <div className="desc-content">
                    <div className="desc-text-wrapper">
                        <h2 className="desc-title">{title}</h2>
                        <div className="desc-separator"></div>
                        <p className="desc-paragraph">
                            {contentText}
                        </p>
                        {/* Book Now button removed as per request */}
                    </div>
                </div>
            </div>
        </section>
    );
}
