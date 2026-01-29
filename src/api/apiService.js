/**
 * SANGAI API Service
 * Connects frontend to backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    }
    catch (error) {
        console.error(`API Error (${endpoint}):`, error.message);
        throw error;
    }
}

// ============ Districts API ============

export async function getDistricts() {
    const result = await fetchAPI('/districts');
    return result.data; // Returns object grouped by state
}

export async function getDistrictsByState(stateCode) {
    const result = await fetchAPI(`/districts/by-state/${stateCode}`);
    return result.data;
}

export async function getDistrictById(id) {
    const result = await fetchAPI(`/districts/${id}`);
    return result.data;
}

export async function getDistrictBySlug(slug) {
    const result = await fetchAPI(`/districts/by-slug/${slug}`);
    return result.data;
}

// ============ Regions API ============

export async function getRegions() {
    const result = await fetchAPI('/regions');
    return result.data;
}

export async function getRegionBySlug(slug) {
    const result = await fetchAPI(`/regions/${slug}`);
    return result.data;
}

// ============ States API ============

export async function getStates() {
    const result = await fetchAPI('/states');
    return result.data;
}

export async function getStateBySlug(slug) {
    const result = await fetchAPI(`/states/${slug}`);
    return result.data;
}

export async function getStateDistricts(slug) {
    const result = await fetchAPI(`/states/${slug}/districts`);
    return result.data;
}

// ============ Places API ============

export async function getPlaces(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const result = await fetchAPI(`/places${queryString ? `?${queryString}` : ''}`);
    return result;
}

export async function getPlaceById(id) {
    const result = await fetchAPI(`/places/${id}`);
    return result.data;
}

export async function getPlaceTypes() {
    const result = await fetchAPI('/places/types');
    return result.data;
}

export async function getNearbyPlaces(lat, lng, maxDistance = 50000) {
    const result = await fetchAPI(`/places/nearby?lat=${lat}&lng=${lng}&maxDistance=${maxDistance}`);
    return result.data;
}

// ============ Homestays API ============

export async function getHomestays(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const result = await fetchAPI(`/homestays${queryString ? `?${queryString}` : ''}`);
    return result;
}

export async function getHomestayById(id) {
    const result = await fetchAPI(`/homestays/${id}`);
    return result.data;
}

export async function getAmenities() {
    const result = await fetchAPI('/homestays/amenities');
    return result.data;
}

// ============ Guides API ============

export async function getGuides(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const result = await fetchAPI(`/guides${queryString ? `?${queryString}` : ''}`);
    return result;
}

export async function getGuideById(id) {
    const result = await fetchAPI(`/guides/${id}`);
    return result.data;
}

export async function getGuideLanguages() {
    const result = await fetchAPI('/guides/languages');
    return result.data;
}

export async function getGuideSpecialties() {
    const result = await fetchAPI('/guides/specialties');
    return result.data;
}

// ============ Festivals API ============

export async function getFestivals() {
    const result = await fetchAPI('/festivals');
    return result.data;
}

export async function getFestivalById(id) {
    const result = await fetchAPI(`/festivals/${id}`);
    return result.data;
}

export async function getUpcomingFestivals(limit = 10) {
    const result = await fetchAPI(`/festivals/upcoming?limit=${limit}`);
    return result.data;
}

export async function getFestivalsByMonth(month) {
    const result = await fetchAPI(`/festivals/by-month/${month}`);
    return result.data;
}

// ============ Search API ============

export async function searchAll(query, type = null) {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    const result = await fetchAPI(`/search?${params.toString()}`);
    return result.data;
}

// ============ Tags API ============

export async function getTags() {
    const result = await fetchAPI('/tags');
    return result.data;
}

// ============ Health Check ============

export async function healthCheck() {
    const result = await fetchAPI('/health');
    return result;
}

// Export all as default object for convenience
export default {
    // Regions
    getRegions,
    getRegionBySlug,
    // States
    getStates,
    getStateBySlug,
    getStateDistricts,
    // Districts
    getDistricts,
    getDistrictsByState,
    getDistrictById,
    getDistrictBySlug,
    // Places
    getPlaces,
    getPlaceById,
    getPlaceTypes,
    getNearbyPlaces,
    // Homestays
    getHomestays,
    getHomestayById,
    getAmenities,
    // Guides
    getGuides,
    getGuideById,
    getGuideLanguages,
    getGuideSpecialties,
    // Festivals
    getFestivals,
    getFestivalById,
    getUpcomingFestivals,
    getFestivalsByMonth,
    // Search
    searchAll,
    // Tags
    getTags,
    // Health
    healthCheck,
};
