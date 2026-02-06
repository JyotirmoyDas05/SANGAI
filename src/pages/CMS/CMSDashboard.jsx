import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CMSHeroManager from './CMSHeroManager'; // Import the new manager

export default function CMSDashboard() {
    const [activeTab, setActiveTab] = useState('festivals'); // 'festivals', 'destinations', 'hero-images'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Helper to get auth header
    const getAuthHeader = () => {
        return { 'Authorization': sessionStorage.getItem('cms_auth') };
    };

    useEffect(() => {
        // Skip fetching items if tab is hero-images
        if (activeTab === 'hero-images') return;
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

    if (loading && items.length === 0 && activeTab !== 'hero-images') return <div className="cms-content">Loading...</div>;

    return (
        <div className="cms-dashboard">
            <div className="dashboard-header">
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <h1 style={{ margin: 0 }}>CMS Dashboard</h1>
                    <div className="tabs" style={{ display: 'flex', gap: '10px' }}>
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
                    </div>
                </div>
                {activeTab !== 'hero-images' && (
                    <Link to={activeTab === 'festivals' ? "/dev-cms/festivals/new" : "/dev-cms/destinations/new"} className="add-btn">
                        + Add New {activeTab === 'festivals' ? 'Festival' : 'Destination'}
                    </Link>
                )}
            </div>

            {error && activeTab !== 'hero-images' && <div className="error">{error}</div>}

            {activeTab === 'hero-images' ? (
                <CMSHeroManager />
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
    );
}
