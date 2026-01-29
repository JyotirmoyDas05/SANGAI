/**
 * StateGlance - Soft facts display for state pages
 * Section 2 for State pages
 */
import './RegionalPages.css';

export default function StateGlance({ glance = {} }) {
    const items = [
        { icon: 'location_city', label: 'Capital', value: glance.capital },
        { icon: 'landscape', label: 'Landscape', value: glance.landscapeType },
        { icon: 'translate', label: 'Languages', value: glance.languages?.join(', ') },
        { icon: 'thermostat', label: 'Climate', value: glance.climate },
        { icon: 'group', label: 'Population', value: glance.population },
        { icon: 'straighten', label: 'Area', value: glance.area }
    ].filter(item => item.value);

    if (!items.length) return null;

    return (
        <section className="glance-section">
            <h2 className="section-title">At a Glance</h2>

            <div className="glance-grid">
                {items.map((item, index) => (
                    <div className="glance-item" key={index}>
                        <div className="glance-icon">
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <div className="glance-content">
                            <span className="glance-label">{item.label}</span>
                            <span className="glance-value">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
