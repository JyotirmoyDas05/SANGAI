/**
 * NarrativeBlock - Short story sections with visual breathing
 * Section 3 for Region pages (Shared Story)
 */
import './RegionalPages.css';

export default function NarrativeBlock({
    paragraphs = [],
    title,
    tone = 'philosophical',
    align = 'center' // 'left' | 'center' | 'right'
}) {
    if (!paragraphs.length) return null;

    return (
        <section className={`narrative-section narrative-${align} narrative-${tone}`}>
            {title && <h2 className="section-title">{title}</h2>}

            <div className="narrative-content">
                {paragraphs.map((para, index) => (
                    <p key={index} className="narrative-paragraph">
                        {para}
                    </p>
                ))}
            </div>
        </section>
    );
}
