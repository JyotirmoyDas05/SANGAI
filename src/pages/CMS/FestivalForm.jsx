import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function FestivalForm() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const previewUrlRef = useRef(null);
    const heroUrlRef = useRef(null);
    const contentUrlRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        stateId: '',
        districtId: '', // district slug
        category: 'Cultural',
        tagline: '',
        description: '',
        venue: '',
        startDate: '',
        endDate: '',
        bookingLink: '',
        ecoCertified: false,
        previewImage: '',
        heroImages: [], // Array of strings
        contentImages: [],
        tags: ''
    });

    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Fetch initial data (states) and festival if editing
    useEffect(() => {
        fetchStates();
    }, []);

    // When state changes, fetch districts
    useEffect(() => {
        if (formData.stateId) {
            fetchDistricts(formData.stateId);
        } else {
            setDistricts([]);
        }
    }, [formData.stateId]);

    const getAuthHeader = () => ({ 'Authorization': sessionStorage.getItem('cms_auth') });
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    const fetchStates = async () => {
        const res = await fetch(`${API_BASE}/states`); // Legacy route works for simple list
        const data = await res.json();
        setStates(data.data || []);
    };

    const fetchDistricts = async (stateSlug) => {
        // Use hierarchical endpoint for better consistency
        const res = await fetch(`${API_BASE}/northeast/${stateSlug}`);
        const data = await res.json();
        if (data.success && data.data.districts) {
            setDistricts(data.data.districts);
        }
    };

    const fetchFestival = async () => {
        if (!id) return;
        try {
            const res = await fetch(`${API_BASE}/cms/festivals/${id}`, {
                headers: getAuthHeader()
            });
            const data = await res.json();

            if (data.success && data.data) {
                const f = data.data;
                const occ = f.latestOccurrence || {};

                // Pre-fill form
                setFormData({
                    name: f.name,
                    stateId: f.stateId || '', // Note: Master doesn't usually store stateId directly, inferred from occurrence or context? 
                    // Actually, looking at the schema, stateId/districtId might only be in occurrence or passed in. 
                    // Let's assume we need to populate them. 
                    // Wait, FestivalMaster schema DOES NOT have stateId/districtId based on previous view.
                    // But the form expects them. Let's see if we can get them from occurrence.
                    districtId: occ.districtId || '',
                    category: f.category || 'Cultural',
                    tagline: f.tagline || '',
                    description: f.description || '',
                    venue: occ.venue || '',
                    startDate: occ.startDate ? new Date(occ.startDate).toISOString().split('T')[0] : '',
                    endDate: occ.endDate ? new Date(occ.endDate).toISOString().split('T')[0] : '',
                    bookingLink: f.bookingLink || '',
                    ecoCertified: f.ecoCertified || false,
                    previewImage: f.images?.preview || '',
                    heroImages: f.images?.hero || [],
                    contentImages: f.images?.content || [],
                    tags: f.tags ? f.tags.join(', ') : ''
                });

                // If we found a district, we might need to find its state to set stateId
                // This is tricky if we don't store stateId on Master. 
                // However, the form needs stateId to load districts.
                // WE NEED TO FIND THE STATE for the district. 
                // For now, let's try to just load the form data we have.
            }
        } catch (err) {
            console.error(err);
            alert('Failed to load festival data');
        }
    };

    // Fetch initial data
    useEffect(() => {
        fetchStates();
    }, []);

    // Fetch festival data once states are loaded involves complexity if we need to map district -> state
    // Let's just fetch festival data on mount if ID exists
    useEffect(() => {
        if (id) {
            fetchFestival();
        }
    }, [id]);

    const handleImageUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('image', file);

        try {
            const res = await fetch(`${API_BASE}/cms/upload`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: data
            });
            const result = await res.json();

            if (result.success) {
                if (field === 'hero') {
                    setFormData(prev => ({
                        ...prev,
                        heroImages: [...(prev.heroImages || []), result.url]
                    }));
                } else if (field === 'content') {
                    setFormData(prev => ({
                        ...prev,
                        contentImages: [...(prev.contentImages || []), result.url]
                    }));
                } else {
                    setFormData(prev => ({ ...prev, [field]: result.url }));
                }
            }
        } catch (err) {
            alert('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) };

            const res = await fetch(`${API_BASE}/cms/festivals${isEdit ? `/${id}` : ''}`, {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(payload)
            });

            let result;
            const contentType = res.headers.get("content-type");

            if (contentType && contentType.indexOf("application/json") !== -1) {
                result = await res.json();
            } else {
                const text = await res.text();
                // Create a synthetic result object for non-JSON errors
                result = { success: false, error: `Server returned non-JSON response (${res.status}): ${text}` };
            }

            console.log('Server Response:', result);

            if (result.success) {
                alert('Festival Saved Successfully! 🎉');
                navigate('/dev-cms');
            } else {
                console.error('Save Error Details:', result);
                alert(`Error Saving: ${result.error || result.message || 'Unknown error occurred (check console)'}`);
            }
        } catch (err) {
            console.error('Network/Request Error:', err);
            alert(`Request Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cms-form">
            <h2>{isEdit ? 'Edit Festival' : 'Add New Festival'}</h2>
            <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Festival Name</label>
                        <input
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Cultural</option>
                            <option>Music</option>
                            <option>Religious</option>
                            <option>Harvest</option>
                            <option>Dance</option>
                        </select>
                    </div>
                </div>

                {/* Location */}
                <div className="form-row">
                    <div className="form-group">
                        <label>State</label>
                        <select
                            required
                            value={formData.stateId}
                            onChange={e => setFormData({ ...formData, stateId: e.target.value })}
                        >
                            <option value="">Select State</option>
                            {states.map(s => (
                                <option key={s.slug} value={s.slug}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>District</label>
                        <select
                            required
                            value={formData.districtId}
                            onChange={e => setFormData({ ...formData, districtId: e.target.value })}
                            disabled={!formData.stateId}
                        >
                            <option value="">Select District</option>
                            {districts.map(d => (
                                <option key={d.slug} value={d.slug}>{d.districtName || d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Dates & Venue */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            required
                            value={formData.endDate}
                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Venue Name</label>
                        <input
                            required
                            value={formData.venue}
                            onChange={e => setFormData({ ...formData, venue: e.target.value })}
                            placeholder="e.g. Jawaharlal Nehru Stadium"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="form-group">
                    <label>Tagline (1 line summary)</label>
                    <input
                        required
                        value={formData.tagline}
                        onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                        placeholder="e.g. Autumn cherry blossom celebration"
                    />
                </div>

                <div className="form-group">
                    <label>Full Description</label>
                    <textarea
                        required
                        rows="6"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                {/* Keywords */}
                <div className="form-group">
                    <label>Keywords (Tags) - Separate by comma</label>
                    <input
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="e.g. music, outdoor, traditional, spring"
                    />
                </div>

                {/* Images */}
                <div className="form-group">
                    <label>Preview Image (Card Thumbnail)</label>
                    <div className="file-input-group">
                        <input type="file" onChange={e => handleImageUpload(e, 'previewImage')} />
                        <span>OR</span>
                        <div className="url-input-group" style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                            <input
                                placeholder="Paste Image URL"
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        setFormData(prev => ({ ...prev, previewImage: e.target.value }));
                                        e.target.value = '';
                                    }
                                }}
                            />
                            <button type="button" onClick={e => {
                                const input = e.target.previousElementSibling;
                                if (input.value) {
                                    setFormData(prev => ({ ...prev, previewImage: input.value }));
                                    input.value = '';
                                }
                            }}>Set URL</button>
                        </div>
                    </div>
                    {uploading && <span>Uploading...</span>}
                    {formData.previewImage && (
                        <div style={{ marginTop: '10px' }}>
                            <img src={formData.previewImage} alt="Preview" className="image-preview" />
                            <button type="button" onClick={() => setFormData({ ...formData, previewImage: '' })} style={{ marginLeft: '10px' }}>Remove</button>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Hero Images (Slideshow) - Select Multiple or Add URLs</label>
                    <input type="file" multiple onChange={e => handleImageUpload(e, 'hero')} />

                    <div className="url-input-group" style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                        <input
                            placeholder="Paste Image URL & Press Enter"
                            onKeyDown={e => {
                                if (e.key === 'Enter' && e.target.value) {
                                    e.preventDefault();
                                    setFormData(prev => ({ ...prev, heroImages: [...prev.heroImages, e.target.value] }));
                                    e.target.value = '';
                                }
                            }}
                        />
                        <button type="button" onClick={e => {
                            const input = e.target.previousElementSibling;
                            if (input.value) {
                                setFormData(prev => ({ ...prev, heroImages: [...prev.heroImages, input.value] }));
                                input.value = '';
                            }
                        }}>Add URL</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        {formData.heroImages.map((img, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', padding: '5px' }}>
                                <img src={img} alt="Hero" style={{ width: '100px', height: '60px', objectFit: 'cover' }} />
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img}</span>
                                <button type="button" onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        heroImages: prev.heroImages.filter((_, idx) => idx !== i)
                                    }))
                                }} style={{ background: '#ff4444', color: 'white', border: 'none', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Content Images (Body) - Select Multiple or Add URLs</label>
                    <input type="file" multiple onChange={e => handleImageUpload(e, 'content')} />

                    <div className="url-input-group" style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                        <input
                            placeholder="Paste Image URL & Press Enter"
                            onKeyDown={e => {
                                if (e.key === 'Enter' && e.target.value) {
                                    e.preventDefault();
                                    setFormData(prev => ({ ...prev, contentImages: [...(prev.contentImages || []), e.target.value] }));
                                    e.target.value = '';
                                }
                            }}
                        />
                        <button type="button" onClick={e => {
                            const input = e.target.previousElementSibling;
                            if (input.value) {
                                setFormData(prev => ({ ...prev, contentImages: [...(prev.contentImages || []), input.value] }));
                                input.value = '';
                            }
                        }}>Add URL</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        {formData.contentImages?.map((img, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', padding: '5px' }}>
                                <img src={img} alt="Content" style={{ width: '100px', height: '60px', objectFit: 'cover' }} />
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img}</span>
                                <button type="button" onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        contentImages: prev.contentImages.filter((_, idx) => idx !== i)
                                    }))
                                }} style={{ background: '#ff4444', color: 'white', border: 'none', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Extra */}
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.ecoCertified}
                            onChange={e => setFormData({ ...formData, ecoCertified: e.target.checked })}
                        />
                        Eco Certified Event? 🌿
                    </label>
                </div>

                <div className="form-group">
                    <label>Booking Link</label>
                    <input
                        type="url"
                        value={formData.bookingLink}
                        onChange={e => setFormData({ ...formData, bookingLink: e.target.value })}
                        placeholder="https://..."
                    />
                </div>

                <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" disabled={loading} style={{ background: '#2a2a2a', color: 'white', padding: '1rem 2rem', border: 'none', borderRadius: '4px' }}>
                        {loading ? 'Saving...' : 'Save Festival'}
                    </button>
                    <button type="button" onClick={() => navigate('/dev-cms')} style={{ padding: '1rem 2rem' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
