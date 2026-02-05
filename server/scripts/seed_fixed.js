/**
 * Database Seeding Script (FIXED)
 * Transforms legacy district data to new Schema
 */
import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../src/config/database.js';
import {
    Region,
    State,
    District,
    Place,
    Homestay,
    Guide,
    FestivalMaster,
    FestivalOccurrence,
    Tag
} from '../src/models/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_DIR = join(__dirname, '../../src/json_backend/_legacy');

/**
 * Load JSON file safely
 */
const loadJSON = (filename) => {
    const filepath = join(JSON_DIR, filename);
    if (!existsSync(filepath)) {
        console.log(`   ⚠️  File not found: ${filename}, skipping...`);
        return [];
    }
    const content = readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
};

/**
 * Seed all collections
 */
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seed (FIXED Script)...\n');

        // Connect to MongoDB
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            Region.deleteMany({}),
            State.deleteMany({}),
            District.deleteMany({}),
            Place.deleteMany({}),
            Homestay.deleteMany({}),
            Guide.deleteMany({}),
            FestivalMaster.deleteMany({}),
            FestivalOccurrence.deleteMany({}),
            Tag.deleteMany({})
        ]);

        // Load JSON files
        console.log('📂 Loading JSON files...');
        const regions = loadJSON('regions.json');
        const states = loadJSON('states.json');
        // const districts = loadJSON('districts.json'); // SKIP legacy missing file
        const tags = loadJSON('tags.json');
        const places = loadJSON('places_normalized.json');
        const homestays = loadJSON('homestays_normalized.json');
        const guides = loadJSON('guides_normalized.json');
        const festivalMasters = loadJSON('festival_master.json');
        const festivalOccurrences = loadJSON('festival_occurrences.json');

        // Insert data in order
        console.log('📥 Inserting Regions...');
        if (regions.length > 0) {
            await Region.insertMany(regions);
            console.log(`   ✓ ${regions.length} regions inserted`);
        }

        console.log('📥 Inserting States...');
        if (states.length > 0) {
            await State.insertMany(states);
            console.log(`   ✓ ${states.length} states inserted`);
        }

        console.log('📥 Inserting Districts (with Transformation)...');

        // 1. Helpers for Schema Transformation
        const STATE_MAP = {
            "AR": "Arunachal Pradesh",
            "AS": "Assam",
            "MN": "Manipur",
            "ML": "Meghalaya",
            "MZ": "Mizoram",
            "NL": "Nagaland",
            "SK": "Sikkim",
            "TR": "Tripura"
        };

        const transformDistrict = (d) => {
            return {
                _id: d._id,
                stateCode: d.stateId || d.stateCode,
                stateName: STATE_MAP[d.stateId || d.stateCode] || "Unknown State",
                districtName: d.name || d.districtName,
                region: "northeast",
                slug: d.slug,
                tagline: d.tagline,
                heroImage: {
                    url: d.images?.hero?.[0] || d.heroImage?.url,
                    caption: d.name
                },
                // Map legacy 'description' string or object to new 'context' or 'everydayLife'
                context: {
                    landscapeType: d.stats?.landscape || "Diverse Landscape",
                    partOfState: "Region",
                    surroundings: d.description?.content || d.description || ""
                },
                everydayLife: {
                    description: d.sense_of_place?.one_liner || "",
                    rhythms: []
                },
                dailyCulture: {
                    clothing: "",
                    foodHabits: "",
                    localCustoms: [],
                    communityRituals: []
                },
                landscapes: [],
                experiences: [],
                voices: {},
                searchKeywords: d.known_for || []
            };
        };

        // 2. Load and Transform Data
        const districtDbPath = join(__dirname, '../../src/DATABASE/district.json');
        let districtsList = [];

        if (existsSync(districtDbPath)) {
            console.log(`   📂 Reading from ${districtDbPath}`);
            const content = readFileSync(districtDbPath, 'utf-8');
            const legacyData = JSON.parse(content).filter(d => !d["//_COMMENT"]);
            districtsList = legacyData.map(transformDistrict);
        }

        // 3. Add Missing Districts (Schema Compliant)
        const missingDistricts = [
            {
                _id: "AS_KAR_ANG",
                stateCode: "AS",
                stateName: "Assam",
                districtName: "Karbi Anglong",
                region: "northeast",
                slug: "karbi_anglong",
                tagline: "Land of the Hills",
                heroImage: {
                    url: "https://images.unsplash.com/photo-1590053165219-c8872cd92348?auto=format&fit=crop&q=80&w=2000",
                    caption: "Karbi Anglong Hills"
                },
                context: {
                    landscapeType: "Hills & Forests",
                    surroundings: "The largest district in Assam, known for lush green hills and rare flora."
                },
                searchKeywords: ["Hills", "Trekking", "Karbi"]
            },
            {
                _id: "AS_MAJ",
                stateCode: "AS",
                stateName: "Assam",
                districtName: "Majuli",
                region: "northeast",
                slug: "majuli",
                tagline: "Culture amidst the River",
                heroImage: {
                    url: "https://images.unsplash.com/photo-1628062137937-23b938446187?auto=format&fit=crop&q=80&w=2000",
                    caption: "Majuli River Island"
                },
                context: {
                    landscapeType: "River Island",
                    surroundings: "A spiritual hub in the Brahmaputra river, famous for its Satras."
                },
                searchKeywords: ["River", "Culture", "Satras"]
            }
        ];

        // Merge and Insert
        districtsList = [...districtsList, ...missingDistricts];

        if (districtsList.length > 0) {
            await District.insertMany(districtsList);
            console.log(`   ✓ ${districtsList.length} districts inserted (Transformed & Merged)`);
        }

        console.log('📥 Inserting Tags...');
        if (tags.length > 0) {
            await Tag.insertMany(tags);
            console.log(`   ✓ ${tags.length} tags inserted`);
        }

        console.log('📥 Inserting Places...');
        if (places.length > 0) {
            await Place.insertMany(places);
            console.log(`   ✓ ${places.length} places inserted`);
        }

        console.log('📥 Inserting Homestays...');
        if (homestays.length > 0) {
            await Homestay.insertMany(homestays);
            console.log(`   ✓ ${homestays.length} homestays inserted`);
        }

        console.log('📥 Inserting Guides...');
        if (guides.length > 0) {
            await Guide.insertMany(guides);
            console.log(`   ✓ ${guides.length} guides inserted`);
        }

        console.log('📥 Inserting Festival Masters...');
        if (festivalMasters.length > 0) {
            await FestivalMaster.insertMany(festivalMasters);
            console.log(`   ✓ ${festivalMasters.length} festival masters inserted`);
        }

        console.log('📥 Inserting Festival Occurrences...');
        if (festivalOccurrences.length > 0) {
            await FestivalOccurrence.insertMany(festivalOccurrences);
            console.log(`   ✓ ${festivalOccurrences.length} festival occurrences inserted`);
        }

        console.log('\n✅ Database seeded successfully!');

        // Print summary
        console.log('\n📊 Summary:');
        console.log(`   Regions:             ${regions.length}`);
        console.log(`   States:              ${states.length}`);
        console.log(`   Districts:           ${districtsList.length}`);
        console.log(`   Tags:                ${tags.length}`);
        console.log(`   Places:              ${places.length}`);
        console.log(`   Homestays:           ${homestays.length}`);
        console.log(`   Guides:              ${guides.length}`);
        console.log(`   Festival Masters:    ${festivalMasters.length}`);
        console.log(`   Festival Occurrences: ${festivalOccurrences.length}`);
        console.log(`   ─────────────────────────────`);
        const total = regions.length + states.length + districtsList.length + tags.length +
            places.length + homestays.length + guides.length +
            festivalMasters.length + festivalOccurrences.length;
        console.log(`   Total records:       ${total}`);

    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
    finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
};

// Run seeding
seedDatabase();
