import { Router } from 'express';
import { District, Place, Guide, Homestay } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

/**
 * GET /api/districts
 * List all districts grouped by state
 */
router.get('/', async (req, res, next) => {
    try {
        const districts = await District.find().sort({ stateCode: 1, districtName: 1 });

        // Group by state
        const grouped = districts.reduce((acc, district) => {
            const state = district.stateName;
            if (!acc[state]) acc[state] = [];
            acc[state].push(district);
            return acc;
        }, {});

        res.json({
            success: true,
            count: districts.length,
            data: grouped
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * GET /api/districts/list
 * Simple list of all districts
 */
router.get('/list', async (req, res, next) => {
    try {
        const districts = await District.find().sort({ stateName: 1, districtName: 1 });

        res.json({
            success: true,
            count: districts.length,
            data: districts
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * GET /api/districts/by-state/:stateCode
 * Get districts by state code
 */
router.get('/by-state/:stateCode', async (req, res, next) => {
    try {
        const { stateCode } = req.params;
        const districts = await District.find({ stateCode: stateCode.toUpperCase() });

        if (districts.length === 0) {
            throw ApiError.notFound(`No districts found for state: ${stateCode}`);
        }

        res.json({
            success: true,
            count: districts.length,
            data: districts
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * GET /api/districts/by-slug/:slug
 * Get single district by slug with full content
 */
router.get('/by-slug/:slug', async (req, res, next) => {
    try {
        const { slug } = req.params;
        const district = await District.findOne({ slug: slug.toLowerCase() });

        if (!district) {
            throw ApiError.notFound(`District not found: ${slug}`);
        }

        // Get related content
        const [places, guides, homestays, nearbyDistricts] = await Promise.all([
            Place.find({ districtId: district._id }).limit(6),
            Guide.find({ districtId: district._id }).limit(4),
            Homestay.find({ districtId: district._id }).limit(4),
            District.find({
                stateCode: district.stateCode,
                _id: { $ne: district._id }
            })
                .select('districtName slug tagline heroImage')
                .limit(4)
        ]);

        res.json({
            success: true,
            data: {
                ...district.toObject(),
                places,
                guides,
                homestays,
                nearbyDistricts
            }
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * GET /api/districts/:id
 * Get single district by ID with stats
 */
router.get('/:id', async (req, res, next) => {
    try {
        const district = await District.findById(req.params.id);

        if (!district) {
            throw ApiError.notFound('District not found');
        }

        // Get counts
        const [placesCount, guidesCount] = await Promise.all([
            Place.countDocuments({ districtId: district._id }),
            Guide.countDocuments({ districtId: district._id })
        ]);

        res.json({
            success: true,
            data: {
                ...district.toObject(),
                stats: {
                    placesCount,
                    guidesCount
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
});

export default router;
