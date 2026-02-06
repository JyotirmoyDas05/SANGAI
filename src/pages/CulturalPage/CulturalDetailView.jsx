import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { getCulturalItem } from '../../api/apiService';
import './CulturalDetailView.css';

export default function CulturalDetailView() {
    const { stateSlug, category, id } = useParams();
    const navigate = useNavigate();
    const [viewData, setViewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const viewRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await getCulturalItem(category, id);
                setViewData(data);
            } catch (err) {
                console.error("Failed to fetch cultural item:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [category, id]);

    useEffect(() => {
        if (!viewData) return;

        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            gsap.fromTo('.cd-hero-content',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
            );

            gsap.fromTo('.cd-content',
                { opacity: 0 },
                { opacity: 1, duration: 1, delay: 0.3 }
            );
        }, viewRef);

        return () => ctx.revert();
    }, [viewData]);

    if (loading) {
        return (
            <div className="cultural-detail-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#22c55e', fontSize: '1.2rem' }}>Loading...</div>
            </div>
        );
    }

    if (error || !viewData) {
        return (
            <div className="cultural-detail-view" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <h2 style={{ color: '#fff' }}>Content not found</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>We couldn't find the cultural item you're looking for.</p>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    const { name, location, images, story, scope, shortDescription, tags, isHiddenGem } = viewData;
    const heroImage = images?.[0]?.url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2000';
    const regionLabel = scope?.stateCode || 'Northeast';
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

    return (
        <div className="cultural-detail-view" ref={viewRef}>
            {/* HERO SECTION */}
            <section className="cd-hero">
                <div className="cd-hero-image">
                    <img src={heroImage} alt={name} />
                </div>
                <div className="cd-hero-overlay">
                    <div className="cd-hero-content">
                        <span className="cd-hero-badge">
                            {categoryLabel} • {location || regionLabel}
                            {isHiddenGem && <span className="hidden-gem">✨ Hidden Gem</span>}
                        </span>
                        <h1 className="cd-hero-title">{name}</h1>
                        {shortDescription && (
                            <p className="cd-hero-subtitle">{shortDescription}</p>
                        )}
                    </div>

                    <div className="cd-breadcrumb-strip">
                        <div className="cd-container">
                            <nav className="cd-breadcrumbs">
                                <Link to="/">
                                    <span className="material-symbols-outlined">home</span>
                                </Link>
                                <span className="separator">/</span>
                                <Link to="/northeast">Northeast</Link>
                                {stateSlug && (
                                    <>
                                        <span className="separator">/</span>
                                        <Link to={`/northeast/${stateSlug}`}>{stateSlug}</Link>
                                    </>
                                )}
                                <span className="separator">/</span>
                                <Link to={stateSlug ? `/northeast/${stateSlug}/culture/${category}` : `/northeast/culture/${category}`}>
                                    {categoryLabel}
                                </Link>
                                <span className="separator">/</span>
                                <span className="current">{name}</span>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section className="cd-content">
                {/* LEFT COLUMN - TEXT */}
                <div className="cd-main-info">
                    {/* The Story */}
                    {story?.overview && (
                        <div>
                            <h2 className="cd-section-title">The Story</h2>
                            <p className="cd-description">{story.overview}</p>
                        </div>
                    )}

                    {/* Cultural Significance */}
                    {story?.significance && (
                        <div className="cd-story-section">
                            <h3>Cultural Significance</h3>
                            <p>{story.significance}</p>
                        </div>
                    )}

                    {/* Local Insight */}
                    {story?.localInsight && (
                        <div className="cd-insight-box">
                            <h4>
                                <span className="material-symbols-outlined">lightbulb</span>
                                Local Insight
                            </h4>
                            <p>"{story.localInsight}"</p>
                        </div>
                    )}

                    {/* Fallback if no story */}
                    {!story?.overview && !story?.significance && (
                        <div>
                            <h2 className="cd-section-title">About</h2>
                            <p className="cd-description">
                                {shortDescription || `${name} represents a unique aspect of the cultural heritage of ${location || 'Northeast India'}.`}
                            </p>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN - IMAGES */}
                <div className="cd-media-column">
                    {images && images.length > 1 ? (
                        <div className="cd-gallery-grid">
                            {images.map((img, idx) => (
                                <div key={idx} className="cd-gallery-item">
                                    <img src={img.url} alt={`${name} - ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="cd-content-image-wrapper">
                            <img src={heroImage} alt={name} className="cd-content-image" />
                        </div>
                    )}
                </div>

                {/* DETAILS GRID */}
                <div className="cd-details-grid">
                    {/* Location */}
                    {location && (
                        <div className="cd-detail-item">
                            <span className="material-symbols-outlined cd-detail-icon">location_on</span>
                            <span className="cd-detail-label">Location</span>
                            <span className="cd-detail-value">{location}</span>
                        </div>
                    )}

                    {/* Category */}
                    <div className="cd-detail-item">
                        <span className="material-symbols-outlined cd-detail-icon">category</span>
                        <span className="cd-detail-label">Category</span>
                        <span className="cd-detail-value">{categoryLabel}</span>
                    </div>

                    {/* Tags */}
                    {tags && tags.length > 0 && (
                        <div className="cd-detail-item">
                            <span className="material-symbols-outlined cd-detail-icon">tag</span>
                            <span className="cd-detail-label">Tags</span>
                            <div className="cd-tags">
                                {tags.map(tag => (
                                    <span key={tag} className="cd-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
