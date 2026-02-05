import { Router } from 'express';
import { State, District, Place, Homestay, Guide, FestivalMaster, FestivalOccurrence } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

/**
 * Hierarchical Northeast Routes
 * 
 * Pattern: /northeast/:stateSlug?/:districtSlug?/:contentType?
 * 
 * Content inheritance:
 * - /northeast/festivals → All festivals in Northeast
 * - /northeast/:state/festivals → Festivals in one state
 * - /northeast/:state/:district/festivals → Festivals in one district
 */

// ============================================
// REGION LEVEL: /northeast
// ============================================

/**
 * GET /api/northeast
 * Get Northeast region overview with all states
 */
router.get('/', async (req, res, next) => {
    try {
        // All states in the database are Northeast states
        const states = await State.find().sort({ name: 1 });
        const districtCount = await District.countDocuments();

        res.json({
            success: true,
            data: {
                name: 'Northeast India',
                slug: 'northeast',
                stateCount: states.length,
                districtCount,
                states: states.map(s => ({
                    _id: s._id,
                    name: s.name,
                    slug: s.slug,
                    tagline: s.tagline
                }))
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/festivals
 * Get ALL festivals across Northeast
 */
router.get('/festivals', async (req, res, next) => {
    try {
        const { limit = 50, upcoming } = req.query;

        let filter = {};
        if (upcoming === 'true') {
            filter.startDate = { $gte: new Date() };
        }

        const occurrences = await FestivalOccurrence.find(filter)
            .populate('festivalId')
            .populate('districtId', 'stateName districtName slug stateCode')
            .sort({ startDate: 1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: occurrences.length,
            scope: 'northeast',
            data: occurrences
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/places
 * Get ALL places across Northeast
 */
router.get('/places', async (req, res, next) => {
    try {
        const { limit = 50, type } = req.query;

        let filter = {};
        if (type) filter.type = type;

        const places = await Place.find(filter)
            .populate('districtId', 'stateName districtName slug stateCode')
            .sort({ name: 1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: places.length,
            scope: 'northeast',
            data: places
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/homestays
 * Get ALL homestays across Northeast
 */
router.get('/homestays', async (req, res, next) => {
    try {
        const { limit = 50 } = req.query;

        const homestays = await Homestay.find()
            .populate('districtId', 'stateName districtName slug stateCode')
            .sort({ rating: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: homestays.length,
            scope: 'northeast',
            data: homestays
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/guides
 * Get ALL guides across Northeast
 */
router.get('/guides', async (req, res, next) => {
    try {
        const { limit = 50 } = req.query;

        const guides = await Guide.find()
            .populate('districtId', 'stateName districtName slug stateCode')
            .sort({ rating: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: guides.length,
            scope: 'northeast',
            data: guides
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// STATE LEVEL: /northeast/:stateSlug
// ============================================

/**
 * GET /api/northeast/:stateSlug
 * Get state overview with all its districts
 */
router.get('/:stateSlug', async (req, res, next) => {
    try {
        const { stateSlug } = req.params;

        // Find state by slug
        const state = await State.findOne({ slug: stateSlug });
        if (!state) {
            throw ApiError.notFound(`State not found: ${stateSlug}`);
        }

        // Get all districts in this state
        const districts = await District.find({ stateCode: state.code })
            .sort({ districtName: 1 });

        res.json({
            success: true,
            data: {
                ...state.toObject(),
                districtCount: districts.length,
                districts: districts.map(d => ({
                    _id: d._id,
                    name: d.districtName,
                    slug: d.slug,
                    tagline: d.tagline
                }))
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/:stateSlug/festivals
 * Get ALL festivals in a state (aggregated from all districts)
 */
router.get('/:stateSlug/festivals', async (req, res, next) => {
    try {
        const { stateSlug } = req.params;
        const { limit = 50, upcoming } = req.query;

        // Get state
        const state = await State.findOne({ slug: stateSlug });
        if (!state) {
            throw ApiError.notFound(`State not found: ${stateSlug}`);
        }

        // Get all districts in this state
        const districtIds = await District.find({ stateCode: state.code }).distinct('_id');

        // Get festivals from these districts
        let filter = { districtId: { $in: districtIds } };
        if (upcoming === 'true') {
            filter.startDate = { $gte: new Date() };
        }

        const occurrences = await FestivalOccurrence.find(filter)
            .populate('festivalId')
            .populate('districtId', 'stateName districtName slug')
            .sort({ startDate: 1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: occurrences.length,
            scope: 'state',
            state: state.name,
            data: occurrences
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/:stateSlug/places
 * Get ALL places in a state
 */
router.get('/:stateSlug/places', async (req, res, next) => {
    try {
        const { stateSlug } = req.params;
        const { limit = 50, type } = req.query;

        const state = await State.findOne({ slug: stateSlug });
        if (!state) {
            throw ApiError.notFound(`State not found: ${stateSlug}`);
        }

        const districtIds = await District.find({ stateCode: state.code }).distinct('_id');

        let filter = { districtId: { $in: districtIds } };
        if (type) filter.type = type;

        const places = await Place.find(filter)
            .populate('districtId', 'stateName districtName slug')
            .sort({ name: 1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: places.length,
            scope: 'state',
            state: state.name,
            data: places
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/:stateSlug/homestays
 * Get ALL homestays in a state
 */
router.get('/:stateSlug/homestays', async (req, res, next) => {
    try {
        const { stateSlug } = req.params;
        const { limit = 50 } = req.query;

        const state = await State.findOne({ slug: stateSlug });
        if (!state) {
            throw ApiError.notFound(`State not found: ${stateSlug}`);
        }

        const districtIds = await District.find({ stateCode: state.code }).distinct('_id');

        const homestays = await Homestay.find({ districtId: { $in: districtIds } })
            .populate('districtId', 'stateName districtName slug')
            .sort({ rating: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: homestays.length,
            scope: 'state',
            state: state.name,
            data: homestays
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/:stateSlug/guides
 * Get ALL guides in a state
 */
router.get('/:stateSlug/guides', async (req, res, next) => {
    try {
        const { stateSlug } = req.params;
        const { limit = 50 } = req.query;

        const state = await State.findOne({ slug: stateSlug });
        if (!state) {
            throw ApiError.notFound(`State not found: ${stateSlug}`);
        }

        const districtIds = await District.find({ stateCode: state.code }).distinct('_id');

        const guides = await Guide.find({ districtId: { $in: districtIds } })
            .populate('districtId', 'stateName districtName slug')
            .sort({ rating: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: guides.length,
            scope: 'state',
            state: state.name,
            data: guides
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// DISTRICT LEVEL: /northeast/:stateSlug/:districtSlug
// ============================================

/**
 * GET /api/northeast/:stateSlug/:districtSlug
 * Get district details
 */
router.get('/:stateSlug/:districtSlug', async (req, res, next) => {
    try {
        const { stateSlug, districtSlug } = req.params;

        // Validate state exists
        const state = await State.findOne({ slug: stateSlug });
        if (!state) {
            throw ApiError.notFound(`State not found: ${stateSlug}`);
        }

        // Find district by slug and state
        const district = await District.findOne({
            slug: districtSlug,
            stateCode: state.code
        });

        if (!district) {
            throw ApiError.notFound(`District not found: ${districtSlug} in ${state.name}`);
        }

        res.json({
            success: true,
            data: district
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/:stateSlug/:districtSlug/festivals
 * Get festivals in a specific district
 */
router.get('/:stateSlug/:districtSlug/festivals', async (req, res, next) => {
    try {
        const { stateSlug, districtSlug } = req.params;
        const { limit = 50, upcoming } = req.query;

        const state = await State.findOne({ slug: stateSlug });
        if (!state) {
            throw ApiError.notFound(`State not found: ${stateSlug}`);
        }

        const district = await District.findOne({
            slug: districtSlug,
            stateCode: state.code
        });
        if (!district) {
            throw ApiError.notFound(`District not found: ${districtSlug}`);
        }

        let filter = { districtId: district._id };
        if (upcoming === 'true') {
            filter.startDate = { $gte: new Date() };
        }

        const occurrences = await FestivalOccurrence.find(filter)
            .populate('festivalId')
            .populate('districtId', 'stateName districtName slug')
            .sort({ startDate: 1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: occurrences.length,
            scope: 'district',
            state: state.name,
            district: district.districtName,
            data: occurrences
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/:stateSlug/:districtSlug/places
 * Get places in a specific district
 */
router.get('/:stateSlug/:districtSlug/places', async (req, res, next) => {
    try {
        const { stateSlug, districtSlug } = req.params;
        const { limit = 50, type } = req.query;

        const state = await State.findOne({ slug: stateSlug });
        if (!state) {
            throw ApiError.notFound(`State not found: ${stateSlug}`);
        }

        const district = await District.findOne({
            slug: districtSlug,
            stateCode: state.code
        });
        if (!district) {
            throw ApiError.notFound(`District not found: ${districtSlug}`);
        }

        let filter = { districtId: district._id };
        if (type) filter.type = type;

        const places = await Place.find(filter)
            .populate('districtId', 'stateName districtName slug')
            .sort({ name: 1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: places.length,
            scope: 'district',
            state: state.name,
            district: district.districtName,
            data: places
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/:stateSlug/:districtSlug/homestays
 * Get homestays in a specific district
 */
router.get('/:stateSlug/:districtSlug/homestays', async (req, res, next) => {
    try {
        const { stateSlug, districtSlug } = req.params;
        const { limit = 50 } = req.query;

        const state = await State.findOne({ slug: stateSlug });
        if (!state) {
            throw ApiError.notFound(`State not found: ${stateSlug}`);
        }

        const district = await District.findOne({
            slug: districtSlug,
            stateCode: state.code
        });
        if (!district) {
            throw ApiError.notFound(`District not found: ${districtSlug}`);
        }

        const homestays = await Homestay.find({ districtId: district._id })
            .populate('districtId', 'stateName districtName slug')
            .sort({ rating: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: homestays.length,
            scope: 'district',
            state: state.name,
            district: district.districtName,
            data: homestays
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/northeast/:stateSlug/:districtSlug/guides
 * Get guides in a specific district
 */
router.get('/:stateSlug/:districtSlug/guides', async (req, res, next) => {
    try {
        const { stateSlug, districtSlug } = req.params;
        const { limit = 50 } = req.query;

        const state = await State.findOne({ slug: stateSlug });
        if (!state) {
            throw ApiError.notFound(`State not found: ${stateSlug}`);
        }

        const district = await District.findOne({
            slug: districtSlug,
            stateCode: state.code
        });
        if (!district) {
            throw ApiError.notFound(`District not found: ${districtSlug}`);
        }

        const guides = await Guide.find({ districtId: district._id })
            .populate('districtId', 'stateName districtName slug')
            .sort({ rating: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: guides.length,
            scope: 'district',
            state: state.name,
            district: district.districtName,
            data: guides
        });
    } catch (error) {
        next(error);
    }
});

export default router;
