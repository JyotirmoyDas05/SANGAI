import { Router } from 'express';
import { CulturalItem } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

/**
 * GET /api/culture/:category
 * Get cultural items by category with optional scope filtering
 * 
 * NOTE: This route handles CULTURAL DOCUMENTATION (heritage, traditions).
 * For PROMOTED EVENTS (ongoing/upcoming festivals), use /api/festivals instead.
 * 
 * Query params:
 *   - scope: 'region' | 'state' (default: 'region')
 *   - state: 2-letter state code (required when scope=state)
 */
router.get('/:category', async (req, res, next) => {
    try {
        const { category } = req.params;
        const { scope = 'region', state } = req.query;

        // Validate category
        const validCategories = ['festivals', 'music', 'attire', 'food', 'wildlife'];
        if (!validCategories.includes(category)) {
            throw ApiError.badRequest(`Invalid category: ${category}`);
        }

        // Build query for CulturalItems
        const query = {
            category,
            isPublished: true
        };

        if (scope === 'state' && state) {
            // State-level: Include Region items + This State's items (inheritance)
            query.$or = [
                { 'scope.type': 'region' },
                { 'scope.stateCode': state.toUpperCase() }
            ];
        }
        // Region-level: No additional filter (shows all published items in category)

        const items = await CulturalItem.find(query)
            .select('slug name category location images isHiddenGem shortDescription')
            .sort({ name: 1 });

        res.json({
            success: true,
            count: items.length,
            data: items.map(item => ({
                id: item.slug,
                name: item.name,
                category: item.category,
                location: item.location,
                image: item.primaryImage,
                shortDescription: item.shortDescription,
                isHiddenGem: item.isHiddenGem
            }))
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/culture/:category/:itemSlug
 * Get single cultural item detail
 */
router.get('/:category/:itemSlug', async (req, res, next) => {
    try {
        const { category, itemSlug } = req.params;

        const item = await CulturalItem.findOne({
            slug: itemSlug,
            category,
            isPublished: true
        });

        if (!item) {
            throw ApiError.notFound(`Cultural item not found: ${itemSlug}`);
        }

        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
});

export default router;

