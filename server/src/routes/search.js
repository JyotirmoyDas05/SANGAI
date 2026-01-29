import { Router } from 'express';
import { Region, State, District, Place, FestivalMaster, Guide, Homestay } from '../models/index.js';

const router = Router();

/**
 * GET /api/search
 * Full-text search across all entities
 */
router.get('/', async (req, res, next) => {
    try {
        const { q, type, limit = 20 } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json({
                success: true,
                count: 0,
                data: { regions: [], states: [], districts: [], places: [], festivals: [], guides: [], homestays: [] }
            });
        }

        const searchQuery = q.trim();
        const limitNum = parseInt(limit);
        const regex = new RegExp(searchQuery, 'i');

        // Build result based on type filter
        const results = {};

        // Search regions
        if (!type || type === 'regions' || type === 'all') {
            results.regions = await Region.find({
                $or: [
                    { name: regex },
                    { slug: regex },
                    { searchKeywords: regex }
                ]
            })
                .select('_id name slug tagline')
                .limit(limitNum);
        }

        // Search states
        if (!type || type === 'states' || type === 'all') {
            results.states = await State.find({
                $or: [
                    { name: regex },
                    { slug: regex },
                    { searchKeywords: regex }
                ]
            })
                .select('_id name slug tagline code heroImage')
                .limit(limitNum);
        }

        // Search districts
        if (!type || type === 'districts' || type === 'all') {
            results.districts = await District.find({
                $or: [
                    { districtName: regex },
                    { slug: regex },
                    { searchKeywords: regex }
                ]
            })
                .select('_id districtName slug tagline stateCode stateName')
                .limit(limitNum);
        }

        // Search places
        if (!type || type === 'places' || type === 'all') {
            results.places = await Place.find({
                $or: [
                    { name: regex },
                    { shortDescription: regex },
                    { type: regex }
                ]
            })
                .populate('districtId', 'stateName districtName')
                .limit(limitNum);
        }

        // Search festivals
        if (!type || type === 'festivals' || type === 'all') {
            results.festivals = await FestivalMaster.find({
                $or: [
                    { name: regex },
                    { description: regex }
                ]
            }).limit(limitNum);
        }

        // Search guides
        if (!type || type === 'guides' || type === 'all') {
            results.guides = await Guide.find({
                $or: [
                    { name: regex },
                    { specialties: regex }
                ]
            })
                .populate('districtId', 'stateName districtName')
                .limit(limitNum);
        }

        // Search homestays
        if (!type || type === 'homestays' || type === 'all') {
            results.homestays = await Homestay.find({
                $or: [
                    { title: regex },
                    { hostName: regex }
                ]
            })
                .populate('placeId', 'name')
                .limit(limitNum);
        }

        const totalCount = Object.values(results).reduce((sum, arr) => sum + (arr?.length || 0), 0);

        res.json({
            success: true,
            query: searchQuery,
            count: totalCount,
            data: results
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * GET /api/search/suggestions
 * Quick suggestions for autocomplete
 */
router.get('/suggestions', async (req, res, next) => {
    try {
        const { q, limit = 8 } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json({
                success: true,
                data: []
            });
        }

        const searchQuery = q.trim();
        const limitNum = Math.min(parseInt(limit), 20);
        const regex = new RegExp('^' + searchQuery, 'i'); // Starts with

        // Get suggestions from multiple sources
        const [states, districts, places] = await Promise.all([
            State.find({
                $or: [{ name: regex }, { searchKeywords: regex }]
            })
                .select('name slug')
                .limit(3),
            District.find({
                $or: [{ districtName: regex }, { searchKeywords: regex }]
            })
                .select('districtName slug stateName')
                .limit(3),
            Place.find({ name: regex })
                .select('name districtId')
                .populate('districtId', 'districtName stateName')
                .limit(4)
        ]);

        // Format suggestions
        const suggestions = [
            ...states.map(s => ({ type: 'state', text: s.name, slug: s.slug })),
            ...districts.map(d => ({ type: 'district', text: d.districtName, slug: d.slug, parent: d.stateName })),
            ...places.map(p => ({ type: 'place', text: p.name, parent: p.districtId?.districtName }))
        ].slice(0, limitNum);

        res.json({
            success: true,
            data: suggestions
        });
    }
    catch (error) {
        next(error);
    }
});

export default router;
