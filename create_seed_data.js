import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base Path
const JSON_BACKEND = path.join(__dirname, 'server', 'data');

// ------------------------------------------------------------------
// 1. STATES RICH DATA
// ------------------------------------------------------------------
const statesRich = [
    {
        "_id": "MN",
        "slug": "manipur",
        "name": "Manipur",
        "tagline": "Jewel of India",
        "capital": "Imphal",
        "coordinates": { "lat": 24.817, "lng": 93.936 },
        "stats": {
            "population": "2.8 Million",
            "area": "22,327 sq km",
            "languages": ["Meitei", "English"],
            "landscapeType": "Hills & Valley",
            "climate": "Sub-tropical"
        },
        "images": {
            "hero": [
                "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2000",
                "https://images.unsplash.com/photo-1605377349974-9463c23e800d?auto=format&fit=crop&q=80&w=2000"
            ],
            "map": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Manipur_locator_map.svg/1200px-Manipur_locator_map.svg.png"
        },
        "weatherCode": 95,
        "funFacts": [
            "Home to the world's only floating national park.",
            "The birthplace of modern Polo."
        ],
        "description_section": {
            "title": "Welcome to Manipur",
            "content": "Manipur is a mosaic of ancient traditions and breathtaking landscapes. Known as the 'Jewel of India', it offers a unique blend of valley culture and hill tribe heritage.",
            "call_to_action": "Read More"
        },
        "land_and_memory": {
            "title": "Land & Memory",
            "tone": "philosophical",
            "content": "Manipur is defined by the phumdis of Loktak Lake and the rolling green hills. It is a land where history is whispered in the winds of the Kangla Fort and sung in the ballads of Khongjom.",
            "background_image": "https://images.unsplash.com/photo-1626015099719-217a151b6601?auto=format&fit=crop&q=80&w=2000"
        },
        "defining_themes": [
            {
                "icon": "terrain",
                "title": "Floating Wetlands",
                "description": "The unique ecosystem of Loktak Lake."
            },
            {
                "icon": "diversity_3",
                "title": "Meitei Culture",
                "description": "Rich classical dance and martial arts traditions."
            }
        ],
        "contributions": [
            {
                "icon": "sports_kabaddi",
                "category": "Sports",
                "title": "Origin of Polo",
                "description": "Sagol Kangjei, the indigenous form of polo, started here."
            },
            {
                "icon": "checkroom",
                "category": "Handloom",
                "title": "Moirang Phee",
                "description": "Distinctive temple border designs woven by women."
            }
        ],
        "ways_to_experience": [
            {
                "icon": "sailing",
                "title": "Lake Boating",
                "description": "Navigate the floating islands of Loktak."
            },
            {
                "icon": "temple_hindu",
                "title": "Temple Trails",
                "description": "Visit the Govindaji Temple and historical sites."
            }
        ],
        "essentials_summary": {
            "permit_required": true,
            "permit_name": "Inner Line Permit (ILP)"
        }
    },
    {
        "_id": "ML",
        "slug": "meghalaya",
        "name": "Meghalaya",
        "tagline": "Abode of Clouds",
        "capital": "Shillong",
        "coordinates": { "lat": 25.578, "lng": 91.893 },
        "stats": {
            "population": "3.3 Million",
            "area": "22,429 sq km",
            "languages": ["Khasi", "Garo", "Pnar", "English"],
            "landscapeType": "Plateau & Valleys",
            "climate": "Wet & Cool"
        },
        "images": {
            "hero": [
                "https://images.unsplash.com/photo-1626015099719-217a151b6601?auto=format&fit=crop&q=80&w=2000",
                "https://images.unsplash.com/photo-1594975619176-0f8c3534b17a?auto=format&fit=crop&q=80&w=2000"
            ],
            "map": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Meghalaya_locator_map.svg/1200px-Meghalaya_locator_map.svg.png"
        },
        "weatherCode": 63,
        "funFacts": [
            "Home to the wettest place on Earth, Mawsynram.",
            "Famous for living root bridges bio-engineered by locals."
        ],
        "description_section": {
            "title": "Welcome to Meghalaya",
            "content": "Meghalaya, the 'Abode of Clouds', is a mesmerizing tapestry of misty hills, cascading waterfalls, and ancient root bridges.",
            "call_to_action": "Explore Mist"
        },
        "land_and_memory": {
            "title": "Land & Memory",
            "tone": "poetic",
            "content": "Walk through the sacred groves where ancestors whisper in the rustling leaves. The living root bridges stand as a testament to a deep, symbiotic bond with nature.",
            "background_image": "https://images.unsplash.com/photo-1566837945700-30057527653a?auto=format&fit=crop&q=80&w=2000"
        },
        "defining_themes": [
            {
                "icon": "forest",
                "title": "Living Architecture",
                "description": "Bridges grown from rubber tree roots."
            },
            {
                "icon": "water_drop",
                "title": "Cascading Falls",
                "description": "Land of a thousand waterfalls like Nohkalikai."
            }
        ],
        "contributions": [
            {
                "icon": "music_note",
                "category": "Music",
                "title": "Rock Capital",
                "description": "Shillong is known as India's Rock Capital."
            }
        ],
        "ways_to_experience": [
            {
                "icon": "hiking",
                "title": "Caving & Trekking",
                "description": "Explore some of South Asia's longest caves."
            }
        ],
        "essentials_summary": {
            "permit_required": false,
            "permit_name": "None for Indian Tourists (Registration for Foreigners)"
        }
    }
];

