import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getStates } from '../../api/apiService';

// Standard Material Icons for "Contributions"
const ICON_OPTIONS = [
    { value: 'eco', label: 'Eco / Nature' },
    { value: 'psychology', label: 'Wisdom / Knowledge' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'brush', label: 'Art / Crafts' },
    { value: 'theater_comedy', label: 'Culture' },
    { value: 'forest', label: 'Forest / Biodiversity' },
    { value: 'lightbulb', label: 'Innovation / Ideas' },
    { value: 'spa', label: 'Wellness / Organic' },
    { value: 'handshake', label: 'Community' },
    { value: 'construction', label: 'Construction / Skills' },
    { value: 'water_drop', label: 'Water / Hydro' },
    { value: 'diamond', label: 'Minerals / Resources' },
    { value: 'school', label: 'Education' },
    { value: 'local_florist', label: 'Flora' },
    { value: 'pets', label: 'Fauna' }
];

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    header: {
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
    },
    controls: {
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    select: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        minWidth: '200px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    input: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        marginBottom: '5px'
    },
    textarea: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        minHeight: '60px',
        resize: 'vertical'
    },
    imagePreview: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '4px',
        backgroundColor: '#eee',
        marginBottom: '10px'
    },
    fileInput: {
        marginTop: '5px'
    },
    button: {
        padding: '8px 16px',
        backgroundColor: '#2c3e50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    removeBtn: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '4px 8px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    saveBtn: {
        padding: '12px 24px',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px',
        width: '100%'
    }
};

