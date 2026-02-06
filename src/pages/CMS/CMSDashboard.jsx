import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CMSHeroManager from './CMSHeroManager';
import CMSStateContentManager from './CMSStateContentManager';
import CMSCulturalContent from './CMSCulturalContent';
import CMSCollageManager from './CMSCollageManager';
import CMSDefiningThemesManager from './CMSDefiningThemesManager';
import CMSContributionsManager from './CMSContributionsManager';

export default function CMSDashboard() {
    const [activeTab, setActiveTab] = useState('festivals'); // tabs: festivals, destinations, hero-images, cultural-content, state-content, collage-images, defining-themes, contributions
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Helper to get auth header
    const getAuthHeader = () => {
        return { 'Authorization': sessionStorage.getItem('cms_auth') };
    };

    useEffect(() => {
        // Skip fetching items if tab is specialized component
        if (activeTab === 'hero-images' || activeTab === 'state-content' || activeTab === 'cultural-content' || activeTab === 'collage-images' || activeTab === 'defining-themes' || activeTab === 'contributions') return;
        fetchItems();
    }, [activeTab]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const endpoint = activeTab === 'festivals' ? '/cms/festivals' : '/cms/destinations';

            const res = await fetch(`${API_BASE}${endpoint}`, {
                headers: getAuthHeader()
            });
            const data = await res.json();

            if (data.success) {
                setItems(data.data);
            } else {
                setError(data.error);
                if (res.status === 401 || res.status === 403) {
                    sessionStorage.removeItem('cms_auth');
                    window.location.reload();
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This cannot be undone.')) return;

        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const endpoint = activeTab === 'festivals' ? `/cms/festivals/${id}` : `/cms/destinations/${id}`;

            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });

            if (res.ok) {
                setItems(items.filter(i => i._id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading && items.length === 0 && activeTab !== 'hero-images' && activeTab !== 'state-content' && activeTab !== 'cultural-content' && activeTab !== 'collage-images' && activeTab !== 'defining-themes' && activeTab !== 'contributions') return <div className="cms-content">Loading...</div>;

    return (
        <div className="cms-dashboard">
            <div className="dashboard-header">
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <h1 style={{ margin: 0 }}>CMS Dashboard</h1>
                    <div className="tabs" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setActiveTab('festivals')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: activeTab === 'festivals' ? '#333' : '#eee',
                                color: activeTab === 'festivals' ? 'white' : 'black',
                                cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            Festivals
                        </button>
                        <button
                            onClick={() => setActiveTab('destinations')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: activeTab === 'destinations' ? '#333' : '#eee',
                                color: activeTab === 'destinations' ? 'white' : 'black',
                                cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            Destinations
                        </button>
                        <button
                            onClick={() => setActiveTab('hero-images')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: activeTab === 'hero-images' ? '#333' : '#eee',
                                color: activeTab === 'hero-images' ? 'white' : 'black',
                                cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            Hero Images
                        </button>
                        <button
                            onClick={() => setActiveTab('state-content')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: activeTab === 'state-content' ? '#333' : '#eee',
                                color: activeTab === 'state-content' ? 'white' : 'black',
                                cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            State Content
                        </button>
                        <button
                            onClick={() => setActiveTab('cultural-content')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: activeTab === 'cultural-content' ? '#333' : '#eee',
                                color: activeTab === 'cultural-content' ? 'white' : 'black',
                                cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            Cultural Content
                        </button>
                        <button
                            onClick={() => setActiveTab('collage-images')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: activeTab === 'collage-images' ? '#333' : '#eee',
                                color: activeTab === 'collage-images' ? 'white' : 'black',
                                cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            Collage Images
                        </button>
                        <button
                            onClick={() => setActiveTab('defining-themes')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: activeTab === 'defining-themes' ? '#333' : '#eee',
                                color: activeTab === 'defining-themes' ? 'white' : 'black',
                                cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            Defining Themes
                        </button>
                        <button
                            onClick={() => setActiveTab('contributions')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: activeTab === 'contributions' ? '#333' : '#eee',
                                color: activeTab === 'contributions' ? 'white' : 'black',
                                cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            Contributions
                        </button>
                    </div>
                </div>
                {activeTab !== 'hero-images' && activeTab !== 'state-content' && activeTab !== 'cultural-content' && activeTab !== 'collage-images' && activeTab !== 'defining-themes' && activeTab !== 'contributions' && (
                    <Link to={activeTab === 'festivals' ? "/dev-cms/festivals/new" : "/dev-cms/destinations/new"} className="add-btn">
                        + Add New {activeTab === 'festivals' ? 'Festival' : 'Destination'}
                    </Link>
                )}
            </div>

            {error && activeTab !== 'hero-images' && activeTab !== 'state-content' && activeTab !== 'cultural-content' && <div className="error">{error}</div>}

            <div style={{ padding: '20px' }}>
                {activeTab === 'defining-themes' ? (
                    <CMSDefiningThemesManager />
                ) : activeTab === 'collage-images' ? (
                    <CMSCollageManager />
                ) : activeTab === 'cultural-content' ? (
                    <CMSCulturalContent />
                ) : activeTab === 'state-content' ? (
                    <CMSStateContentManager />
                ) : activeTab === 'hero-images' ? (
                    <CMSHeroManager />
                ) : activeTab === 'contributions' ? (
                    <CMSContributionsManager />
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type/Category</th>
                                <th>{activeTab === 'festivals' ? 'Dates' : 'District'}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {/* Handle varied image structures */}
                                            {(item.images?.preview || (Array.isArray(item.images) && item.images[0]?.url) || (Array.isArray(item.images) && typeof item.images[0] === 'string' && item.images[0])) && (
                                                <img
                                                    src={item.images?.preview || item.images[0]?.url || item.images[0]}
                                                    alt=""
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            )}
                                            {item.name}
                                        </div>
                                    </td>
                                    <td>{item.category || item.type}</td>
                                    <td>
                                        {activeTab === 'festivals' ? (
                                            item.latestOccurrence ? (
                                                <>
                                                    {new Date(item.latestOccurrence.startDate).toLocaleDateString()}
                                                    {' - '}
                                                    {new Date(item.latestOccurrence.endDate).toLocaleDateString()}
                                                </>
                                            ) : 'No active dates'
                                        ) : (
                                            item.districtId?.name || item.districtId?.districtName || (typeof item.districtId === 'string' ? item.districtId : 'Unknown District')
                                        )}
                                    </td>
                                    <td>
                                        <button className="action-btn edit" onClick={() => navigate(`/dev-cms/${activeTab}/edit/${item._id}`)}>✏️</button>
                                        <button className="action-btn delete" onClick={() => handleDelete(item._id)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>No {activeTab} found. Create one!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
