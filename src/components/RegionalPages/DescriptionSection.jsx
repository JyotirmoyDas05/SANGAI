import React from 'react';
import './DescriptionSection.css';

// Import Intro Page images for fallback
import heroImage from '../../assets/intro page/woman-wearing-hill-tribe-dress-strawberry-garden-doi-ang-khang-chiang-mai-thailand.jpg';
import cultureImage from '../../assets/intro page/pexels-north-bengal-tourism-2152588305-33769041.jpg';
import communityImage from '../../assets/intro page/nilotpal-kalita-IpRIguCAQes-unsplash.jpg';
import mapImage from '../../assets/intro page/pexels-amshiv-1476065-25311368.jpg';

const INTRO_IMAGES = [heroImage, cultureImage, communityImage, mapImage];

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
    // FORCE usage of Intro Page images for now as per specific user request
    // "use the images used in the intro page for all places for now"
    const collageImages = INTRO_IMAGES;

    // Default Lorem Ipsum if no description provided
    const contentText = description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

    return (
        <section className="description-section">
            <div className="desc-container">
                {/* Left: Image Collage */}
                <div className="desc-collage">
                    <div className="collage-grid">
                        <div className="collage-item item-1" style={{ backgroundImage: `url(${collageImages[0]})` }}></div>
                        <div className="collage-item item-2" style={{ backgroundImage: `url(${collageImages[1]})` }}></div>
                        <div className="collage-item item-3" style={{ backgroundImage: `url(${collageImages[2]})` }}></div>
                        <div className="collage-item item-4" style={{ backgroundImage: `url(${collageImages[3]})` }}></div>
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
