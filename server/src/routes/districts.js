import { Router } from 'express';
import { District, State } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

// GET /api/districts - List all districts grouped by state
router.get('/', async (req, res, next) => {
    try {
        // District already has stateName, no need to populate
        const districts = await District.find().lean();

        // Group by stateName directly
        const grouped = districts.reduce((acc, district) => {
            const state = district.stateName || 'Unknown';
            if (!acc[state]) acc[state] = [];
            acc[state].push(district);
            return acc;
        }, {});

        res.json({
            success: true,
            count: districts.length,
            data: grouped
        });
    } catch (error) {
        next(error);
    }
});

router.get('/list', async (req, res, next) => {
    try {
        const districts = await District.find().sort({ name: 1 });
        res.json({ success: true, count: districts.length, data: districts });
    } catch (error) {
        next(error);
    }
});

router.get('/by-state/:stateCode', async (req, res, next) => {
    try {
        const { stateCode } = req.params;
        // District schema uses stateCode directly
        const districts = await District.find({
            $or: [
                { stateCode: stateCode.toUpperCase() },
                { stateCode: stateCode }
            ]
        });
        res.json({ success: true, count: districts.length, data: districts });
    } catch (error) {
        next(error);
    }
});

router.get('/by-slug/:slug', async (req, res, next) => {
    try {
        // No populate needed as stateName is in schema
        const district = await District.findOne({ slug: req.params.slug });

        if (!district) throw ApiError.notFound('District not found');

        // Related content (Places)
        const places = await import('../models/index.js').then(m => m.Place.find({ districtId: district._id }).limit(6));

        // Nearby districts (same state) - Filter by stateCode
        const nearbyDistricts = await District.find({
            stateCode: district.stateCode,
            _id: { $ne: district._id }
        }).limit(4);

        res.json({
            success: true,
            data: {
                ...district.toObject(),
                places,
                homestays: [],
                nearbyDistricts
            }
        });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const district = await District.findById(req.params.id);
        if (!district) throw ApiError.notFound('District not found');

        const placesCount = await import('../models/index.js').then(m => m.Place.countDocuments({ districtId: district._id }));

        res.json({
            success: true,
            data: {
                ...district.toObject(),
                stats: { placesCount, guidesCount: 0 }
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