export default function CMSContributionsManager() {
    const [level, setLevel] = useState('state'); // 'region' or 'state'
    const [options, setOptions] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState('');
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [uploadingId, setUploadingId] = useState(null);

    // Initial load of options
    useEffect(() => {
        loadOptions();
    }, [level]);

    const loadOptions = async () => {
        if (level === 'region') {
            setOptions([{ name: 'Northeast India', slug: 'northeast' }]);
            setSelectedSlug('northeast');
        } else if (level === 'state') {
            try {
                const data = await getStates();
                setOptions(data);
                if (data.length > 0) setSelectedSlug(data[0].slug);
            } catch (err) {
                console.error("Failed to load states", err);
            }
        }
    };

    // Fetch contributions when selection changes
    useEffect(() => {
        if (selectedSlug) {
            fetchContributions();
        }
    }, [selectedSlug, level]);

    const fetchContributions = async () => {
        setLoading(true);
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

            const url = level === 'region'
                ? `${API_BASE}/regions/${selectedSlug}`
                : `${API_BASE}/states/${selectedSlug}`;

            const res = await axios.get(url);

            // API returns { success: true, data: { ... } }
            // Axios response.data is the body
            const responseBody = res.data;

            if (responseBody.success && responseBody.data) {
                setContributions(responseBody.data.contributions || []);
            } else {
                setContributions([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setMessage({ type: 'error', text: 'Failed to load data.' });
        } finally {
            setLoading(false);
        }
    };

    const addContribution = () => {
        setContributions([
            ...contributions,
            {
                icon: 'eco',
                title: 'New Contribution',
                description: 'Description here...',
                image: { url: '', caption: '' }
            }
        ]);
    };

    const removeContribution = (index) => {
        const newContribs = [...contributions];
        newContribs.splice(index, 1);
        setContributions(newContribs);
    };

    const updateContribution = (index, field, value) => {
        const newContribs = [...contributions];
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            newContribs[index][parent] = {
                ...newContribs[index][parent],
                [child]: value
            };
        } else {
            newContribs[index][field] = value;
        }
        setContributions(newContribs);
    };
    const handleImageUpload = async (index, file) => {
        if (!file) return;
        setUploadingId(index);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'contributions');

        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const res = await axios.post(`${API_BASE}/cms/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            updateContribution(index, 'image.url', res.data.url);
            setMessage({ type: 'success', text: 'Image uploaded!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Upload failed.' });
        } finally {
            setUploadingId(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            // Determine endpoint based on level
            // e.g. PUT /api/cms/regions/:slug/contributions
            const endpoint = `${API_BASE}/cms/${level}s/${selectedSlug}/contributions`;

            await axios.put(endpoint, { contributions });
            setMessage({ type: 'success', text: 'Contributions saved successfully!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to save.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Contributions Manager</h2>
                <p>Manage "What This Place Gives India" section</p>
            </div>

            {message.text && (
                <div style={{
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                    backgroundColor: message.type === 'error' ? '#fadbd8' : '#d4efdf',
                    color: message.type === 'error' ? '#76443c' : '#1e8449'
                }}>
                    {message.text}
                </div>
            )}

            <div style={styles.controls}>
                <label>
                    <strong>Level: </strong>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        style={styles.select}
                    >
                        <option value="region">Region</option>
                        <option value="state">State</option>
                    </select>
                </label>

                <label>
                    <strong>Select Entity: </strong>
                    <select
                        value={selectedSlug}
                        onChange={(e) => setSelectedSlug(e.target.value)}
                        style={styles.select}
                        disabled={loading}
                    >
                        {options.map(opt => (
                            <option key={opt.slug} value={opt.slug}>
                                {opt.name}
                            </option>
                        ))}
                    </select>
                </label>

                <button onClick={addContribution} style={styles.button}>
                    + Add New Card
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={styles.grid}>
                    {contributions.map((item, index) => (
                        <div key={index} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <strong>Card #{index + 1}</strong>
                                <button
                                    onClick={() => removeContribution(index)}
                                    style={styles.removeBtn}
                                >
                                    Remove
                                </button>
                            </div>

                            <label>Title:</label>
                            <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => updateContribution(index, 'title', e.target.value)}
                                style={styles.input}
                                placeholder="e.g. Indigenous Wisdom"
                            />

                            <label>Description:</label>
                            <textarea
                                value={item.description || ''}
                                onChange={(e) => updateContribution(index, 'description', e.target.value)}
                                style={styles.textarea}
                                placeholder="1-2 sentences..."
                            />

                            <label>Icon:</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <select
                                    value={item.icon || 'star'}
                                    onChange={(e) => updateContribution(index, 'icon', e.target.value)}
                                    style={{ ...styles.select, flex: 1 }}
                                >
                                    {ICON_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label} ({opt.value})
                                        </option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                                    {item.icon || 'star'}
                                </span>
                            </div>

                            <label>Image:</label>
                            <div style={{ border: '1px solid #eee', padding: '8px', borderRadius: '4px' }}>
                                {/* Direct URL Input */}
                                <input
                                    type="text"
                                    placeholder="Image URL (http://...)"
                                    value={item.image?.url || ''}
                                    onChange={(e) => updateContribution(index, 'image.url', e.target.value)}
                                    style={{ ...styles.input, marginBottom: '10px' }}
                                />

                                {item.image?.url && (
                                    <div style={{ marginBottom: '10px' }}>
                                        <img src={item.image.url} alt="Preview" style={styles.imagePreview} />
                                        <button
                                            onClick={() => {
                                                updateContribution(index, 'image.url', '');
                                                updateContribution(index, 'image.caption', '');
                                            }}
                                            style={{ ...styles.removeBtn, width: '100%' }}
                                        >
                                            Clear Image
                                        </button>
                                    </div>
                                )}

                                <label style={{ fontSize: '12px', color: '#666' }}>Or Upload File:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                    style={styles.fileInput}
                                    disabled={uploadingId === index}
                                />
                                {uploadingId === index && <span>Uploading...</span>}

                                <input
                                    type="text"
                                    placeholder="Caption"
                                    value={item.image?.caption || ''}
                                    onChange={(e) => updateContribution(index, 'image.caption', e.target.value)}
                                    style={{ ...styles.input, marginTop: '10px' }}
                                />
                            </div>
                        </div>
                    ))}

                    {contributions.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#888' }}>
                            No contributions found. Click "Add New Card" to start.
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={handleSave}
                style={{
                    ...styles.saveBtn,
                    opacity: saving ? 0.7 : 1,
                    cursor: saving ? 'wait' : 'pointer'
                }}
                disabled={saving}
            >
                {saving ? 'Saving...' : 'Save Contributions'}
            </button>
        </div>
    );
}