// ------------------------------------------------------------------
// 2. DISTRICTS DATA
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// 2. DISTRICTS DATA
// ------------------------------------------------------------------
console.log('...Loading districts from src/DATABASE/district.json');
const districtJsonPath = path.join(__dirname, 'src', 'DATABASE', 'district.json');
let rawDistricts = [];
try {
    const fileContent = fs.readFileSync(districtJsonPath, 'utf-8');
    rawDistricts = JSON.parse(fileContent);
} catch (err) {
    console.warn('Warning: Could not read district.json:', err.message);
    // Fallback to minimal data if file missing
    rawDistricts = [];
}

// Filter out comments and prepare base list
const validDistricts = rawDistricts.filter(d => !d["//_COMMENT"]);

// Manual Additions (Missing in JSON)
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
        }
    },
    // Adding Majuli manually if missing or just to be safe as it's a key destination
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
        }
    }
];

// Combine them
const districts = [...validDistricts, ...missingDistricts];

// ------------------------------------------------------------------
// 3. PLACES NORMALIZED (Destinations)
// ------------------------------------------------------------------
const placesHelper = [
    {
        "_id": "HP001",
        "districtId": "MN_BIS_01",
        "name": "Loktak Lake",
        "type": "Nature",
        "location_summary": "Bishnupur, Manipur",
        "tier": 1,
        "isHiddenGem": false,
        "shortDescription": "The world's only floating lake, home to the dancing deer.",
        "header_quote": "A mirror to the sky, floating islands drifting in time.",
        "story": {
            "overview": "Loktak Lake is the largest freshwater lake in Northeast India and is famous for its phumdis (heterogeneous mass of vegetation, soil and organic matter at various stages of decomposition) floating over it.",
            "culturalSignificance": "It serves as a lifeline for the people of Manipur, providing water for hydropower generation, irrigation, and drinking supply.",
            "localBelief": "The lake is considered the mother source of life in Moirang folklore."
        },
        "logistics": {
            "how_to_get_there": [
                "48 km from Imphal Airport.",
                "Taxis and buses are readily available from Imphal."
            ],
            "when_and_where": {
                "location_text": "Moirang, Bishnupur District",
                "distances": { "imphal_airport": "48 km", "dimapur_railway": "215 km" },
                "best_time": "October to March",
                "open_hours": "6:00 AM to 5:00 PM"
            }
        },
        "helpline": { "phone": "+91 9856...", "email": "tourism@manipur.gov.in" },
        "nearby_attractions": [
            { "name": "Keibul Lamjao Park", "image": "https://images.unsplash.com/photo-1544634076-a90160bcadcb?w=600" },
            { "name": "INA Museum", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/INA_Martyr%27s_Memorial_Complex_Moirang.jpg/640px-INA_Martyr%27s_Memorial_Complex_Moirang.jpg" }
        ],
        "location": { "lat": 24.55, "lng": 93.80 },
        "images": [
            { "url": "https://images.unsplash.com/photo-1605377349974-9463c23e800d?auto=format&fit=crop&q=80&w=2000", "caption": "Fisherman at sunset" }
        ],
        "taxonomy_tags": ["nature", "wetlands", "boating"],
        "related_homestay_ids": ["HS001"]
    },
    {
        "_id": "HP002",
        "districtId": "ML_EKH", // Linked to East Khasi Hills (Shillong)
        "name": "Nohkalikai Falls",
        "type": "Nature",
        "location_summary": "Sohra, Meghalaya",
        "tier": 1,
        "isHiddenGem": true,
        "shortDescription": "One of India's tallest waterfalls.",
        "header_quote": "A dramatic plunge into an emerald pool.",
        "story": {
            "overview": "Nohkalikai Falls is one of India's tallest plunge and most breathtaking waterfalls, plunging 340 meters into a deep, emerald-green pool.",
            "culturalSignificance": "Carries a tragic legend of a woman named Likai.",
            "localBelief": "Locals respect the pool as a site of grief and beauty."
        },
        "logistics": {
            "how_to_get_there": ["Cabs available from Shillong (54km)."],
            "when_and_where": {
                "location_text": "7.5 km from Sohra (Cherrapunji)",
                "distances": { "shillong": "54 km", "guwahati": "148 km" },
                "best_time": "September to December",
                "open_hours": "8:00 AM to 5:00 PM"
            }
        },
        "location": { "lat": 25.27, "lng": 91.73 },
        "images": [{ "url": "https://images.unsplash.com/photo-1626015099719-217a151b6601?auto=format&fit=crop&q=80&w=2000", "caption": "The Plunge" }],
        "taxonomy_tags": ["nature", "waterfall", "trekking"], // "trekking" adds Adventure badge
        "related_homestay_ids": []
    }
];

// ------------------------------------------------------------------
// 4. HOMESTAYS
// ------------------------------------------------------------------
const homestays = [
    {
        "_id": "HS001",
        "placeId": "HP001",
        "name": "Sendra Cottage",
        "address": "Sendra Hill, Loktak Lake, Moirang",
        "rating": { "score": 4.5, "label": "Very Good", "count": 42 },
        "price": { "amount": 3500, "currency": "INR", "unit": "1 Night, 1 Adult" },
        "amenities_list": ["View", "Restaurant", "Parking"],
        "amenities_detailed": [
            { "icon": "waves", "title": "Lake View", "description": "Direct view of the floating phumdis." },
            { "icon": "restaurant", "title": "In-house Dining", "description": "Serves traditional Manipuri thali." }
        ],
        "host": {
            "name": "Local Tourism Guild",
            "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
            "bio": "Managed by the community."
        },
        "policies": {
            "check_in": "12:00 PM",
            "check_out": "11:00 AM",
            "property_rules": ["Valid ID Required", "No loud music after 9 PM"],
            "cancellation_policy": {
                "text": ["Full refund if cancelled 7 days prior."],
                "table": [{ "days_before": "7 Days", "refund": "100%" }]
            }
        },
        "room_types": [{ "type": "Cottage", "price": 3500, "capacity": 2 }],
        "images": ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"]
    }
];

// ------------------------------------------------------------------
// 5. CULTURE MASTER
// ------------------------------------------------------------------
const cultureMaster = [
    {
        "_id": "CUL_MN_FEST_SANGAI",
        "stateId": "MN",
        "category": "festivals",
        "title": "Sangai Festival",
        "dates": "November 21-30",
        "location_name": "Hapta Kangjeibung, Imphal",
        "summary": "Manipur's biggest tourism festival celebrating the state animal, the Sangai deer.",
        "full_story": "The festival showcases the rich cultural heritage, handloom, handicrafts, and fine arts of the state.",
        "images": ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2000"],
        "tags": ["culture", "dance"],
        "isHiddenGem": false,
        "details": {
            "significance": "Promotes Manipur as a world-class tourism destination.",
            "best_experienced_at": { "event": "Imphal Main Venue", "dates": "Nov 21-30" },
            "hero_image": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2000",
            "article_content": [
                "The festival is named after the State Animal, Sangai, the brow-antlered deer found only in Manipur.",
                "It features indigenous sports like Sagol Kangjei (Polo), Thang Ta (Martial Arts), and Mukna Kangjei."
            ]
        },
        "related_festival_id": "FEST_MN_SANGAI"
    },
    {
        "_id": "CUL_AS_MUSIC_DRUM",
        "stateId": "AS",
        "category": "music",
        "title": "Folk Drum (Dhol)",
        "location_name": "Across Assam",
        "summary": "The heartbeat of Assamese music.",
        "images": ["https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200"],
        "isHiddenGem": true,
        "details": {
            "significance": "A repository of history and community status.",
            "best_experienced_at": { "event": "Bihu Festival", "dates": "April" },
            "hero_image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200",
            "article_content": ["To truly understand Assam, one must understand its music. The folk drum is more than just a tradition..."]
        }
    }
];

// ------------------------------------------------------------------
// 6. FESTIVALS (Calendar)
// ------------------------------------------------------------------
const festivals = [
    {
        "_id": "FEST_MN_SANGAI",
        "stateId": "MN",
        "name": "Sangai Festival",
        "description": "Annual cultural extravaganza.",
        "startDate": "2025-11-21",
        "endDate": "2025-11-30",
        "location": { "address": "Imphal", "lat": 24.81, "lng": 93.93 },
        "images": { "hero": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800", "gallery": [] },
        "bookingLink": "https://manipur.gov.in",
        "tags": ["culture", "dance"],
        "is_eco_certified": false,
        "related_culture_id": "CUL_MN_FEST_SANGAI"
    },
    {
        "_id": "FEST_ML_CHERRY",
        "stateId": "ML",
        "districtId": "ML_EKH",
        "name": "Shillong Cherry Blossom Festival",
        "description": "Pink blooms and rock music.",
        "startDate": "2025-11-14",
        "endDate": "2025-11-15",
        "location": { "address": "Jawaharlal Nehru Stadium, Shillong" },
        "images": { "hero": "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800", "gallery": [] },
        "bookingLink": "https://rockskitickets.com",
        "tags": ["music", "nature", "Eco-Certified"],
        "is_eco_certified": true,
        "related_culture_id": null
    }
];

// ------------------------------------------------------------------
// 7. REAL EXECUTION: Writing Files
// ------------------------------------------------------------------
console.log('🌱 Seeding JSON Backend...');

function write(filename, data) {
    fs.writeFileSync(path.join(JSON_BACKEND, filename), JSON.stringify(data, null, 2));
    console.log(`✅ Written ${filename}`);
}

// Write all files
write('states_rich.json', statesRich);
write('districts.json', districts);
write('places_normalized.json', placesHelper);
write('homestays.json', homestays);
write('culture_master.json', cultureMaster);
write('festivals.json', festivals);

// Placeholders for simpler files
write('travel_guides.json', [
    {
        "_id": "MN_GUIDE",
        "stateId": "MN",
        "personas": [
            { "title": "First-time Visitor", "icon": "flag", "description": "Get your ILP online." },
            { "title": "Solo", "icon": "person", "description": "Safe, but stick to main routes." }
        ],
        "travel_realities": {
            "road_condition": { "label": "Roads", "value": "Moderate" },
            "connectivity": { "label": "Signal", "value": "Good in Imphal" }
        }
    }
]);

write('products_master.json', [
    {
        "_id": "PROD_MN_01",
        "stateId": "MN",
        "title": "Rani Phee",
        "price": 4500,
        "images": ["https://images.unsplash.com/photo-1627519528731-862953835f1e?w=800"],
        "category": "textile"
    }
]);

write('collections_metadata.json', {
    "textile": { "title": "Textile", "heroType": "image", "mediaUrl": "https://images.unsplash.com/photo-1627519528731-862953835f1e?w=1200" }
});

write('taxonomy.json', {
    "categories": { "nature": ["lake", "waterfall"], "culture": ["festival"] },
    "category_icons": { "festivals": "celebration", "music": "music_note", "attire": "checkroom", "food": "restaurant", "wildlife": "nature" }
});

write('search_index.json', [
    { "id": "HP001", "title": "Loktak Lake", "type": "Destination", "url": "/manipur/destination/HP001" },
    { "id": "CUL_MN_FEST_SANGAI", "title": "Sangai Festival", "type": "Culture", "url": "/manipur/culture/festivals/sangai" }
]);

write('featured_content.json', {
    "trending_now": ["HP001", "CUL_MN_FEST_SANGAI"]
});

console.log('✨ Seeding Complete!');
