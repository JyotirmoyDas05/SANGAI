import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CMSDashboard() {
    const [festivals, setFestivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Helper to get auth header
    const getAuthHeader = () => {
        return { 'Authorization': sessionStorage.getItem('cms_auth') };
    };

    useEffect(() => {
        fetchFestivals();
    }, []);

    const fetchFestivals = async () => {
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const res = await fetch(`${API_BASE}/cms/festivals`, {
                headers: getAuthHeader()
            });
            const data = await res.json();

            if (data.success) {
                setFestivals(data.data);
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
            const res = await fetch(`${API_BASE}/cms/festivals/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });

            if (res.ok) {
                setFestivals(festivals.filter(f => f._id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="cms-content">Loading...</div>;

    return (
        <div className="cms-dashboard">
            <div className="dashboard-header">
                <h1>All Festivals</h1>
                <Link to="/dev-cms/festivals/new" className="add-btn">+ Add New Festival</Link>
            </div>

            {error && <div className="error">{error}</div>}

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Dates</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {festivals.map(festival => (
                        <tr key={festival._id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {festival.images?.preview && (
                                        <img
                                            src={festival.images.preview}
                                            alt=""
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    )}
                                    {festival.name}
                                </div>
                            </td>
                            <td>{festival.category}</td>
                            <td>
                                {festival.latestOccurrence ? (
                                    <>
                                        {new Date(festival.latestOccurrence.startDate).toLocaleDateString()}
                                        {' - '}
                                        {new Date(festival.latestOccurrence.endDate).toLocaleDateString()}
                                    </>
                                ) : 'No active dates'}
                            </td>
                            <td>
                                <button className="action-btn edit" onClick={() => navigate(`/dev-cms/festivals/edit/${festival._id}`)}>✏️</button>
                                <button className="action-btn delete" onClick={() => handleDelete(festival._id)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                    {festivals.length === 0 && (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>No festivals found. Create one!</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
