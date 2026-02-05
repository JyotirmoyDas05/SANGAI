import { Router } from 'express';
import regionsRouter from './regions.js';
import statesRouter from './states.js';
import districtsRouter from './districts.js';
import placesRouter from './places.js';
import homestaysRouter from './homestays.js';
import guidesRouter from './guides.js';
import festivalsRouter from './festivals.js';
import searchRouter from './search.js';
import productRoutes from './productRoutes.js';
import northeastRouter from './northeast.js';
import cmsRouter from './cms.js';
import { Tag } from '../models/index.js';

const router = Router();

// CMS Routes (Protected)
router.use('/cms', cmsRouter);

// NEW: Hierarchical Northeast routes
router.use('/northeast', northeastRouter);

// Legacy flat routes (kept for backward compatibility)
router.use('/regions', regionsRouter);
router.use('/states', statesRouter);
router.use('/districts', districtsRouter);
router.use('/places', placesRouter);
router.use('/homestays', homestaysRouter);
router.use('/guides', guidesRouter);
router.use('/festivals', festivalsRouter);
router.use('/search', searchRouter);
router.use('/products', productRoutes);


// Tags endpoint
router.get('/tags', async (req, res, next) => {
    try {
        const tags = await Tag.find().sort({ name: 1 });
        res.json({
            success: true,
            count: tags.length,
            data: tags
        });
    }
    catch (error) {
        next(error);
    }
});

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'SANGAI API is running',
        timestamp: new Date().toISOString()
    });
});

export default router;
