import { Router } from 'express';
import { Place, Homestay } from '../models/index.js';
import upload from '../middleware/upload.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

/**
 * GET /api/places
 * List places with filters and pagination
 */
router.get('/', async (req, res, next) => {
    try {
        const {
            district,
            type,
            tags,
            isHiddenGem,
            page = 1,
            limit = 8 // Default to 8 as requested
        } = req.query;

        // Build filter
        const filter = {};
        if (district) filter.districtId = district;
        if (type) filter.type = type;
        if (tags) filter.tagIds = { $in: tags.split(',') };
        if (isHiddenGem !== undefined) filter.isHiddenGem = isHiddenGem === 'true';

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [places, total] = await Promise.all([
            Place.find(filter)
                .populate('districtId', 'stateName districtName slug stateCode')
                .populate('tagIds', 'name')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ name: 1 }),
            Place.countDocuments(filter)
        ]);

        res.json({
            success: true,
            count: places.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: places
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * GET /api/places/types
 * Get all available place types
 */
router.get('/types', async (req, res, next) => {
    try {
        const types = await Place.distinct('type');

        res.json({
            success: true,
            data: types
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * GET /api/places/nearby
 * Get nearby places using simple distance calculation
 */
router.get('/nearby', async (req, res, next) => {
    try {
        const { lat, lng, radius = 50, limit = 10 } = req.query;

        if (!lat || !lng) {
            throw ApiError.badRequest('Latitude and longitude are required');
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const radiusKm = parseFloat(radius);

        // Simple bounding box calculation
        const latDelta = radiusKm / 111; // ~111km per degree of latitude
        const lngDelta = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

        const places = await Place.find({
            'location.lat': { $gte: latitude - latDelta, $lte: latitude + latDelta },
            'location.lng': { $gte: longitude - lngDelta, $lte: longitude + lngDelta }
        })
            .populate('districtId', 'stateName districtName')
            .limit(parseInt(limit));

        // Calculate actual distances and sort
        const withDistance = places.map(place => {
            const dLat = (place.location.lat - latitude) * Math.PI / 180;
            const dLng = (place.location.lng - longitude) * Math.PI / 180;
            const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(latitude * Math.PI / 180) * Math.cos(place.location.lat * Math.PI / 180) *
                Math.sin(dLng / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = 6371 * c; // Earth radius in km

            return {
                ...place.toObject(),
                distance: Math.round(distance * 10) / 10
            };
        }).filter(p => p.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance);

        res.json({
            success: true,
            count: withDistance.length,
            data: withDistance
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * GET /api/places/:id
 * Get single place with homestays
 */
router.get('/:id', async (req, res, next) => {
    try {
        const place = await Place.findById(req.params.id)
            .populate('districtId')
            .populate('tagIds');

        if (!place) {
            throw ApiError.notFound('Place not found');
        }

        // Get associated homestays
        const homestays = await Homestay.find({ placeId: place._id });

        res.json({
            success: true,
            data: {
                ...place.toObject(),
                homestays
            }
        });
    }
    catch (error) {
        next(error);
    }
});

/**
 * POST /api/places/upload
 * Upload a new image and return the Cloudinary URL.
 */
router.post('/upload', upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            throw ApiError.badRequest('No image file provided');
        }

        const imageUrl = req.file.path;

        res.json({
            success: true,
            message: 'Uploaded successfully',
            imageUrl: imageUrl,
            data: {
                url: imageUrl,
                format: req.file.format, // Cloudinary specific
                width: req.file.width,
                height: req.file.height
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
