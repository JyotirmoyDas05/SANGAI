import { Router } from 'express';
import { State, District, Place, Guide, FestivalMaster } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

/**
 * GET /api/states
 * List all states
 */
router.get('/', async (req, res, next) => {
    try {
        const states = await State.find()
            .select('code name slug tagline heroImage districtCount regionId')
            .sort({ name: 1 });

        res.json({
            success: true,
            count: states.length,
            data: states
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
        const state = await State.findOne({ slug: slug.toLowerCase() });

        if (!state) {
            throw ApiError.notFound(`State not found: ${slug}`);
        }

        // Get districts in this state
        const districts = await District.find({ stateCode: state.code })
            .select('_id districtName slug tagline heroImage')
            .sort({ districtName: 1 });

        // Get stats for the state
        const [placesCount, guidesCount, festivalsCount] = await Promise.all([
            Place.countDocuments({ districtId: { $in: districts.map(d => d._id) } }),
            Guide.countDocuments({ districtId: { $in: districts.map(d => d._id) } }),
            FestivalMaster.countDocuments({ stateCode: state.code })
        ]);

        res.json({
            success: true,
            data: {
                ...state.toObject(),
                districts,
                stats: {
                    districtsCount: districts.length,
                    placesCount,
                    guidesCount,
                    festivalsCount
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
        const state = await State.findOne({ slug: slug.toLowerCase() });

        if (!state) {
            throw ApiError.notFound(`State not found: ${slug}`);
        }

        const districts = await District.find({ stateCode: state.code })
            .sort({ districtName: 1 });

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
