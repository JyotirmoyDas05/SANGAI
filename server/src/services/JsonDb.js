import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to data folder: ../../../data (relative to src/services)
const DATA_DIR = path.join(__dirname, '..', '..', 'data');

class JsonDb {
    constructor() {
        this.data = {};
        this.loaded = false;
    }

    // Load data on first request
    _load() {
        if (this.loaded) return;

        try {
            const files = [
                'states_rich.json',
                'districts.json',
                'places_normalized.json',
                'homestays.json',
                'festivals.json',
                'culture_master.json',
                'products_master.json',
                'taxonomy.json',
                'travel_guides.json'
            ];

            files.forEach(file => {
                const filePath = path.join(DATA_DIR, file);
                if (fs.existsSync(filePath)) {
                    // key is filename without extension, e.g. 'states_rich'
                    const key = path.basename(file, '.json');
                    this.data[key] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                } else {
                    console.warn(`[JsonDb] Warning: File not found ${filePath}`);
                    const key = path.basename(file, '.json');
                    this.data[key] = [];
                }
            });

            this.loaded = true;
            console.log('[JsonDb] Data loaded into memory.');
        } catch (error) {
            console.error('[JsonDb] Error loading data:', error);
            throw error;
        }
    }

    getStates() {
        this._load();
        return this.data.states_rich || [];
    }

    getStateBySlug(slug) {
        this._load();
        return this.data.states_rich?.find(s => s.slug === slug);
    }

    getDistricts(stateCode) {
        this._load();
        if (!stateCode) return this.data.districts || [];
        return this.data.districts?.filter(d => d.stateId === stateCode) || [];
    }

    getPlaces(districtId) {
        this._load();
        let places = this.data.places_normalized || [];
        if (districtId) {
            places = places.filter(p => p.districtId === districtId);
        }
        return places;
    }

    getPlaceById(id) {
        this._load();
        return this.data.places_normalized?.find(p => p._id === id);
    }

    getHomestays(placeId) {
        this._load();
        let homestays = this.data.homestays || [];
        if (placeId) {
            homestays = homestays.filter(h => h.placeId === placeId);
        }
        return homestays;
    }

    getCulture(category) {
        this._load();
        let culture = this.data.culture_master || [];
        if (category) {
            culture = culture.filter(c => c.category === category);
        }
        return culture;
    }

    getFestivals() {
        this._load();
        return this.data.festivals || [];
    }
}

export default new JsonDb();
