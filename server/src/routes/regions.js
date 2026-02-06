import { Router } from 'express';
import { Region, State } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

/**
 * GET /api/regions
 * List all regions
 */
router.get('/', async (req, res, next) => {
    try {
        const regions = await Region.find();

        res.json({
            success: true,
            count: regions.length,
            data: regions
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * GET /api/regions/:slug
 * Get single region by slug with all content
 */
router.get('/:slug', async (req, res, next) => {
    try {
        const { slug } = req.params;
        const region = await Region.findOne({ slug: slug.toLowerCase() });

        if (!region) {
            throw ApiError.notFound(`Region not found: ${slug}`);
        }

        // Get states in this region
        const states = await State.find({ regionId: region._id })
            .select('code name slug tagline heroImage heroImages districtCount')
            .sort({ name: 1 });

        res.json({
            success: true,
            data: {
                ...region.toObject(),
                states
            }
        });
    }
    catch (error) {
        next(error);
    }
});

export default router;
