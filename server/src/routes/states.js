import { Router } from 'express';
import { State, District } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

/**
 * GET /api/states
 * List all states
 */
router.get('/', async (req, res, next) => {
    try {
        const states = await State.find()
            .select('name slug tagline images description_section')
            .lean();

        // Map to light version for list
        const responseData = states.map(s => ({
            code: s._id,
            name: s.name,
            slug: s.slug,
            tagline: s.tagline,
            heroImage: s.images?.hero?.[0],
            description: s.description_section?.content
        }));

        res.json({
            success: true,
            count: responseData.length,
            data: responseData
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * GET /api/states/:slug
 * Get single state by slug with all content
 */
router.get('/:slug', async (req, res, next) => {
    try {
        const { slug } = req.params;
        const state = await State.findOne({ slug });

        if (!state) {
            throw ApiError.notFound(`State not found: ${slug} `);
        }

        const stateObj = state.toObject();

        // Fetch districts for this state
        // District uses stateCode to reference State _id (e.g. 'MN')
        const districts = await District.find({ stateCode: state._id }).sort({ districtName: 1 }).lean();

        // Map districts to ensure 'name' property exists for frontend generic components
        const districtsMapped = districts.map(d => ({
            ...d,
            name: d.districtName
        }));

        res.json({
            success: true,
            data: {
                ...stateObj,
                code: state._id,
                districts: districtsMapped,
                stats: {
                    districtsCount: districts.length,
                    placesCount: 0,
                    homestaysCount: 0
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * GET /api/states/:slug/districts
 * Get all districts for a state
 */
router.get('/:slug/districts', async (req, res, next) => {
    try {
        const { slug } = req.params;
        const state = await State.findOne({ slug });

        if (!state) {
            throw ApiError.notFound(`State not found: ${slug} `);
        }

        const districts = await District.find({ stateCode: state._id }).sort({ districtName: 1 });

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

export default router;
