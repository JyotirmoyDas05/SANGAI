import dotenv from 'dotenv';
dotenv.config({ path: 'server/.env' });
import mongoose from 'mongoose';
import { FestivalMaster, FestivalOccurrence } from '../src/models/index.js';
import connectDB from '../src/config/database.js';

const MOCK_FESTIVAL_NAMES = [
    'Yaoshang Festival',
    'Ziro Music Festival',
    'Wangala Festival',
    'Losar Festival',
    'Kharchi Puja',
    'Bihu Festival',
    'Hornbill Festival',
    'Chapchar Kut',
    'Shillong Cherry Blossom Festival' // Adding this just in case, though user saw it as placeholder 
];

const cleanup = async () => {
    try {
        await connectDB();
        console.log('Connected to Database...');

        console.log(`Searching for festivals to remove provided in mock list: ${MOCK_FESTIVAL_NAMES.join(', ')}`);

        // Find Masters to delete
        const masters = await FestivalMaster.find({ name: { $in: MOCK_FESTIVAL_NAMES } });
        const masterIds = masters.map(m => m._id);

        console.log(`Found ${masters.length} mock festival masters.`);

        if (masterIds.length > 0) {
            // Delete Occurrences first
            const deletedOccurrences = await FestivalOccurrence.deleteMany({ festivalId: { $in: masterIds } });
            console.log(`Deleted ${deletedOccurrences.deletedCount} occurrences.`);

            // Delete Masters
            const deletedMasters = await FestivalMaster.deleteMany({ _id: { $in: masterIds } });
            console.log(`Deleted ${deletedMasters.deletedCount} masters.`);
        } else {
            console.log('No mock festivals found to delete.');
        }

        console.log('Cleanup complete.');
        process.exit(0);

    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
};

cleanup();
