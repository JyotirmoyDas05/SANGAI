import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function DestinationForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    // React Refs for URL inputs
    const imageUrlRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'waterfall',
        districtId: '',
        shortDescription: '',
        overview: '',
        quote: '', // NEW
        culturalSignificance: '',
        localBelief: '',
        guideInfo: '', // NEW
        lat: '',
        lng: '',
        bestTimeToVisit: '',
        isHiddenGem: false,
        images: [], // Array of strings (URLs)
        // New Fields
        logistics: {
            nearestTown: '',
            distanceFromNearestTown: '',
            distanceFromShillong: '',
            distanceFromGuwahati: '',
            transportationInfo: ''
        },
        experience: {
            highlights: [],
            visitorTips: [],
            dontMiss: [] // NEW: [{title, description}]
        },
        contact: {
            phone: '',
            whatsapp: '',
            email: ''
        }
    });

    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Derived state for region/state logic (simplified)
    const [selectedState, setSelectedState] = useState('');

    useEffect(() => {
        fetchStates();
        if (isEdit) fetchDestination();
    }, []);

    useEffect(() => {
        if (selectedState) {
            fetchDistricts(selectedState);
        } else {
            setDistricts([]);
        }
    }, [selectedState]);

    const getAuthHeader = () => ({ 'Authorization': sessionStorage.getItem('cms_auth') });

    const fetchStates = async () => {
        try {
            const res = await axios.get(`${API_URL}/states`);
            setStates(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDistricts = async (stateSlug) => {
        try {
            const res = await axios.get(`${API_URL}/northeast/${stateSlug}`);
            if (res.data.success && res.data.data.districts) {
                setDistricts(res.data.data.districts);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDestination = async () => {
        try {
            const res = await axios.get(`${API_URL}/cms/destinations/${id}`, { headers: getAuthHeader() });
            const data = res.data.data;
            if (data) {
                setFormData({
                    name: data.name,
                    type: data.type,
                    districtId: data.districtSlug || data.districtId?.slug || '', // Use slug if available
                    shortDescription: data.shortDescription || '',
                    overview: data.story?.overview || '',
                    quote: data.story?.quote || '', // NEW
                    culturalSignificance: data.story?.culturalSignificance || '',
                    localBelief: data.story?.localBelief || '',
                    guideInfo: data.guideInfo || '', // NEW
                    lat: data.location?.lat || '',
                    lng: data.location?.lng || '',
                    bestTimeToVisit: data.bestTimeToVisit || '',
                    isHiddenGem: data.isHiddenGem || false,
                    images: data.images?.map(img => typeof img === 'string' ? img : img.url) || [],
                    logistics: data.logistics || {
                        nearestTown: '', distanceFromNearestTown: '', distanceFromShillong: '', distanceFromGuwahati: '', transportationInfo: ''
                    },
                    experience: {
                        highlights: data.experience?.highlights || [],
                        visitorTips: data.experience?.visitorTips || [],
                        dontMiss: data.experience?.dontMiss || [] // NEW
                    },
                    contact: data.contact || { phone: '', whatsapp: '', email: '' }
                });
                // Assuming we can infer state from district or just manual for now
                if (data.districtId?.stateCode) {
                    // Need to map stateCode to stateSlug or ID?
                    // Simplified: Let user re-select state if needed
                }
            }
        } catch (err) {
            console.error("Failed to fetch destination", err);
        }
    };

    // Helper: Haversine Distance
    const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = x => (x * Math.PI) / 180;
        const R = 6371; // Earth radius in km

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    };

    const handleAutoCalculateDistances = () => {
        const { lat, lng } = formData;
        if (!lat || !lng) {
            alert("Please enter valid Latitude and Longitude first.");
            return;
        }

        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        if (isNaN(latNum) || isNaN(lngNum)) {
            alert("Invalid coordinates.");
            return;
        }

        // Coordinates
        const SHILLONG = { lat: 25.5788, lng: 91.8933 };
        const GUWAHATI = { lat: 26.1158, lng: 91.7086 };

        const distShillong = calculateHaversineDistance(latNum, lngNum, SHILLONG.lat, SHILLONG.lng);
        const distGuwahati = calculateHaversineDistance(latNum, lngNum, GUWAHATI.lat, GUWAHATI.lng);

        setFormData(prev => ({
            ...prev,
            logistics: {
                ...prev.logistics,
                distanceFromShillong: `${distShillong} km`,
                distanceFromGuwahati: `${distGuwahati} km` // Keeping numeric part clean for now, or adding "approx"? keeping simpler.
            }
        }));
        alert(`Distances Calculated:\nShillong: ${distShillong} km\nGuwahati: ${distGuwahati} km`);
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const token = sessionStorage.getItem('cms_auth');

        try {
            for (const file of files) {
                const uploadData = new FormData();
                uploadData.append('image', file);

                const res = await fetch(`${API_URL}/cms/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': token },
                    body: uploadData
                });

                const result = await res.json();
                if (result.success) {
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, result.url]
                    }));
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
            const payload = { ...formData };

            const url = isEdit ? `${API_URL}/cms/destinations/${id}` : `${API_URL}/cms/destinations`;
            const method = isEdit ? 'put' : 'post';

            const res = await axios({
                method,
                url,
                data: payload,
                headers: getAuthHeader()
            });

            if (res.data.success) {
                alert('Destination Saved Successfully! 🎉');
                navigate('/dev-cms');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save destination: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cms-form" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>{isEdit ? 'Edit Destination' : 'Add New Destination'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Basic Info */}
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label>Place Name</label>
                        <input
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                            style={{ width: '100%', padding: '8px' }}
                        >
                            <option value="waterfall">Waterfall</option>
                            <option value="trail">Trail / Trek</option>
                            <option value="hill">Hill / Peak</option>
                            <option value="village">Village</option>
                            <option value="lake">Lake</option>
                            <option value="cave">Cave</option>
                            <option value="forest">Forest</option>
                            <option value="valley">Valley</option>
                            <option value="nature">Nature</option>
                            <option value="temple">Temple / Monastery</option>
                            <option value="monument">Monument / Fort</option>
                            <option value="park">Park</option>
                            <option value="river">River</option>
                            <option value="viewpoint">Viewpoint</option>
                        </select>
                    </div>
                </div>

                {/* Location Selection */}
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label>State</label>
                        <select
                            value={selectedState}
                            onChange={e => setSelectedState(e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                        >
                            <option value="">Select State</option>
                            {states.map(s => (
                                <option key={s._id} value={s.slug}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>District</label>
                        <select
                            required
                            value={formData.districtId}
                            onChange={e => setFormData({ ...formData, districtId: e.target.value })}
                            style={{ width: '100%', padding: '8px' }}
                            disabled={!selectedState && !formData.districtId}
                        >
                            <option value="">Select District</option>
                            {districts.map(d => (
                                <option key={d._id} value={d.slug}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="form-group">
                    <label>Short Description (Card)</label>
                    <textarea
                        required
                        value={formData.shortDescription}
                        onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                        maxLength={150}
                        style={{ width: '100%', padding: '8px', height: '60px' }}
                    />
                </div>

                {/* Story / Details */}
                <div className="form-group">
                    <label>Full Story / Overview</label>
                    <textarea
                        required
                        value={formData.overview}
                        onChange={e => setFormData({ ...formData, overview: e.target.value })}
                        style={{ width: '100%', padding: '8px', height: '100px' }}
                    />
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label>Cultural Significance</label>
                        <textarea
                            value={formData.culturalSignificance}
                            onChange={e => setFormData({ ...formData, culturalSignificance: e.target.value })}
                            style={{ width: '100%', padding: '8px', height: '80px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Local Legend / Beliefs</label>
                        <textarea
                            value={formData.localBelief}
                            onChange={e => setFormData({ ...formData, localBelief: e.target.value })}
                            style={{ width: '100%', padding: '8px', height: '80px' }}
                        />
                    </div>
                </div>

                {/* Geo Location */}
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label>Latitude</label>
                        <input
                            type="number"
                            step="any"
                            value={formData.lat}
                            onChange={e => setFormData({ ...formData, lat: e.target.value })}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Longitude</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="number"
                                step="any"
                                value={formData.lng}
                                onChange={e => setFormData({ ...formData, lng: e.target.value })}
                                style={{ width: '100%', padding: '8px' }}
                            />
                            <button
                                type="button"
                                onClick={handleAutoCalculateDistances}
                                style={{
                                    padding: '8px 12px',
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer'
                                }}
                            >
                                Auto-fill Distances
                            </button>
                        </div>
                    </div>
                </div>

                {/* Logistics Section */}
                <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '20px' }}>Logistics details</h3>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label>Nearest Town</label>
                        <input
                            value={formData.logistics.nearestTown}
                            onChange={e => setFormData({ ...formData, logistics: { ...formData.logistics, nearestTown: e.target.value } })}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Distance from Nearest Town</label>
                        <input
                            value={formData.logistics.distanceFromNearestTown}
                            onChange={e => setFormData({ ...formData, logistics: { ...formData.logistics, distanceFromNearestTown: e.target.value } })}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Distance from Shillong</label>
                        <input
                            value={formData.logistics.distanceFromShillong}
                            onChange={e => setFormData({ ...formData, logistics: { ...formData.logistics, distanceFromShillong: e.target.value } })}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Distance from Guwahati</label>
                        <input
                            value={formData.logistics.distanceFromGuwahati}
                            onChange={e => setFormData({ ...formData, logistics: { ...formData.logistics, distanceFromGuwahati: e.target.value } })}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Transportation Info (How to reach)</label>
                    <textarea
                        value={formData.logistics.transportationInfo}
                        onChange={e => setFormData({ ...formData, logistics: { ...formData.logistics, transportationInfo: e.target.value } })}
                        style={{ width: '100%', padding: '8px', height: '80px' }}
                    />
                </div>

                {/* Experience Section (Highlights & Tips) */}
                <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '20px' }}>Experience & Tips</h3>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Highlights */}
                    <div className="form-group">
                        <label>Highlights (One per line)</label>
                        <textarea
                            value={formData.experience.highlights.join('\n')}
                            onChange={e => setFormData({
                                ...formData,
                                experience: { ...formData.experience, highlights: e.target.value.split('\n') }
                            })}
                            placeholder="Enter each highlight on a new line"
                            style={{ width: '100%', padding: '8px', height: '120px' }}
                        />
                    </div>
                    {/* Visitor Tips */}
                    <div className="form-group">
                        <label>Visitor Tips (One per line)</label>
                        <textarea
                            value={formData.experience.visitorTips.join('\n')}
                            onChange={e => setFormData({
                                ...formData,
                                experience: { ...formData.experience, visitorTips: e.target.value.split('\n') }
                            })}
                            placeholder="Enter each tip on a new line"
                            style={{ width: '100%', padding: '8px', height: '120px' }}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Inspirational Quote (shown in hero)</label>
                    <textarea
                        value={formData.quote}
                        onChange={e => setFormData({ ...formData, quote: e.target.value })}
                        style={{ width: '100%', padding: '8px', height: '60px' }}
                        placeholder="e.g. “Segmented into distinct sections...”"
                    />
                </div>

                <div className="form-group">
                    <label>Local Guide / Buddy Info</label>
                    <textarea
                        value={formData.guideInfo}
                        onChange={e => setFormData({ ...formData, guideInfo: e.target.value })}
                        style={{ width: '100%', padding: '8px', height: '60px' }}
                        placeholder="Info about hiring detailed guides..."
                    />
                </div>

                {/* Don't Miss Section */}
                <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '20px' }}>Don't Miss (4 boxes recommended)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {formData.experience.dontMiss.map((item, index) => (
                        <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '10px', alignItems: 'center', background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                            <input
                                placeholder="Title (optional)"
                                value={item.title || ''}
                                onChange={e => {
                                    const newMiss = [...formData.experience.dontMiss];
                                    newMiss[index].title = e.target.value;
                                    setFormData({ ...formData, experience: { ...formData.experience, dontMiss: newMiss } });
                                }}
                                style={{ padding: '8px' }}
                            />
                            <textarea
                                placeholder="Description"
                                value={item.description || ''}
                                onChange={e => {
                                    const newMiss = [...formData.experience.dontMiss];
                                    newMiss[index].description = e.target.value;
                                    setFormData({ ...formData, experience: { ...formData.experience, dontMiss: newMiss } });
                                }}
                                style={{ padding: '8px', height: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newMiss = formData.experience.dontMiss.filter((_, i) => i !== index);
                                    setFormData({ ...formData, experience: { ...formData.experience, dontMiss: newMiss } });
                                }}
                                style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setFormData({
                            ...formData,
                            experience: {
                                ...formData.experience,
                                dontMiss: [...formData.experience.dontMiss, { title: '', description: '' }]
                            }
                        })}
                        style={{ padding: '8px', marginTop: '10px', cursor: 'pointer', background: '#eee', border: '1px dashed #999' }}
                    >
                        + Add "Don't Miss" Item
                    </button>
                </div>

                {/* Contact Section */}
                <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '20px' }}>Contact Info</h3>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            value={formData.contact.phone}
                            onChange={e => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>WhatsApp</label>
                        <input
                            value={formData.contact.whatsapp}
                            onChange={e => setFormData({ ...formData, contact: { ...formData.contact, whatsapp: e.target.value } })}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            value={formData.contact.email}
                            onChange={e => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                </div>

                {/* Images */}
                <div className="form-group">
                    <label>Images (First one is Preview/Hero) - Select Multiple or Add URLs</label>
                    <input type="file" multiple onChange={handleImageUpload} style={{ marginBottom: '10px' }} />

                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                            ref={imageUrlRef}
                            placeholder="Paste Image URL"
                            onKeyDown={e => {
                                if (e.key === 'Enter' && e.target.value) {
                                    e.preventDefault();
                                    setFormData(prev => ({ ...prev, images: [...prev.images, e.target.value] }));
                                    e.target.value = '';
                                }
                            }}
                            style={{ flex: 1, padding: '8px' }}
                        />
                        <button type="button" onClick={() => {
                            if (imageUrlRef.current && imageUrlRef.current.value) {
                                setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlRef.current.value] }));
                                imageUrlRef.current.value = '';
                            }
                        }} style={{ padding: '8px 16px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>
                            Add URL
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                        {formData.images.map((img, i) => (
                            <div key={i} style={{ position: 'relative', width: '100px', height: '70px' }}>
                                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                                    style={{
                                        position: 'absolute', top: -5, right: -5,
                                        background: 'red', color: 'white', borderRadius: '50%',
                                        width: '20px', height: '20px', border: 'none', cursor: 'pointer',
                                        fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >×</button>
                            </div>
                        ))}
                    </div>
                    {uploading && <p>Uploading...</p>}
                </div>

                {/* Misc */}
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label>Best Time to Visit</label>
                        <input
                            value={formData.bestTimeToVisit}
                            onChange={e => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                            placeholder="e.g., Oct-Mar"
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            checked={formData.isHiddenGem}
                            onChange={e => setFormData({ ...formData, isHiddenGem: e.target.checked })}
                            id="isHiddenGem"
                        />
                        <label htmlFor="isHiddenGem">Mark as "Hidden Gem"</label>
                    </div>
                </div>

                <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={loading} style={{ padding: '12px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Saving...' : 'Save Destination'}
                    </button>
                    <button type="button" onClick={() => navigate('/dev-cms')} style={{ padding: '12px 24px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
