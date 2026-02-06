import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CATEGORIES = [
    { id: 'festivals', label: 'Festivals' },
    { id: 'music', label: 'Music & Dance' },
    { id: 'attire', label: 'Woven Attire' },
    { id: 'food', label: 'Traditional Food' },
    { id: 'wildlife', label: 'Wild Sanctuaries' },
];

const STATE_CODES = [
    { code: 'MN', name: 'Manipur' },
    { code: 'AS', name: 'Assam' },
    { code: 'ML', name: 'Meghalaya' },
    { code: 'NL', name: 'Nagaland' },
    { code: 'AR', name: 'Arunachal Pradesh' },
    { code: 'MZ', name: 'Mizoram' },
    { code: 'TR', name: 'Tripura' },
    { code: 'SK', name: 'Sikkim' },
];

export default function CMSCulturalItemEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: 'festivals',
        scopeType: 'region',
        stateCode: '',
        location: '',
        shortDescription: '',
        images: [],
        story: { overview: '', significance: '', localInsight: '' },
        isHiddenGem: false,
        isPublished: true,
        tags: ''
    });

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const getAuthHeader = () => ({ 'Authorization': sessionStorage.getItem('cms_auth') });

    useEffect(() => {
        if (isEdit) {
            fetchItem();
        }
    }, [id]);

    const fetchItem = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/cms/cultural-items/${id}`, {
                headers: getAuthHeader()
            });
            const data = await res.json();
            if (data.success && data.data) {
                const item = data.data;
                setFormData({
                    name: item.name || '',
                    category: item.category || 'festivals',
                    scopeType: item.scope?.type || 'region',
                    stateCode: item.scope?.stateCode || '',
                    location: item.location || '',
                    shortDescription: item.shortDescription || '',
                    images: item.images || [],
                    story: item.story || { overview: '', significance: '', localInsight: '' },
                    isHiddenGem: item.isHiddenGem || false,
                    isPublished: item.isPublished !== false,
                    tags: (item.tags || []).join(', ')
                });
            }
        } catch (err) {
            setError('Failed to load item');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const payload = {
                name: formData.name,
                category: formData.category,
                scope: {
                    type: formData.scopeType,
                    regionId: 'NE',
                    stateCode: formData.scopeType === 'state' ? formData.stateCode : null
                },
                location: formData.location,
                shortDescription: formData.shortDescription,
                images: formData.images,
                story: formData.story,
                isHiddenGem: formData.isHiddenGem,
                isPublished: formData.isPublished,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
            };

            const url = isEdit
                ? `${API_BASE}/cms/cultural-items/${id}`
                : `${API_BASE}/cms/cultural-items`;

            const res = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                navigate('/dev-cms', { state: { activeTab: 'cultural-content' } });
            } else {
                setError(data.error || 'Failed to save');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            const res = await fetch(`${API_BASE}/cms/upload`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: formDataUpload
            });
            const data = await res.json();
            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, { url: data.url, caption: '', isPrimary: prev.images.length === 0 }]
                }));
            }
        } catch (err) {
            alert('Failed to upload image');
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/dev-cms')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <h2 style={{ marginBottom: '24px' }}>
                {isEdit ? 'Edit Cultural Item' : 'Add New Cultural Item'}
            </h2>

            {error && (
                <div style={{ background: '#fee', color: '#c00', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <section style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0 }}>Basic Information</h3>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Hornbill Festival"
                            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g., Nagaland"
                                style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Short Description</label>
                        <textarea
                            value={formData.shortDescription}
                            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                            placeholder="Brief description for cards..."
                            rows={2}
                            style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                        />
                    </div>
                </section>

                {/* Scope */}
                <section style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0 }}>Scope</h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Region-level items appear on /northeast/culture. State-level items appear on /northeast/[state]/culture.
                    </p>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                checked={formData.scopeType === 'region'}
                                onChange={() => setFormData({ ...formData, scopeType: 'region', stateCode: '' })}
                            />
                            Region (Northeast)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                checked={formData.scopeType === 'state'}
                                onChange={() => setFormData({ ...formData, scopeType: 'state' })}
                            />
                            State-specific
                        </label>
                    </div>

                    {formData.scopeType === 'state' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Select State</label>
                            <select
                                value={formData.stateCode}
                                onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
                                style={{ padding: '10px', fontSize: '14px', minWidth: '200px' }}
                            >
                                <option value="">-- Select State --</option>
                                {STATE_CODES.map(s => (
                                    <option key={s.code} value={s.code}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </section>

                {/* Images */}
                <section style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0 }}>Images</h3>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {formData.images.map((img, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <img
                                    src={img.url}
                                    alt=""
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: '#c00',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                        style={{ display: 'none' }}
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            background: '#eee',
                            border: '1px dashed #999',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        + Upload Image
                    </label>
                </section>

                {/* Story Content */}
                <section style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0 }}>Story Content</h3>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Overview</label>
                        <textarea
                            value={formData.story.overview}
                            onChange={(e) => setFormData({ ...formData, story: { ...formData.story, overview: e.target.value } })}
                            placeholder="Main description of this cultural item..."
                            rows={4}
                            style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Cultural Significance</label>
                        <textarea
                            value={formData.story.significance}
                            onChange={(e) => setFormData({ ...formData, story: { ...formData.story, significance: e.target.value } })}
                            placeholder="Why is this culturally important..."
                            rows={3}
                            style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Local Insight</label>
                        <textarea
                            value={formData.story.localInsight}
                            onChange={(e) => setFormData({ ...formData, story: { ...formData.story, localInsight: e.target.value } })}
                            placeholder="Tips or perspectives from locals..."
                            rows={2}
                            style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                        />
                    </div>
                </section>

                {/* Options */}
                <section style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0 }}>Options</h3>

                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.isHiddenGem}
                                onChange={(e) => setFormData({ ...formData, isHiddenGem: e.target.checked })}
                            />
                            Mark as Hidden Gem
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            />
                            Published
                        </label>
                    </div>

                    <div style={{ marginTop: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="e.g., festival, traditional, winter"
                            style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                        />
                    </div>
                </section>

                {/* Submit */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            background: '#333',
                            color: 'white',
                            padding: '14px 32px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    >
                        {saving ? 'Saving...' : (isEdit ? 'Update Item' : 'Create Item')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dev-cms')}
                        style={{
                            background: '#eee',
                            color: '#333',
                            padding: '14px 32px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
