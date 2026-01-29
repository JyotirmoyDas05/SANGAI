/**
 * VoicesSection - Local quotes and anecdotes
 * Section 7 for District pages
 */
import './RegionalPages.css';

export default function VoicesSection({ voices = {} }) {
    const hasContent = voices.localQuote || voices.folkBelief || voices.anecdote;

    if (!hasContent) return null;

    return (
        <section className="voices-section">
            <h2 className="section-title">Voices & Stories</h2>

            <div className="voices-content">
                {voices.localQuote && (
                    <blockquote className="local-quote">
                        <span className="quote-icon">
                            <span className="material-symbols-outlined">format_quote</span>
                        </span>
                        <p>"{voices.localQuote}"</p>
                        {voices.quoteSpeaker && (
                            <cite>— {voices.quoteSpeaker}</cite>
                        )}
                    </blockquote>
                )}

                {voices.folkBelief && (
                    <div className="folk-belief">
                        <span className="belief-icon">
                            <span className="material-symbols-outlined">auto_stories</span>
                        </span>
                        <p>{voices.folkBelief}</p>
                    </div>
                )}

                {voices.anecdote && (
                    <div className="anecdote">
                        <p>{voices.anecdote}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
