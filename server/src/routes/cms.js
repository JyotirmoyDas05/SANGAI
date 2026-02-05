import express from 'express';
import { devAuth } from '../middleware/devAuth.js';
import FestivalMaster from '../models/FestivalMaster.js';
import FestivalOccurrence from '../models/FestivalOccurrence.js';
import State from '../models/State.js';
import District from '../models/District.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// protect all CMS routes
router.use(devAuth);

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Upload Image to Cloudinary
 * POST /api/cms/upload
 */
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'sangai/cms',
            resource_type: 'auto'
        });

        res.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Image upload failed' });
    }
});

/**
 * LIST all festivals (Combined Master + Latest Occurrence)
 * GET /api/cms/festivals
 */
router.get('/festivals', async (req, res) => {
    try {
        const masters = await FestivalMaster.find().sort({ updatedAt: -1 });

        // Enhance with occurrence info
        const enhancedFailed = await Promise.all(masters.map(async (master) => {
            const occurrence = await FestivalOccurrence.findOne({ festivalId: master._id })
                .sort({ startDate: -1 }); // Get latest

            return {
                ...master.toObject(),
                latestOccurrence: occurrence ? occurrence.toObject() : null
            };
        }));

        res.json({ success: true, data: enhancedFailed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET Single Festival
 * GET /api/cms/festivals/:id
 */
router.get('/festivals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const master = await FestivalMaster.findById(id);

        if (!master) {
            return res.status(404).json({ error: 'Festival not found' });
        }

        const occurrence = await FestivalOccurrence.findOne({ festivalId: id }).sort({ startDate: -1 });

        res.json({
            success: true,
            data: {
                ...master.toObject(),
                latestOccurrence: occurrence ? occurrence.toObject() : null
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE Festival
 * PUT /api/cms/festivals/:id
 */
router.put('/festivals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, tagline, description, category,
            stateId, districtId, venue,
            startDate, endDate,
            previewImage, heroImages, contentImages,
            bookingLink, ecoCertified,
            tags
        } = req.body;

        const masterData = {
            name,
            tagline,
            description,
            category,
            stateId,
            districtId,
            images: {
                preview: previewImage,
                hero: heroImages || [],
                content: contentImages || []
            },
            ecoCertified: !!ecoCertified,
            bookingLink,
            tags: tags || [],
            recurring: true
        };

        // Update Master
        const master = await FestivalMaster.findByIdAndUpdate(id, masterData, { new: true });

        if (!master) {
            return res.status(404).json({ error: 'Festival not found' });
        }

        // Find District _id from slug
        // districtId passed from frontend is slug (e.g. 'imphal_west')
        // We need to find the District document where slug matches
        let realDistrictId = districtId;
        const districtDoc = await District.findOne({ slug: districtId });
        if (districtDoc) {
            realDistrictId = districtDoc._id;
        } else {
            // Fallback: Check if it's already an ID (less likely but possible) or valid district not found
            console.warn(`District slug not found: ${districtId}, using as is.`);
        }

        // Update specific occurrence (simplified: generic update for now)
        // In a real app, we might want to find the specific occurrence ID or latest one.
        // For simplicity, update the latest one or all linked.
        const occurrence = await FestivalOccurrence.findOneAndUpdate(
            { festivalId: id },
            {
                districtId: realDistrictId, // Use real _id
                venue,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            },
            { sort: { startDate: -1 }, new: true }
        );

        res.json({ success: true, data: master });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * CREATE Festival
 * POST /api/cms/festivals
 * Creates both Master and initial Occurrence
 */
router.post('/festivals', async (req, res) => {
    try {
        const {
            name, tagline, description, category,
            stateId, districtId, venue,
            startDate, endDate,
            previewImage, heroImages, contentImages,
            bookingLink, ecoCertified,
            tags
        } = req.body;

        // 1. Create/Update Master
        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

        // Check if exists
        let master = await FestivalMaster.findById(slug);

        const masterData = {
            _id: slug,
            name,
            tagline,
            description,
            category,
            stateId,      // Save slug for CMS pre-filling
            districtId,   // Save slug for CMS pre-filling
            images: {
                preview: previewImage,
                hero: heroImages || [],
                content: contentImages || []
            },
            ecoCertified: !!ecoCertified,
            bookingLink,
            tags: tags || [],
            recurring: true
        };

        if (master) {
            // Update existing master
            master = await FestivalMaster.findByIdAndUpdate(slug, masterData, { new: true });
        } else {
            // Create new
            master = await FestivalMaster.create(masterData);
        }

        // Find District _id from slug
        let realDistrictId = districtId;
        const districtDoc = await District.findOne({ slug: districtId });
        if (districtDoc) {
            realDistrictId = districtDoc._id;
        } else {
            console.warn(`District slug not found: ${districtId}, using as is.`);
        }

        // 2. Create Occurrence
        const occurrenceData = {
            _id: uuidv4(),
            festivalId: slug,
            districtId: realDistrictId, // Use real _id
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            venue: venue
        };

        const occurrence = await FestivalOccurrence.create(occurrenceData);

        res.json({
            success: true,
            data: {
                master,
                occurrence
            }
        });

    } catch (error) {
        console.error('Create festival error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE Festival
 * DELETE /api/cms/festivals/:id
 */
router.delete('/festivals/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Delete master
        await FestivalMaster.findByIdAndDelete(id);

        // Delete all occurrences
        await FestivalOccurrence.deleteMany({ festivalId: id });

        res.json({ success: true, message: 'Festival deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
