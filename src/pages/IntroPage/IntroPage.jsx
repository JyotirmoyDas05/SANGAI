import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './IntroPage.css';

// Local Images from assets folder
import heroImage from '../../assets/intro page/woman-wearing-hill-tribe-dress-strawberry-garden-doi-ang-khang-chiang-mai-thailand.jpg';
import cultureImage from '../../assets/intro page/pexels-north-bengal-tourism-2152588305-33769041.jpg';
import communityImage from '../../assets/intro page/nilotpal-kalita-IpRIguCAQes-unsplash.jpg';
import mapImage from '../../assets/intro page/pexels-amshiv-1476065-25311368.jpg';

const IMAGES = {
    hero: heroImage,
    culture: cultureImage,
    community: communityImage,
    map: mapImage,
};

export default function IntroPage() {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Lenis smooth scroll with enhanced settings
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        const sections = gsap.utils.toArray('.intro-section');
        const mm = gsap.matchMedia();

        // Desktop animations
        mm.add("(min-width: 769px)", () => {
            sections.forEach((section, index) => {
                const bg = section.querySelector('.intro-bg');
                const content = section.querySelector('.intro-content');
                const heading = section.querySelector('.intro-huge-text, .intro-heading');
                const subtitle = section.querySelector('.intro-subtitle, .intro-text');

                // Ken Burns effect on background (slow zoom)
                gsap.fromTo(bg,
                    { scale: 1.15 },
                    {
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.5,
                        },
                    }
                );

                // Parallax movement on background
                gsap.fromTo(bg,
                    { y: '-10%' },
                    {
                        y: '10%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        },
                    }
                );

                // Staggered heading reveal with clip-path
                if (heading) {
                    gsap.fromTo(heading,
                        {
                            y: 80,
                            opacity: 0,
                            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
                        },
                        {
                            y: 0,
                            opacity: 1,
                            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                            duration: 1.2,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 70%',
                                end: 'top 30%',
                                scrub: 1,
                            },
                        }
                    );
                }

                // Subtitle fade with delay
                if (subtitle) {
                    gsap.fromTo(subtitle,
                        { y: 40, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 60%',
                                end: 'top 25%',
                                scrub: 1,
                            },
                        }
                    );
                }

                // Exit animation (fade out as section leaves)
                if (index < sections.length - 1) {
                    gsap.to(content, {
                        y: -50,
                        opacity: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: 'bottom 60%',
                            end: 'bottom 20%',
                            scrub: true,
                        },
                    });
                }

                // Special CTA section effects
                if (section.classList.contains('intro-cta')) {
                    const btn = section.querySelector('.explore-btn');

                    // Background blur-to-clear transition
                    gsap.fromTo(bg,
                        { filter: 'blur(8px) brightness(0.4)' },
                        {
                            filter: 'blur(0px) brightness(0.6)',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 80%',
                                end: 'top 20%',
                                scrub: 1,
                            },
                        }
                    );

                    // Button entrance with bounce
                    if (btn) {
                        gsap.fromTo(btn,
                            { scale: 0.8, opacity: 0, y: 30 },
                            {
                                scale: 1,
                                opacity: 1,
                                y: 0,
                                ease: 'back.out(1.7)',
                                scrollTrigger: {
                                    trigger: section,
                                    start: 'top 50%',
                                    end: 'top 20%',
                                    scrub: 1,
                                },
                            }
                        );
                    }
                }
            });

            // First section special entrance (on page load)
            const firstSection = sections[0];
            if (firstSection) {
                const firstBg = firstSection.querySelector('.intro-bg');
                const firstContent = firstSection.querySelector('.intro-content');
                const scrollIndicator = firstSection.querySelector('.scroll-indicator');

                // Initial load animation timeline
                const tl = gsap.timeline({ delay: 0.3 });

                tl.fromTo(firstBg,
                    { scale: 1.3 },
                    { scale: 1.15, duration: 2, ease: 'power2.out' }
                )
                    .fromTo(firstContent,
                        { y: 60, opacity: 0 },
                        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
                        '-=1.5'
                    )
                    .fromTo(scrollIndicator,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', clearProps: 'transform' },
                        '-=0.5'
                    );
            }
        });

        // Mobile animations (simpler for performance)
        mm.add("(max-width: 768px)", () => {
            sections.forEach((section) => {
                const content = section.querySelector('.intro-content');

                gsap.fromTo(content,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 70%',
                            end: 'top 40%',
                            scrub: 1,
                        },
                    }
                );
            });
        });

        return () => {
            lenis.destroy();
            mm.revert();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div className="intro-container" ref={containerRef}>
            {/* SECTION 1: DISCOVER */}
            <section className="intro-section">
                <div
                    className="intro-bg"
                    style={{ backgroundImage: `url(${IMAGES.hero})` }}
                />
                <div className="intro-overlay text-center">
                    <div className="intro-content">
                        <h1 className="intro-huge-text">DISCOVER<br />THE NORTHEAST</h1>
                        <p className="intro-subtitle">Explore Northeast India beyond the usual places</p>
                    </div>
                </div>
                {/* Scroll indicator moved OUTSIDE intro-content to avoid transform stacking context */}
                <div className="scroll-indicator">
                    <span>Scroll to Explore</span>
                    <div className="line"></div>
                </div>
            </section>

            {/* SECTION 2: CULTURE */}
            <section className="intro-section">
                <div
                    className="intro-bg"
                    style={{ backgroundImage: `url(${IMAGES.culture})` }}
                />
                <div className="intro-overlay text-left">
                    <div className="intro-content">
                        <h2 className="intro-heading">CULTURE, HERITAGE<br />& STORIES</h2>
                        <p className="intro-text">
                            Learn the stories, history, and culture behind each place
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 3: LOCALS */}
            <section className="intro-section">
                <div
                    className="intro-bg"
                    style={{ backgroundImage: `url(${IMAGES.community})` }}
                />
                <div className="intro-overlay text-right">
                    <div className="intro-content">
                        <h2 className="intro-heading">LOCALS & LIVING<br />EXPERIENCES</h2>
                        <p className="intro-text">
                            Experience places through the people who live there
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 4: CTA */}
            <section className="intro-section intro-cta">
                <div
                    className="intro-bg"
                    style={{ backgroundImage: `url(${IMAGES.map})` }}
                />
                <div className="intro-overlay text-center">
                    <div className="intro-content">
                        <h2 className="intro-heading">READY TO<br />EXPLORE?</h2>
                        <button className="explore-btn" onClick={() => navigate('/explore')}>
                            Start Exploring the Northeast
                            <span className="btn-arrow">→</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
