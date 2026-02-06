/**
 * CMSDefiningThemesManager - Manage "What Defines This Land" section content
 * Supports Region, State, and District levels
 * Each level can have up to 4 theme cards with icon, title, description, and image
 */
import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Available Material Icons for themes
const ICON_OPTIONS = [
    { value: 'terrain', label: 'Terrain/Mountains' },
    { value: 'diversity_3', label: 'Diversity/People' },
    { value: 'explore', label: 'Explore/Compass' },
    { value: 'eco', label: 'Eco/Nature' },
    { value: 'temple_buddhist', label: 'Temple' },
    { value: 'festival', label: 'Festival' },
    { value: 'forest', label: 'Forest' },
    { value: 'water_drop', label: 'Water' },
    { value: 'music_note', label: 'Music' },
    { value: 'brush', label: 'Art/Craft' },
    { value: 'castle', label: 'Heritage' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'pets', label: 'Wildlife' },
    { value: 'local_florist', label: 'Flora' },
    { value: 'handshake', label: 'Community' },
    { value: 'history_edu', label: 'History' },
];

export default function CMSDefiningThemesManager() {
    const [level, setLevel] = useState('state');
    const [options, setOptions] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState('');

    // For district level - hierarchical selection
    const [states, setStates] = useState([]);
    const [selectedStateCode, setSelectedStateCode] = useState('');
    const [districts, setDistricts] = useState([]);

    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch states list
    const fetchStates = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/states`);
            const json = await res.json();
            if (json.success) {
                const stateList = json.data.map(item => ({
                    name: item.name,
                    slug: item.slug,
                    code: item.code
                }));
                setOptions(stateList);
                if (stateList.length > 0) {
                    setSelectedSlug(stateList[0].slug);
                }
            }
        } catch (err) {
            console.error("Failed to fetch states", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch states for district level
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

    // Fetch districts by state code
    const fetchDistricts = async (stateCode) => {
        setLoading(true);
        try {
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
                    setThemes([]);
                }
            }
        } catch (err) {
            console.error("Failed to fetch districts", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch defining themes for selected entity
    const fetchThemes = async () => {
        if (!selectedSlug) return;
        setLoading(true);
        try {
            let endpoint;
            if (level === 'region') {
                endpoint = `${API_BASE}/regions/${selectedSlug}`;
            } else if (level === 'state') {
                endpoint = `${API_BASE}/states/${selectedSlug}`;
            } else {
                endpoint = `${API_BASE}/districts/by-slug/${selectedSlug}`;
            }

            const res = await fetch(endpoint);
            const json = await res.json();
            if (json.success && json.data) {
                setThemes(json.data.definingThemes || []);
            }
        } catch (err) {
            console.error("Failed to fetch themes", err);
            setThemes([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle level change
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

    // Fetch districts when state changes (for district level)
    useEffect(() => {
        if (level === 'district' && selectedStateCode) {
            fetchDistricts(selectedStateCode);
        }
    }, [selectedStateCode, level]);

    // Fetch themes when selection changes
    useEffect(() => {
        if (selectedSlug) {
            fetchThemes();
        }
    }, [selectedSlug, level]);

    // Add new theme card
    const addTheme = () => {
        if (themes.length >= 4) {
            setMessage({ type: 'warning', text: 'Maximum 4 themes allowed' });
            return;
        }
        setThemes([...themes, {
            icon: 'terrain',
            title: '',
            description: '',
            image: { url: '', caption: '' }
        }]);
    };

    // Remove theme card
    const removeTheme = (index) => {
        setThemes(themes.filter((_, i) => i !== index));
    };

    // Update theme field
    const updateTheme = (index, field, value) => {
        const updated = [...themes];
        if (field === 'imageUrl') {
            updated[index].image = { ...updated[index].image, url: value };
        } else if (field === 'imageCaption') {
            updated[index].image = { ...updated[index].image, caption: value };
        } else {
            updated[index][field] = value;
        }
        setThemes(updated);
    };

    // Handle image upload
    const handleImageUpload = async (index, file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${API_BASE}/cms/upload`, {
                method: 'POST',
                body: formData
            });
            const json = await res.json();
            if (json.url) {
                updateTheme(index, 'imageUrl', json.url);
                setMessage({ type: 'success', text: 'Image uploaded!' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Upload failed' });
        }
    };

    // Save themes
    const handleSave = async () => {
        if (!selectedSlug) return;
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            let endpoint;
            if (level === 'region') {
                endpoint = `${API_BASE}/cms/regions/${selectedSlug}/defining-themes`;
            } else if (level === 'state') {
                endpoint = `${API_BASE}/cms/states/${selectedSlug}/defining-themes`;
            } else {
                endpoint = `${API_BASE}/cms/districts/${selectedSlug}/defining-themes`;
            }

            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ definingThemes: themes })
            });

            const json = await res.json();
            if (json.success) {
                setMessage({ type: 'success', text: 'Themes saved successfully!' });
            } else {
                setMessage({ type: 'error', text: json.error || 'Save failed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save themes' });
        } finally {
            setSaving(false);
        }
    };

    const styles = {
        container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
        header: { marginBottom: '24px' },
        title: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' },
        tip: { color: '#666', fontSize: '0.9rem', marginBottom: '16px' },
        controls: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' },
        controlGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
        label: { fontWeight: 'bold', fontSize: '0.85rem' },
        select: { padding: '8px 12px', minWidth: '180px', borderRadius: '4px', border: '1px solid #ccc' },
        themesGrid: { display: 'flex', flexDirection: 'column', gap: '20px' },
        themeCard: {
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            background: '#fafafa',
            position: 'relative'
        },
        themeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
        themeNumber: { fontWeight: 'bold', color: '#333' },
        removeBtn: {
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '4px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        fieldRow: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '12px' },
        input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' },
        textarea: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', minHeight: '80px', resize: 'vertical' },
        imageSection: { display: 'flex', gap: '16px', alignItems: 'flex-start', marginTop: '12px' },
        imagePreview: {
            width: '150px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '4px',
            background: '#eee'
        },
        addBtn: {
            background: '#22c55e',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
        },
        saveBtn: {
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
        },
        actions: { display: 'flex', gap: '16px', marginTop: '24px' },
        message: (type) => ({
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            background: type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#fff3cd',
            color: type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#856404'
        })
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>📍 Defining Themes Manager</h2>
                <p style={styles.tip}>
                    Manage the "What Defines This Land" section. Each level can have up to 4 theme cards.
                </p>
            </div>

            {message.text && (
                <div style={styles.message(message.type)}>{message.text}</div>
            )}

            {/* Level & Entity Selection */}
            <div style={styles.controls}>
                <div style={styles.controlGroup}>
                    <label style={styles.label}>Level</label>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        style={styles.select}
                    >
                        <option value="state">State</option>
                        <option value="district">District</option>
                        <option value="region">Region (Northeast)</option>
                    </select>
                </div>

                {level === 'district' && (
                    <div style={styles.controlGroup}>
                        <label style={styles.label}>Select State</label>
                        <select
                            value={selectedStateCode}
                            onChange={(e) => setSelectedStateCode(e.target.value)}
                            style={styles.select}
                            disabled={loading || states.length === 0}
                        >
                            {states.map(s => (
                                <option key={s.code} value={s.code}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div style={styles.controlGroup}>
                    <label style={styles.label}>
                        Select {level === 'state' ? 'State' : level === 'district' ? 'District' : 'Region'}
                    </label>
                    <select
                        value={selectedSlug}
                        onChange={(e) => setSelectedSlug(e.target.value)}
                        style={styles.select}
                        disabled={loading || (level === 'district' ? districts.length === 0 : options.length === 0)}
                    >
                        {(level === 'district' ? districts : options).map(opt => (
                            <option key={opt.slug} value={opt.slug}>{opt.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Theme Cards Editor */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={styles.themesGrid}>
                    {themes.map((theme, index) => (
                        <div key={index} style={styles.themeCard}>
                            <div style={styles.themeHeader}>
                                <span style={styles.themeNumber}>Theme {index + 1}</span>
                                <button style={styles.removeBtn} onClick={() => removeTheme(index)}>
                                    Remove
                                </button>
                            </div>

                            <div style={styles.fieldRow}>
                                <div style={styles.controlGroup}>
                                    <label style={styles.label}>Icon</label>
                                    <select
                                        value={theme.icon}
                                        onChange={(e) => updateTheme(index, 'icon', e.target.value)}
                                        style={styles.select}
                                    >
                                        {ICON_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined" style={{ marginTop: '8px', fontSize: '24px' }}>
                                        {theme.icon}
                                    </span>
                                </div>
                                <div style={styles.controlGroup}>
                                    <label style={styles.label}>Title</label>
                                    <input
                                        type="text"
                                        value={theme.title}
                                        onChange={(e) => updateTheme(index, 'title', e.target.value)}
                                        placeholder="e.g. Ancient Landscapes"
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.controlGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    value={theme.description}
                                    onChange={(e) => updateTheme(index, 'description', e.target.value)}
                                    placeholder="A short description of this theme (1-2 sentences)"
                                    style={styles.textarea}
                                />
                            </div>

                            <div style={styles.imageSection}>
                                {theme.image?.url && (
                                    <img src={theme.image.url} alt="Preview" style={styles.imagePreview} />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={styles.controlGroup}>
                                        <label style={styles.label}>Image URL</label>
                                        <input
                                            type="text"
                                            value={theme.image?.url || ''}
                                            onChange={(e) => updateTheme(index, 'imageUrl', e.target.value)}
                                            placeholder="https://..."
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={{ marginTop: '8px' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files[0] && handleImageUpload(index, e.target.files[0])}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div style={styles.actions}>
                        <button
                            style={styles.addBtn}
                            onClick={addTheme}
                            disabled={themes.length >= 4}
                        >
                            + Add Theme Card
                        </button>
                        <button
                            style={styles.saveBtn}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Themes'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
