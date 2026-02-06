import { useState, useEffect } from 'react';

/**
 * CMSHeroManager
 * Manage hero images for Region (Northeast), States, and Districts
 */
export default function CMSHeroManager() {
    const [level, setLevel] = useState('region'); // 'region' | 'state' | 'district'
    const [options, setOptions] = useState([]); // List of items for dropdown
    const [selectedSlug, setSelectedSlug] = useState('northeast');

    // New state for hierarchical selection
    const [stateOptions, setStateOptions] = useState([]);
    const [selectedFilterState, setSelectedFilterState] = useState(''); // Slug of state to filter districts

    const [heroImages, setHeroImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const getAuthHeader = () => ({ 'Authorization': sessionStorage.getItem('cms_auth') });
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    // Initial load and when level changes
    useEffect(() => {
        if (level === 'region') {
            setOptions([{ name: 'Northeast India', slug: 'northeast' }]);
            setSelectedSlug('northeast');
            setStateOptions([]);
            setSelectedFilterState('');
        } else if (level === 'state') {
            fetchOptions('state');
            setSelectedFilterState('');
        } else if (level === 'district') {
            // For district, first fetch states to populate filter dropdown
            fetchStateOptionsForFilter();
            setOptions([]); // Clear districts until state selected
            setSelectedSlug('');
        }
    }, [level]);

    // When filter state changes (for district level)
    useEffect(() => {
        if (level === 'district' && selectedFilterState) {
            fetchDistrictsByState(selectedFilterState);
        }
    }, [selectedFilterState, level]);

    // Fetch images when final selected slug changes
    useEffect(() => {
        if (selectedSlug) {
            fetchHeroImages(level, selectedSlug);
        }
    }, [selectedSlug, level]);

    const fetchStateOptionsForFilter = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/states`);
            const json = await res.json();
            if (json.success) {
                // Map to options
                const states = json.data.map(item => ({
                    name: item.name,
                    slug: item.slug,   // Used for state selection
                    code: item.code    // Used for API filtering if needed
                }));
                setStateOptions(states);
                // Auto select first state if available
                if (states.length > 0) {
                    setSelectedFilterState(states[0].code); // Use CODE because /by-state/:code expects code
                }
            }
        } catch (err) {
            console.error("Failed to fetch states", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDistrictsByState = async (stateCode) => {
        setLoading(true);
        try {
            // Use the public API endpoint: /api/districts/by-state/:stateCode
            const res = await fetch(`${API_BASE}/districts/by-state/${stateCode}`);
            const json = await res.json();

            if (json.success) {
                const districts = json.data.map(item => ({
                    name: item.districtName,
                    slug: item.slug
                }));
                setOptions(districts);
                if (districts.length > 0) {
                    setSelectedSlug(districts[0].slug);
                } else {
                    setSelectedSlug('');
                    setHeroImages([]); // Clear images if no districts
                }
            }
        } catch (err) {
            console.error("Failed to fetch districts", err);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async (lvl) => {
        setLoading(true);
        try {
            // Only for 'state' level now, as 'district' uses specific fetchDistrictsByState
            let url = `${API_BASE}/states`;

            const res = await fetch(url);
            const json = await res.json();

            if (json.success) {
                const items = json.data.map(item => ({
                    name: item.name,
                    slug: item.slug
                }));
                setOptions(items);
                if (items.length > 0) setSelectedSlug(items[0].slug);
            }
        } catch (err) {
            console.error("Failed to fetch options", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHeroImages = async (lvl, slug) => {
        setLoading(true);
        setHeroImages([]); // Clear prev
        try {
            let url = '';
            if (lvl === 'region') url = `${API_BASE}/regions/${slug}`;
            else if (lvl === 'state') url = `${API_BASE}/states/${slug}`;
            else if (lvl === 'district') url = `${API_BASE}/districts/by-slug/${slug}`; // NOTE: Districts use /by-slug for individual fetch

            const res = await fetch(url);
            const json = await res.json();

            if (json.success && json.data) {
                setHeroImages(json.data.heroImages || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/cms/upload`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                // Add to local state
                setHeroImages([...heroImages, { url: data.url, caption: 'New Image' }]);
            }
        } catch (err) {
            alert('Upload failed');
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        if (!selectedSlug) return;

        setSaving(true);
        setMessage(null);
        try {
            // PUT /api/cms/:regions|states|districts /:slug/hero-images
            const endpoint = `${API_BASE}/cms/${level}s/${selectedSlug}/hero-images`;

            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ heroImages })
            });

            const data = await res.json();
            if (data.success) {
                setMessage('Saved successfully!');
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage('Error: ' + data.error);
            }
        } catch (err) {
            setMessage('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const updateCaption = (index, val) => {
        const newImages = [...heroImages];
        newImages[index].caption = val;
        setHeroImages(newImages);
    };

    const removeImage = (index) => {
        setHeroImages(heroImages.filter((_, i) => i !== index));
    };

    return (
        <div className="cms-hero-manager">
            <h2>Manage Hero Images</h2>

            {/* Controls */}
            <div className="controls" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
                {/* 1. Level Selection */}
                <div className="control-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Level</label>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        style={{ padding: '8px', minWidth: '150px' }}
                    >
                        <option value="region">Region (Northeast)</option>
                        <option value="state">State</option>
                        <option value="district">District</option>
                    </select>
                </div>

                {/* 2. State Filter (Only for District Level) */}
                {level === 'district' && (
                    <div className="control-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select State</label>
                        <select
                            value={selectedFilterState}
                            onChange={(e) => setSelectedFilterState(e.target.value)}
                            style={{ padding: '8px', minWidth: '200px' }}
                            disabled={loading && stateOptions.length === 0}
                        >
                            {stateOptions.map(st => (
                                <option key={st.slug} value={st.code}>{st.name}</option> // Use CODE for value
                            ))}
                        </select>
                    </div>
                )}

                {/* 3. Entity Selection (State or District) */}
                {level !== 'region' && (
                    <div className="control-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Select {level === 'state' ? 'State' : 'District'}
                        </label>
                        <select
                            value={selectedSlug}
                            onChange={(e) => setSelectedSlug(e.target.value)}
                            style={{ padding: '8px', minWidth: '200px' }}
                            disabled={loading || options.length === 0}
                        >
                            {options.map(opt => (
                                <option key={opt.slug} value={opt.slug}>{opt.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Loading Indicator */}
            {loading && <div style={{ marginBottom: '20px' }}>Loading...</div>}

            {/* Image Grid */}
            <div className="image-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {heroImages.map((img, idx) => (
                    <div key={idx} className="image-card" style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', background: 'white' }}>
                        <img
                            src={img.url}
                            alt={img.caption}
                            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                        />
                        <input
                            type="text"
                            placeholder="Caption"
                            value={img.caption || ''}
                            onChange={(e) => updateCaption(idx, e.target.value)}
                            style={{ width: '100%', padding: '6px', marginBottom: '10px', boxSizing: 'border-box' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '12px', color: '#666' }}>Drag to reorder (TODO)</span>
                            <button
                                onClick={() => removeImage(idx)}
                                style={{ background: '#ff4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                {selectedSlug && (
                    <div className="add-card" style={{ border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', cursor: 'pointer', position: 'relative' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '24px', color: '#666' }}>+</span>
                        <span style={{ color: '#666' }}>Upload Image</span>
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="action-bar" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button
                    onClick={handleSave}
                    disabled={saving || !selectedSlug}
                    style={{
                        padding: '12px 24px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: (saving || !selectedSlug) ? 'not-allowed' : 'pointer',
                        opacity: (saving || !selectedSlug) ? 0.7 : 1
                    }}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>

                {message && (
                    <span style={{ color: message.includes('Error') ? 'red' : 'green', fontWeight: 'bold' }}>
                        {message}
                    </span>
                )}
            </div>
        </div>
    );
}
