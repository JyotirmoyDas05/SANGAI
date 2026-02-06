import express from 'express';
import { devAuth } from '../middleware/devAuth.js';
import { FestivalMaster, FestivalOccurrence, District, Place, Region, CulturalItem } from '../models/index.js';
import State from '../models/State.js';

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

/**
 * ==========================================
 * DESTINATIONS (PLACES) MANAGEMENT
 * ==========================================
 */

/**
 * LIST all Destinations
 * GET /api/cms/destinations
 */
router.get('/destinations', async (req, res) => {
    try {
        const places = await Place.find({}).sort({ updatedAt: -1 }).populate('districtId', 'name slug');
        res.json({ success: true, data: places });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * CREATE Destination
 * POST /api/cms/destinations
 */
router.post('/destinations', async (req, res) => {
    try {
        const {
            name, type, districtId, shortDescription,
            overview, culturalSignificance, localBelief,
            lat, lng,
            images, // Expecting array of objects { url, caption } or strings
            bestTimeToVisit, isHiddenGem, tags,
            // New Fields
            logistics, experience, contact
        } = req.body;

        // Generate ID/Slug
        const _id = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

        // Resolve District ID
        let realDistrictId = districtId;
        const districtDoc = await District.findOne({ slug: districtId });
        if (districtDoc) {
            realDistrictId = districtDoc._id;
        } else {
            // If not found, use a fallback valid ObjectId or fail?
            // Ideally fail, but for now log warning.
            // Mongoose might strictly require ObjectId if schema defines ref.
            // Place schema: districtId: { type: String, ref: 'District' } (String ID)
            // So relying on slug might fail if current districts use ObjectId strings. 
            // But existing distritcs likely use Slugs as IDs? No, generate_districts used specific IDs.
        }

        // Process images: Ensure they match schema [{url, caption}]
        // Form might send array of strings (urls)
        const processedImages = (images || []).map(img => {
            if (typeof img === 'string') return { url: img, caption: '' };
            return img;
        });

        const placeData = {
            _id,
            name,
            type,
            districtId: realDistrictId,
            shortDescription,
            story: {
                overview,
                culturalSignificance,
                localBelief
            },
            location: {
                lat: parseFloat(lat || 0),
                lng: parseFloat(lng || 0)
            },
            images: processedImages,
            bestTimeToVisit,
            isHiddenGem: !!isHiddenGem,
            logistics: logistics || {},
            experience: experience || {},
            contact: contact || {}
            // tagIds handling skipped for brevity
        };

        const place = await Place.create(placeData);
        res.json({ success: true, data: place });

    } catch (error) {
        console.error('Create Place Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET Single Destination
 * GET /api/cms/destinations/:id
 */
router.get('/destinations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const place = await Place.findById(id).populate('districtId');

        if (!place) return res.status(404).json({ error: 'Place not found' });

        const responseData = place.toObject();
        // Inject slug for CMS Select pre-filling if needed
        if (responseData.districtId && responseData.districtId.slug) {
            responseData.districtSlug = responseData.districtId.slug;
        }

        res.json({ success: true, data: responseData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE Destination
 * PUT /api/cms/destinations/:id
 */
router.put('/destinations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, type, districtId, shortDescription,
            overview, culturalSignificance, localBelief, quote,
            lat, lng,
            images,
            bestTimeToVisit, isHiddenGem, tags,
            // New Fields
            logistics, experience, guideInfo, contact
        } = req.body;

        // Resolve District if changed (slug passed)
        let realDistrictId = undefined;
        if (districtId) {
            const districtDoc = await District.findOne({ slug: districtId });
            if (districtDoc) realDistrictId = districtDoc._id;
        }

        const processedImages = (images || []).map(img => {
            if (typeof img === 'string') return { url: img, caption: '' };
            return img;
        });

        const updateData = {
            name,
            type,
            shortDescription,
            story: {
                overview,
                culturalSignificance,
                localBelief,
                quote
            },
            location: {
                lat: parseFloat(lat || 0),
                lng: parseFloat(lng || 0)
            },
            images: processedImages,
            bestTimeToVisit,
            isHiddenGem: !!isHiddenGem,
            logistics: logistics || {},
            experience: experience || {},
            guideInfo,
            contact: contact || {}
        };

        // Only update districtId if a valid one was resolved
        if (realDistrictId !== undefined) {
            updateData.districtId = realDistrictId;
        }


        const place = await Place.findByIdAndUpdate(id, updateData, { new: true });
        if (!place) return res.status(404).json({ error: 'Place not found' });

        res.json({ success: true, data: place });

    } catch (error) {
        console.error('Update Place Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * ==========================================
 * HERO IMAGE MANAGEMENT
 * ==========================================
 */

/**
 * UPDATE Region Hero Images
 * PUT /api/cms/regions/:slug/hero-images
 */
router.put('/regions/:slug/hero-images', async (req, res) => {
    try {
        const { slug } = req.params;
        const { heroImages } = req.body; // Expecting [{ url, caption }]

        const region = await Region.findOneAndUpdate(
            { slug: slug },
            { $set: { heroImages: heroImages } },
            { new: true }
        );

        if (!region) return res.status(404).json({ error: 'Region not found' });
        res.json({ success: true, data: region });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE State Hero Images
 * PUT /api/cms/states/:slug/hero-images
 */
router.put('/states/:slug/hero-images', async (req, res) => {
    try {
        const { slug } = req.params;
        const { heroImages } = req.body; // Expecting [{ url, caption }]

        const state = await State.findOneAndUpdate(
            { slug: slug },
            { $set: { heroImages: heroImages } },
            { new: true }
        );

        if (!state) return res.status(404).json({ error: 'State not found' });
        res.json({ success: true, data: state });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE District Hero Images
 * PUT /api/cms/districts/:slug/hero-images
 */
router.put('/districts/:slug/hero-images', async (req, res) => {
    try {
        const { slug } = req.params;
        const { heroImages } = req.body; // Expecting [{ url, caption }]

        const district = await District.findOneAndUpdate(
            { slug: slug },
            { $set: { heroImages: heroImages } },
            { new: true }
        );

        if (!district) return res.status(404).json({ error: 'District not found' });
        res.json({ success: true, data: district });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE State Shared Story
 * PUT /api/cms/states/:slug/shared-story
 */
router.put('/states/:slug/shared-story', async (req, res) => {
    try {
        const { slug } = req.params;
        const { sharedStory } = req.body; // Expecting { title, paragraphs, tone }

        const state = await State.findOneAndUpdate(
            { slug: slug },
            { $set: { sharedStory: sharedStory } },
            { new: true }
        );

        if (!state) return res.status(404).json({ error: 'State not found' });
        res.json({ success: true, data: state });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * UPDATE State Cultural Threads
 * PUT /api/cms/states/:slug/cultural-threads
 */
router.put('/states/:slug/cultural-threads', async (req, res) => {
    try {
        const { slug } = req.params;
        const { culturalThreads } = req.body; // Expecting [{ title, insight, imageUrl }]

        const state = await State.findOneAndUpdate(
            { slug: slug },
            { $set: { culturalThreads: culturalThreads } },
            { new: true }
        );

        if (!state) return res.status(404).json({ error: 'State not found' });
        res.json({ success: true, data: state });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// CULTURAL ITEMS CMS CRUD
// ============================================

/**
 * LIST all cultural items
 * GET /api/cms/cultural-items
 */
router.get('/cultural-items', async (req, res) => {
    try {
        const { category, scope } = req.query;
        const query = {};

        if (category) query.category = category;
        if (scope) query['scope.type'] = scope;

        const items = await CulturalItem.find(query)
            .sort({ category: 1, name: 1 });

        res.json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET single cultural item
 * GET /api/cms/cultural-items/:id
 */
router.get('/cultural-items/:id', async (req, res) => {
    try {
        const item = await CulturalItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * CREATE new cultural item
 * POST /api/cms/cultural-items
 */
router.post('/cultural-items', async (req, res) => {
    try {
        const { name, category, scope, location, shortDescription, images, story, isHiddenGem, tags } = req.body;

        // Generate slug from name
        const slug = name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 50);

        // Check for duplicate slug
        const existing = await CulturalItem.findOne({ slug });
        if (existing) {
            return res.status(400).json({ error: 'An item with this name already exists' });
        }

        const item = new CulturalItem({
            slug,
            name,
            category,
            scope: {
                type: scope?.type || 'region',
                regionId: scope?.regionId || 'NE',
                stateCode: scope?.stateCode || null
            },
            location,
            shortDescription,
            images: images || [],
            story: story || {},
            isHiddenGem: isHiddenGem || false,
            tags: tags || []
        });

        await item.save();
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE cultural item
 * PUT /api/cms/cultural-items/:id
 */
router.put('/cultural-items/:id', async (req, res) => {
    try {
        const { name, category, scope, location, shortDescription, images, story, isHiddenGem, tags, isPublished } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (category !== undefined) updateData.category = category;
        if (scope !== undefined) {
            updateData.scope = {
                type: scope.type || 'region',
                regionId: scope.regionId || 'NE',
                stateCode: scope.stateCode || null
            };
        }
        if (location !== undefined) updateData.location = location;
        if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
        if (images !== undefined) updateData.images = images;
        if (story !== undefined) updateData.story = story;
        if (isHiddenGem !== undefined) updateData.isHiddenGem = isHiddenGem;
        if (tags !== undefined) updateData.tags = tags;
        if (isPublished !== undefined) updateData.isPublished = isPublished;

        const item = await CulturalItem.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE cultural item
 * DELETE /api/cms/cultural-items/:id
 */
router.delete('/cultural-items/:id', async (req, res) => {
    try {
        const item = await CulturalItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json({ success: true, message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * ==========================================
 * STATE CONTENT MANAGEMENT
 * ==========================================
 */

/**
 * UPDATE State Shared Story
 * PUT /api/cms/states/:slug/shared-story
 */
router.put('/states/:slug/shared-story', async (req, res) => {
    try {
        const { slug } = req.params;
        const { sharedStory } = req.body;

        const state = await State.findOneAndUpdate(
            { slug },
            { $set: { sharedStory } },
            { new: true }
        );

        if (!state) return res.status(404).json({ error: 'State not found' });
        res.json({ success: true, data: state.sharedStory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE State Cultural Threads
 * PUT /api/cms/states/:slug/cultural-threads
 */
router.put('/states/:slug/cultural-threads', async (req, res) => {
    try {
        const { slug } = req.params;
        const { culturalThreads } = req.body;

        const state = await State.findOneAndUpdate(
            { slug },
            { $set: { culturalThreads } },
            { new: true }
        );

        if (!state) return res.status(404).json({ error: 'State not found' });
        res.json({ success: true, data: state.culturalThreads });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE State Collage Images
 * PUT /api/cms/states/:slug/collage-images
 */
router.put('/states/:slug/collage-images', async (req, res) => {
    try {
        const { slug } = req.params;
        const { collageImages } = req.body;

        const state = await State.findOneAndUpdate(
            { slug },
            { $set: { collageImages } },
            { new: true }
        );

        if (!state) return res.status(404).json({ error: 'State not found' });
        res.json({ success: true, data: state.collageImages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE Region Collage Images
 * PUT /api/cms/regions/:slug/collage-images
 */
router.put('/regions/:slug/collage-images', async (req, res) => {
    try {
        const { slug } = req.params;
        const { collageImages } = req.body;

        const region = await Region.findOneAndUpdate(
            { slug },
            { $set: { collageImages } },
            { new: true }
        );

        if (!region) return res.status(404).json({ error: 'Region not found' });
        res.json({ success: true, data: region.collageImages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE District Collage Images
 * PUT /api/cms/districts/:slug/collage-images
 */
router.put('/districts/:slug/collage-images', async (req, res) => {
    try {
        const { slug } = req.params;
        const { collageImages } = req.body;

        const district = await District.findOneAndUpdate(
            { slug },
            { $set: { collageImages } },
            { new: true }
        );

        if (!district) return res.status(404).json({ error: 'District not found' });
        res.json({ success: true, data: district.collageImages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// DEFINING THEMES MANAGEMENT
// ============================================

/**
 * UPDATE Region Defining Themes
 * PUT /api/cms/regions/:slug/defining-themes
 */
router.put('/regions/:slug/defining-themes', async (req, res) => {
    try {
        const { slug } = req.params;
        const { definingThemes } = req.body;

        const region = await Region.findOneAndUpdate(
            { slug },
            { $set: { definingThemes } },
            { new: true }
        );

        if (!region) return res.status(404).json({ error: 'Region not found' });
        res.json({ success: true, data: region.definingThemes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE State Defining Themes
 * PUT /api/cms/states/:slug/defining-themes
 */
router.put('/states/:slug/defining-themes', async (req, res) => {
    try {
        const { slug } = req.params;
        const { definingThemes } = req.body;

        const state = await State.findOneAndUpdate(
            { slug },
            { $set: { definingThemes } },
            { new: true }
        );

        if (!state) return res.status(404).json({ error: 'State not found' });
        res.json({ success: true, data: state.definingThemes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE District Defining Themes
 * PUT /api/cms/districts/:slug/defining-themes
 */
router.put('/districts/:slug/defining-themes', async (req, res) => {
    try {
        const { slug } = req.params;
        const { definingThemes } = req.body;

        const district = await District.findOneAndUpdate(
            { slug },
            { $set: { definingThemes } },
            { new: true }
        );

        if (!district) return res.status(404).json({ error: 'District not found' });
        res.json({ success: true, data: district.definingThemes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ============================================
// CONTRIBUTIONS MANAGEMENT ("What This Region Gives")
// ============================================

/**
 * UPDATE Region Contributions
 * PUT /api/cms/regions/:slug/contributions
 */
router.put('/regions/:slug/contributions', async (req, res) => {
    try {
        const { slug } = req.params;
        const { contributions } = req.body;

        const region = await Region.findOneAndUpdate(
            { slug },
            { $set: { contributions } },
            { new: true }
        );

        if (!region) return res.status(404).json({ error: 'Region not found' });
        res.json({ success: true, data: region.contributions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE State Contributions
 * PUT /api/cms/states/:slug/contributions
 */
router.put('/states/:slug/contributions', async (req, res) => {
    try {
        const { slug } = req.params;
        const { contributions } = req.body;

        const state = await State.findOneAndUpdate(
            { slug },
            { $set: { contributions } },
            { new: true }
        );

        if (!state) return res.status(404).json({ error: 'State not found' });
        res.json({ success: true, data: state.contributions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE District Contributions
 * PUT /api/cms/districts/:slug/contributions
 */
router.put('/districts/:slug/contributions', async (req, res) => {
    try {
        const { slug } = req.params;
        const { contributions } = req.body;

        const district = await District.findOneAndUpdate(
            { slug },
            { $set: { contributions } },
            { new: true }
        );

        if (!district) return res.status(404).json({ error: 'District not found' });
        res.json({ success: true, data: district.contributions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
