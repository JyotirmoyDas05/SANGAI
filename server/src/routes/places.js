import { Router } from 'express';
import { Place } from '../models/index.js';
import upload from '../middleware/upload.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const {
            district,
            type,
            tags,
            isHiddenGem,
            page = 1,
            limit = 8
        } = req.query;

        const query = {};
        if (district) query.districtId = district;
        if (type) query.type = type;
        if (isHiddenGem !== undefined) query.isHiddenGem = isHiddenGem === 'true';
        if (tags) {
            const tagList = tags.split(',');
            query.$or = [
                { taxonomy_tags: { $in: tagList } },
                { tags: { $in: tagList } }
            ];
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [data, total] = await Promise.all([
            Place.find(query)
                .sort({ name: 1 })
                .skip(skip)
                .limit(limitNum)
                .populate({
                    path: 'districtId',
                    select: 'districtName stateName' // Fetch district fields directly
                }),
            Place.countDocuments(query)
        ]);

        const populatedData = data.map(p => {
            const pObj = p.toObject();
            // Map to frontend expectation
            const dist = pObj.districtId;
            return {
                ...pObj,
                districtId: dist ? {
                    _id: dist._id,
                    districtName: dist.districtName || dist.name, // Handle inconsistency if any
                    stateName: dist.stateName || ''
                } : pObj.districtId
            };
        });

        res.json({
            success: true,
            count: populatedData.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: populatedData
        });
    } catch (error) {
        next(error);
    }
});

router.get('/types', async (req, res, next) => {
    try {
        const types = await Place.distinct('type');
        res.json({ success: true, data: types });
    } catch (error) {
        next(error);
    }
});

router.get('/nearby', async (req, res, next) => {
    try {
        const { lat, lng, radius = 50, limit = 10 } = req.query;
        if (!lat || !lng) throw ApiError.badRequest('Latitude and longitude are required');

        // Note: MongoDB needs 2dsphere index for $near. If not present, this might fail unless we use legacy calc or ensure index.
        // For revert safety, assuming geo index exists. If not, we might need manual calc.
        // Let's stick to the manual calc for safety if index is missing, but Mongoose usually implies DB structure.
        // Actually, previous JsonDb implementation used Haversine. 
        // Let's rely on standard MongoDB $nearSphere if possible, or fallback to manual filter if we want to be safe without managing indexes right now.
        // Given constraint "exactly as before", I'll assume standard find.

        // Simulating the safety approach: Fetch all and filter (inefficient but matches "revert to logic that works without assumed indexes")
        // OR better, assume standard Mongoose geo queries.

        const places = await Place.find().lean(); // Fetch all to manually filter closer to JsonDb logic used earlier?
        // No, Mongoose should use database power.
        // Assuming no changes to DB indices were made, Mongoose code should work.

        // Re-implementing manual filter to avoid "no geo index" errors during this "revert" phase
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const radiusKm = parseFloat(radius);

        const withDistance = places.map(place => {
            const pLat = place.location?.lat;
            const pLng = place.location?.lng;
            if (!pLat || !pLng) return null;

            // Simple Haversine
            const dLat = (pLat - latitude) * Math.PI / 180;
            const dLng = (pLng - longitude) * Math.PI / 180;
            const a = Math.sin(dLat / 2) ** 2 + Math.cos(latitude * Math.PI / 180) * Math.cos(pLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = 6371 * c;

            return { ...place, distance: Math.round(d * 10) / 10 };
        })
            .filter(p => p && p.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, parseInt(limit));

        res.json({ success: true, count: withDistance.length, data: withDistance });

    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const place = await Place.findById(req.params.id)
            .populate({
                path: 'districtId',
                populate: { path: 'stateId', select: 'name' }
            });

        if (!place) throw ApiError.notFound('Place not found');

        const homestays = await import('../models/index.js').then(m => m.Homestay.find({ placeId: place._id }));

        res.json({
            success: true,
            data: {
                ...place.toObject(),
                homestays
            }
        });
    } catch (error) {
        next(error);
    }
});

router.post('/upload', upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) throw ApiError.badRequest('No image file provided');
        res.json({
            success: true,
            message: 'Uploaded successfully',
            imageUrl: req.file.path,
            data: { url: req.file.path }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
