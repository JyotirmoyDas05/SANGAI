import { useState, useEffect } from 'react';

/**
 * CMSCollageManager
 * Manage collage images for the DescriptionSection on State, Region, and District pages
 */
export default function CMSCollageManager() {
    const [level, setLevel] = useState('state'); // 'region' | 'state' | 'district'
    const [options, setOptions] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState('');

    // For district level - hierarchical selection
    const [states, setStates] = useState([]);
    const [selectedStateCode, setSelectedStateCode] = useState('');
    const [districts, setDistricts] = useState([]);

    const [collageImages, setCollageImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);

    const getAuthHeader = () => ({ 'Authorization': sessionStorage.getItem('cms_auth') });
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    // Fetch options when level changes
    useEffect(() => {
        if (level === 'region') {
            setOptions([{ name: 'Northeast India', slug: 'northeast' }]);
            setSelectedSlug('northeast');
        } else if (level === 'state') {
            fetchStates();
        } else if (level === 'district') {
            fetchStatesForDistrict();
        }
    }, [level]);

    // Fetch collage images when selection changes
    useEffect(() => {
        if (selectedSlug) {
            fetchCollageImages();
        }
    }, [selectedSlug, level]);

    // Fetch districts when selected state changes
    useEffect(() => {
        if (level === 'district' && selectedStateCode) {
            fetchDistricts(selectedStateCode);
        }
    }, [selectedStateCode, level]);

    const fetchStates = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/states`);
            const json = await res.json();
            if (json.success) {
                const stateList = json.data.map(item => ({
                    name: item.name,
                    slug: item.slug
                }));
                setOptions(stateList);
                if (stateList.length > 0) setSelectedSlug(stateList[0].slug);
            }
        } catch (err) {
            console.error("Failed to fetch states", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatesForDistrict = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/states`);
            const json = await res.json();
            if (json.success) {
                const stateList = json.data.map(item => ({
                    name: item.name,
                    code: item.code
                }));
                setStates(stateList);
                if (stateList.length > 0) {
                    setSelectedStateCode(stateList[0].code);
                }
            }
        } catch (err) {
            console.error("Failed to fetch states", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDistricts = async (stateCode) => {
        setLoading(true);
        try {
            // Endpoint uses path param: /api/districts/by-state/:stateCode
            const res = await fetch(`${API_BASE}/districts/by-state/${stateCode}`);
            const json = await res.json();
            if (json.success) {
                const districtList = json.data.map(item => ({
                    name: item.districtName,
                    slug: item.slug
                }));
                setDistricts(districtList);
                if (districtList.length > 0) {
                    setSelectedSlug(districtList[0].slug);
                } else {
                    setSelectedSlug('');
                    setCollageImages([]);
                }
            }
        } catch (err) {
            console.error("Failed to fetch districts", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCollageImages = async () => {
        setLoading(true);
        setCollageImages([]);
        try {
            let endpoint;
            if (level === 'region') {
                endpoint = `${API_BASE}/regions/${selectedSlug}`;
            } else if (level === 'state') {
                endpoint = `${API_BASE}/states/${selectedSlug}`;
            } else {
                endpoint = `${API_BASE}/districts/${selectedSlug}`;
            }

            const res = await fetch(endpoint);
            const json = await res.json();

            if (json.success && json.data) {
                setCollageImages(json.data.collageImages || []);
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
            setUploading(true);
            const res = await fetch(`${API_BASE}/cms/upload`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                // Add to local state
                setCollageImages([...collageImages, { url: data.url, caption: '' }]);
                setMessage('Image uploaded!');
                setTimeout(() => setMessage(null), 2000);
            } else {
                setMessage('Upload failed: ' + data.error);
            }
        } catch (err) {
            setMessage('Upload failed');
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const handleSave = async () => {
        if (!selectedSlug) return;

        setSaving(true);
        setMessage(null);
        try {
            let endpoint;
            if (level === 'region') {
                endpoint = `${API_BASE}/cms/regions/${selectedSlug}/collage-images`;
            } else if (level === 'state') {
                endpoint = `${API_BASE}/cms/states/${selectedSlug}/collage-images`;
            } else {
                endpoint = `${API_BASE}/cms/districts/${selectedSlug}/collage-images`;
            }

            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ collageImages })
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
        const updated = [...collageImages];
        updated[index].caption = val;
        setCollageImages(updated);
    };

    const updateUrl = (index, val) => {
        const updated = [...collageImages];
        updated[index].url = val;
        setCollageImages(updated);
    };

    const removeImage = (index) => {
        setCollageImages(collageImages.filter((_, i) => i !== index));
    };

    const addManualEntry = () => {
        setCollageImages([...collageImages, { url: '', caption: '' }]);
    };

    return (
        <div className="cms-collage-manager">
            <h2>🖼️ Manage Collage Images</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                These images appear in the bento grid on State, Region, and District overview pages.
                <br />
                <strong>Tip:</strong> First image is the main anchor. Upload 6 images for best results.
            </p>

            {/* Controls */}
            <div className="controls" style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '8px'
            }}>
                {/* Level Selection */}
                <div className="control-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Level</label>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        style={{ padding: '8px', minWidth: '150px' }}
                    >
                        <option value="state">State</option>
                        <option value="district">District</option>
                        <option value="region">Region (Northeast)</option>
                    </select>
                </div>

                {/* State Selection (for district level) */}
                {level === 'district' && (
                    <div className="control-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select State</label>
                        <select
                            value={selectedStateCode}
                            onChange={(e) => setSelectedStateCode(e.target.value)}
                            style={{ padding: '8px', minWidth: '180px' }}
                            disabled={loading || states.length === 0}
                        >
                            {states.map(s => (
                                <option key={s.code} value={s.code}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Entity Selection */}
                <div className="control-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Select {level === 'state' ? 'State' : level === 'district' ? 'District' : 'Region'}
                    </label>
                    <select
                        value={selectedSlug}
                        onChange={(e) => setSelectedSlug(e.target.value)}
                        style={{ padding: '8px', minWidth: '200px' }}
                        disabled={loading || (level === 'district' ? districts.length === 0 : options.length === 0)}
                    >
                        {(level === 'district' ? districts : options).map(opt => (
                            <option key={opt.slug} value={opt.slug}>{opt.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading */}
            {loading && <div style={{ marginBottom: '20px' }}>Loading...</div>}

            {/* Image Grid */}
            <div className="image-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginBottom: '30px'
            }}>
                {collageImages.map((img, idx) => (
                    <div key={idx} className="image-card" style={{
                        border: '1px solid #ddd',
                        padding: '12px',
                        borderRadius: '8px',
                        background: 'white'
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong>Image {idx + 1}</strong>
                            <button
                                onClick={() => removeImage(idx)}
                                style={{
                                    background: '#ff4444',
                                    color: 'white',
                                    border: 'none',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Preview */}
                        {img.url ? (
                            <img
                                src={img.url}
                                alt={img.caption || `Collage ${idx + 1}`}
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    marginBottom: '10px',
                                    background: '#f0f0f0'
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '120px',
                                background: '#f0f0f0',
                                borderRadius: '4px',
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#999'
                            }}>
                                No image
                            </div>
                        )}

                        {/* URL Input */}
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={img.url || ''}
                            onChange={(e) => updateUrl(idx, e.target.value)}
                            style={{
                                width: '100%',
                                padding: '6px',
                                marginBottom: '6px',
                                boxSizing: 'border-box',
                                fontSize: '12px'
                            }}
                        />

                        {/* Caption Input */}
                        <input
                            type="text"
                            placeholder="Caption (optional)"
                            value={img.caption || ''}
                            onChange={(e) => updateCaption(idx, e.target.value)}
                            style={{
                                width: '100%',
                                padding: '6px',
                                boxSizing: 'border-box',
                                fontSize: '12px'
                            }}
                        />
                    </div>
                ))}

                {/* Upload New Card */}
                {selectedSlug && (
                    <div className="add-card" style={{
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '200px',
                        cursor: uploading ? 'wait' : 'pointer',
                        position: 'relative',
                        background: uploading ? '#f9f9f9' : 'white'
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: uploading ? 'wait' : 'pointer'
                            }}
                        />
                        {uploading ? (
                            <>
                                <span style={{ fontSize: '18px', color: '#666' }}>⏳</span>
                                <span style={{ color: '#666' }}>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: '24px', color: '#666' }}>+</span>
                                <span style={{ color: '#666' }}>Upload Image</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="action-bar" style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <button
                    onClick={addManualEntry}
                    style={{
                        padding: '10px 20px',
                        background: '#eee',
                        border: '1px dashed #999',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    + Add URL Manually
                </button>

                <button
                    onClick={handleSave}
                    disabled={saving || !selectedSlug}
                    style={{
                        padding: '12px 24px',
                        background: '#333',
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
                    <span style={{
                        color: message.includes('Error') || message.includes('failed') ? 'red' : 'green',
                        fontWeight: 'bold'
                    }}>
                        {message}
                    </span>
                )}
            </div>
        </div>
    );
}
