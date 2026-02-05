/**
 * Database Seeding Script
 * Run with: npm run seed
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
const JSON_DIR = join(__dirname, '../../src/json_backend');

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
        console.log('🌱 Starting database seed...\n');

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
        const regions = loadJSON('_legacy/regions.json');
        const states = loadJSON('_legacy/states.json');
        const districts = loadJSON('data/districts.json');
        const tags = loadJSON('_legacy/tags.json');
        const places = loadJSON('data/places_normalized.json');
        const homestays = loadJSON('_legacy/homestays_normalized.json');
        const guides = loadJSON('_legacy/guides_normalized.json');
        const festivalMasters = loadJSON('_legacy/festival_master.json');
        const festivalOccurrences = loadJSON('_legacy/festival_occurrences.json');

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

        console.log('📥 Inserting Districts...');
        if (districts.length > 0) {
            await District.insertMany(districts);
            console.log(`   ✓ ${districts.length} districts inserted`);
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
        console.log(`   Districts:           ${districts.length}`);
        console.log(`   Tags:                ${tags.length}`);
        console.log(`   Places:              ${places.length}`);
        console.log(`   Homestays:           ${homestays.length}`);
        console.log(`   Guides:              ${guides.length}`);
        console.log(`   Festival Masters:    ${festivalMasters.length}`);
        console.log(`   Festival Occurrences: ${festivalOccurrences.length}`);
        console.log(`   ─────────────────────────────`);
        const total = regions.length + states.length + districts.length + tags.length +
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
