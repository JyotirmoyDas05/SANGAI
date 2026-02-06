import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
    { id: 'festivals', label: 'Festivals', icon: '🎉' },
    { id: 'music', label: 'Music & Dance', icon: '🎵' },
    { id: 'attire', label: 'Woven Attire', icon: '👘' },
    { id: 'food', label: 'Traditional Food', icon: '🍲' },
    { id: 'wildlife', label: 'Wild Sanctuaries', icon: '🦌' },
];

const SCOPES = [
    { id: 'region', label: 'Region (Northeast)' },
    { id: 'state', label: 'State-specific' },
];

export default function CMSCulturalContent() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterScope, setFilterScope] = useState('');
    const navigate = useNavigate();

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const getAuthHeader = () => ({ 'Authorization': sessionStorage.getItem('cms_auth') });

    useEffect(() => {
        fetchItems();
    }, [filterCategory, filterScope]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterCategory) params.append('category', filterCategory);
            if (filterScope) params.append('scope', filterScope);

            const res = await fetch(`${API_BASE}/cms/cultural-items?${params}`, {
                headers: getAuthHeader()
            });
            const data = await res.json();
            if (data.success) {
                setItems(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch items:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this cultural item? This cannot be undone.')) return;

        try {
            const res = await fetch(`${API_BASE}/cms/cultural-items/${id}`, {
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

    const getCategoryLabel = (categoryId) => {
        const cat = CATEGORIES.find(c => c.id === categoryId);
        return cat ? `${cat.icon} ${cat.label}` : categoryId;
    };

    const getScopeLabel = (scope) => {
        if (scope?.type === 'state' && scope?.stateCode) {
            return `State: ${scope.stateCode}`;
        }
        return 'Region (NE)';
    };

    return (
        <div className="cultural-content-manager" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Cultural Content Manager</h2>
                    <p style={{ color: '#666', marginTop: '4px' }}>
                        Manage festivals, music, food, attire, and wildlife items
                    </p>
                </div>
                <button
                    onClick={() => navigate('/dev-cms/cultural-items/new')}
                    style={{
                        background: '#333',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    + Add New Item
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '13px' }}>
                        Category
                    </label>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        style={{ padding: '8px 12px', fontSize: '14px', minWidth: '150px' }}
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '13px' }}>
                        Scope
                    </label>
                    <select
                        value={filterScope}
                        onChange={(e) => setFilterScope(e.target.value)}
                        style={{ padding: '8px 12px', fontSize: '14px', minWidth: '150px' }}
                    >
                        <option value="">All Scopes</option>
                        {SCOPES.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Items Table */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5' }}>
                            <th style={{ textAlign: 'left', padding: '12px' }}>Item</th>
                            <th style={{ textAlign: 'left', padding: '12px' }}>Category</th>
                            <th style={{ textAlign: 'left', padding: '12px' }}>Scope</th>
                            <th style={{ textAlign: 'left', padding: '12px' }}>Location</th>
                            <th style={{ textAlign: 'center', padding: '12px' }}>Status</th>
                            <th style={{ textAlign: 'center', padding: '12px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {item.images?.[0]?.url && (
                                            <img
                                                src={item.images[0].url}
                                                alt=""
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                                            />
                                        )}
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{item.name}</div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>{item.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '12px' }}>{getCategoryLabel(item.category)}</td>
                                <td style={{ padding: '12px' }}>{getScopeLabel(item.scope)}</td>
                                <td style={{ padding: '12px' }}>{item.location || '-'}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        background: item.isPublished ? '#d4fdd4' : '#fdd',
                                        color: item.isPublished ? '#080' : '#800'
                                    }}>
                                        {item.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => navigate(`/dev-cms/cultural-items/edit/${item._id}`)}
                                        style={{
                                            background: '#eee',
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '8px'
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        style={{
                                            background: '#fee',
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            color: '#c00'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                                    No cultural items found. Create your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <div style={{ marginTop: '16px', color: '#888', fontSize: '13px' }}>
                Showing {items.length} item(s)
            </div>
        </div>
    );
}
