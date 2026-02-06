import { useState, useEffect } from 'react';

/**
 * CMSStateContentManager
 * Manage sharedStory and culturalThreads for States
 */
export default function CMSStateContentManager() {
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Shared Story fields
    const [sharedStory, setSharedStory] = useState({
        title: '',
        paragraphs: ['', '', '', ''],
        tone: 'philosophical'
    });

    // Cultural Threads fields
    const [culturalThreads, setCulturalThreads] = useState([]);

    // Collage Images fields (6 images for DescriptionSection bento grid)
    const [collageImages, setCollageImages] = useState([]);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const getAuthHeader = () => ({ 'Authorization': sessionStorage.getItem('cms_auth') });

    // Fetch all states on mount
    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        try {
            const res = await fetch(`${API_BASE}/states`);
            const data = await res.json();
            if (data.success) {
                setStates(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch states:', err);
        }
    };

    // Fetch state content when selection changes
    useEffect(() => {
        if (selectedState) {
            fetchStateContent(selectedState);
        }
    }, [selectedState]);

    const fetchStateContent = async (slug) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/states/${slug}`);
            const data = await res.json();
            if (data.success && data.data) {
                // Set sharedStory
                if (data.data.sharedStory) {
                    const paragraphs = data.data.sharedStory.paragraphs || [];
                    // Ensure we always have 4 paragraph fields
                    while (paragraphs.length < 4) paragraphs.push('');
                    setSharedStory({
                        title: data.data.sharedStory.title || '',
                        paragraphs,
                        tone: data.data.sharedStory.tone || 'philosophical'
                    });
                } else {
                    setSharedStory({ title: '', paragraphs: ['', '', '', ''], tone: 'philosophical' });
                }

                // Set culturalThreads
                if (data.data.culturalThreads && data.data.culturalThreads.length > 0) {
                    setCulturalThreads(data.data.culturalThreads);
                } else {
                    setCulturalThreads([]);
                }

                // Set collageImages
                if (data.data.collageImages && data.data.collageImages.length > 0) {
                    setCollageImages(data.data.collageImages);
                } else {
                    setCollageImages([]);
                }
            }
        } catch (err) {
            console.error('Failed to fetch state content:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSharedStory = async () => {
        if (!selectedState) return;
        setSaving(true);
        setSuccessMsg('');

        try {
            const res = await fetch(`${API_BASE}/cms/states/${selectedState}/shared-story`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sharedStory: {
                        ...sharedStory,
                        // Filter out empty paragraphs
                        paragraphs: sharedStory.paragraphs.filter(p => p.trim())
                    }
                })
            });

            if (res.ok) {
                setSuccessMsg('Shared Story saved!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                const err = await res.json();
                alert('Failed to save: ' + err.error);
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveCulturalThreads = async () => {
        if (!selectedState) return;
        setSaving(true);
        setSuccessMsg('');

        try {
            const res = await fetch(`${API_BASE}/cms/states/${selectedState}/cultural-threads`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    culturalThreads: culturalThreads.filter(t => t.title.trim())
                })
            });

            if (res.ok) {
                setSuccessMsg('Cultural Threads saved!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                const err = await res.json();
                alert('Failed to save: ' + err.error);
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const updateParagraph = (index, value) => {
        const updated = [...sharedStory.paragraphs];
        updated[index] = value;
        setSharedStory({ ...sharedStory, paragraphs: updated });
    };

    const addThread = () => {
        setCulturalThreads([...culturalThreads, { title: '', insight: '', imageUrl: '' }]);
    };

    const updateThread = (index, field, value) => {
        const updated = [...culturalThreads];
        updated[index] = { ...updated[index], [field]: value };
        setCulturalThreads(updated);
    };

    const removeThread = (index) => {
        setCulturalThreads(culturalThreads.filter((_, i) => i !== index));
    };

    // Collage Image handlers
    const addCollageImage = () => {
        setCollageImages([...collageImages, { url: '', caption: '' }]);
    };

    const updateCollageImage = (index, field, value) => {
        const updated = [...collageImages];
        updated[index] = { ...updated[index], [field]: value };
        setCollageImages(updated);
    };

    const removeCollageImage = (index) => {
        setCollageImages(collageImages.filter((_, i) => i !== index));
    };

    const handleSaveCollageImages = async () => {
        if (!selectedState) return;
        setSaving(true);
        setSuccessMsg('');

        try {
            const res = await fetch(`${API_BASE}/cms/states/${selectedState}/collage-images`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    collageImages: collageImages.filter(img => img.url.trim())
                })
            });

            if (res.ok) {
                setSuccessMsg('Collage Images saved!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                const err = await res.json();
                alert('Failed to save: ' + err.error);
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="state-content-manager" style={{ padding: '20px' }}>
            <h2 style={{ marginTop: 0 }}>State Content Manager</h2>
            <p style={{ color: '#666' }}>Edit Shared Story and Cultural Threads for each state.</p>

            {/* State Selector */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Select State:
                </label>
                <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    style={{ padding: '10px', fontSize: '16px', width: '300px' }}
                >
                    <option value="">-- Select a State --</option>
                    {states.map(s => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                </select>
            </div>

            {selectedState && loading && <p>Loading...</p>}

            {selectedState && !loading && (
                <>
                    {successMsg && (
                        <div style={{
                            background: '#d4fdd4',
                            border: '1px solid #4a4',
                            padding: '10px',
                            borderRadius: '4px',
                            marginBottom: '20px'
                        }}>
                            ✓ {successMsg}
                        </div>
                    )}

                    {/* Shared Story Section */}
                    <section style={{
                        background: '#f9f9f9',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ marginTop: 0 }}>📖 Shared Story</h3>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '4px' }}>Title:</label>
                            <input
                                type="text"
                                value={sharedStory.title}
                                onChange={(e) => setSharedStory({ ...sharedStory, title: e.target.value })}
                                placeholder="A Story of [State Name]"
                                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '4px' }}>Tone:</label>
                            <select
                                value={sharedStory.tone}
                                onChange={(e) => setSharedStory({ ...sharedStory, tone: e.target.value })}
                                style={{ padding: '10px', fontSize: '14px' }}
                            >
                                <option value="philosophical">Philosophical</option>
                                <option value="historical">Historical</option>
                                <option value="cultural">Cultural</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>
                                Paragraphs (4 philosophical lines):
                            </label>
                            {sharedStory.paragraphs.map((p, i) => (
                                <textarea
                                    key={i}
                                    value={p}
                                    onChange={(e) => updateParagraph(i, e.target.value)}
                                    placeholder={`Paragraph ${i + 1}...`}
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        fontSize: '14px',
                                        resize: 'vertical'
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleSaveSharedStory}
                            disabled={saving}
                            style={{
                                background: '#333',
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Shared Story'}
                        </button>
                    </section>

                    {/* Cultural Threads Section */}
                    <section style={{
                        background: '#f9f9f9',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '20px'
                    }}>
                        <h3 style={{ marginTop: 0 }}>🧵 Cultural Threads</h3>

                        {culturalThreads.map((thread, i) => (
                            <div key={i} style={{
                                background: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                padding: '16px',
                                marginBottom: '16px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <strong>Thread {i + 1}</strong>
                                    <button
                                        onClick={() => removeThread(i)}
                                        style={{
                                            background: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        value={thread.title}
                                        onChange={(e) => updateThread(i, 'title', e.target.value)}
                                        placeholder="Title (e.g., Festival Rhythms)"
                                        style={{ width: '100%', padding: '8px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        value={thread.insight}
                                        onChange={(e) => updateThread(i, 'insight', e.target.value)}
                                        placeholder="One-line insight..."
                                        style={{ width: '100%', padding: '8px' }}
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        value={thread.imageUrl}
                                        onChange={(e) => updateThread(i, 'imageUrl', e.target.value)}
                                        placeholder="Image URL (optional)"
                                        style={{ width: '100%', padding: '8px' }}
                                    />
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addThread}
                            style={{
                                background: '#eee',
                                border: '1px dashed #999',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            + Add Thread
                        </button>

                        <button
                            onClick={handleSaveCulturalThreads}
                            disabled={saving}
                            style={{
                                background: '#333',
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Cultural Threads'}
                        </button>
                    </section>

                    {/* Collage Images Section */}
                    <section style={{
                        background: '#f9f9f9',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '20px',
                        marginTop: '24px'
                    }}>
                        <h3 style={{ marginTop: 0 }}>🖼️ Collage Images</h3>
                        <p style={{ color: '#666', marginBottom: '16px' }}>
                            6 images for the Description Section bento grid. Order matters - first image is the main anchor.
                        </p>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '16px',
                            marginBottom: '16px'
                        }}>
                            {collageImages.map((img, i) => (
                                <div key={i} style={{
                                    background: 'white',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    padding: '12px',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px'
                                    }}>
                                        <strong>Image {i + 1}</strong>
                                        <button
                                            onClick={() => removeCollageImage(i)}
                                            style={{
                                                background: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Preview */}
                                    {img.url && (
                                        <div style={{
                                            width: '100%',
                                            height: '80px',
                                            backgroundImage: `url(${img.url})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderRadius: '4px',
                                            marginBottom: '8px'
                                        }} />
                                    )}

                                    <input
                                        type="text"
                                        value={img.url}
                                        onChange={(e) => updateCollageImage(i, 'url', e.target.value)}
                                        placeholder="Image URL"
                                        style={{ width: '100%', padding: '6px', marginBottom: '6px', fontSize: '12px' }}
                                    />
                                    <input
                                        type="text"
                                        value={img.caption || ''}
                                        onChange={(e) => updateCollageImage(i, 'caption', e.target.value)}
                                        placeholder="Caption (optional)"
                                        style={{ width: '100%', padding: '6px', fontSize: '12px' }}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addCollageImage}
                            style={{
                                background: '#eee',
                                border: '1px dashed #999',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            + Add Image
                        </button>

                        <button
                            onClick={handleSaveCollageImages}
                            disabled={saving}
                            style={{
                                background: '#333',
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Collage Images'}
                        </button>
                    </section>
                </>
            )}
        </div>
    );
}
