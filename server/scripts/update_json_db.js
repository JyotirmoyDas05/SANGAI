/**
 * Update JSON DB script
 * Reads from src/DATABASE/district.json and updates server/data/districts.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_SOURCE = path.join(__dirname, '../../src/DATABASE/district.json');
const DATA_DEST = path.join(__dirname, '../data/districts.json');

const updateJsonDb = () => {
    console.log('🔄 Updating JSON DB...');

    // 1. Read Source
    if (!fs.existsSync(DATA_SOURCE)) {
        console.error('❌ Source file not found:', DATA_SOURCE);
        process.exit(1);
    }
    const sourceContent = fs.readFileSync(DATA_SOURCE, 'utf-8');
    const sourceDistricts = JSON.parse(sourceContent).filter(d => !d["//_COMMENT"]);

    // 2. Add Missing Districts (Legacy Format)
    const missingDistricts = [
        {
            "_id": "AS_KAR_ANG",
            "stateId": "AS",
            "name": "Karbi Anglong",
            "slug": "karbi_anglong",
            "hq_coordinates": { "lat": 25.85, "lng": 93.43 },
            "tagline": "Land of the Hills",
            "images": {
                "hero": ["https://images.unsplash.com/photo-1590053165219-c8872cd92348?auto=format&fit=crop&q=80&w=2000"],
                "map": "url_svg"
            },
            "weather_code": 95,
            "sense_of_place": {
                "one_liner": "A pristine hill district rich in tribal heritage.",
                "background_texture": "url_texture_hills"
            },
            "description": {
                "title": "Welcome to Karbi Anglong",
                "content": "The largest district in Assam, known for its lush green hills, rare flora, and the vibrant culture of the Karbi people."
            },
            "stats": {
                "capital": "Diphu",
                "landscape": "Hills & Forests",
                "languages": ["Karbi", "English", "Assamese"],
                "population": "9.6 Lakhs",
                "area": "10,434 sq km"
            },
            "land_and_memory": {
                "title": "Ancient Hills",
                "content": "These hills have been the home of the Karbi people since time immemorial, echoing with folklore and songs."
            },
            "defining_themes": [
                { "icon": "forest", "title": "Green Cover", "description": "Dense tropical forests." },
                { "icon": "groups", "title": "Tribal Culture", "description": "Rich traditions of the Karbi tribe." }
            ],
            "shopping_cta": {
                "title": "Karbi Crafts",
                "categories": ["Traditional Weaving", "Bamboo Crafts"]
            },
            "known_for": ["Hills", "Trekking", "Tribal Culture"]
        },
        {
            "_id": "AS_MAJ",
            "stateId": "AS",
            "name": "Majuli",
            "slug": "majuli",
            "hq_coordinates": { "lat": 26.95, "lng": 94.22 },
            "tagline": "Culture amidst the River",
            "images": {
                "hero": ["https://images.unsplash.com/photo-1628062137937-23b938446187?auto=format&fit=crop&q=80&w=2000"],
                "map": "url_svg"
            },
            "weather_code": 63,
            "sense_of_place": {
                "one_liner": "The world's largest river island.",
                "background_texture": "url_texture_river"
            },
            "description": {
                "title": "Welcome to Majuli",
                "content": "A spiritual and cultural hub in the Brahmaputra river, famous for its Satras (monasteries)."
            },
            "stats": {
                "capital": "Garamur",
                "landscape": "River Island",
                "languages": ["Assamese", "Mising"],
                "population": "1.6 Lakhs",
                "area": "352 sq km"
            },
            "land_and_memory": {
                "title": "River's Song",
                "content": "Life here flows with the rhythm of the Brahmaputra."
            },
            "shopping_cta": {
                "title": "Island Crafts",
                "categories": ["Masks", "Handloom"]
            },
            "known_for": ["Satras", "Pottery", "Masks"]
        }
    ];

    const finalDistricts = [...sourceDistricts, ...missingDistricts];

    // 3. Write Destination
    fs.writeFileSync(DATA_DEST, JSON.stringify(finalDistricts, null, 2), 'utf-8');
    console.log(`✅ Updated ${DATA_DEST} with ${finalDistricts.length} districts.`);
};

updateJsonDb();
