import mongoose from 'mongoose';

const CulturalItemSchema = new mongoose.Schema({
    // Readable slug-based ID
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    // Display name
    name: {
        type: String,
        required: true,
        trim: true
    },

    // Category type
    category: {
        type: String,
        required: true,
        enum: ['festivals', 'music', 'attire', 'food', 'wildlife']
    },

    // Scope - region-level or state-level
    scope: {
        type: {
            type: String,
            enum: ['region', 'state'],
            default: 'region'
        },
        regionId: {
            type: String,
            default: 'NE'  // Northeast
        },
        stateCode: {
            type: String,
            default: null  // null for region-level, state code for state-level
        }
    },

    // Location display text
    location: {
        type: String,
        trim: true
    },

    // Short description for cards
    shortDescription: {
        type: String,
        trim: true
    },

    // Images
    images: [{
        url: String,
        caption: String,
        isPrimary: { type: Boolean, default: false }
    }],

    // Detailed story content
    story: {
        overview: String,      // Main description
        significance: String,  // Cultural significance
        localInsight: String   // Local perspective/tip
    },

    // Featured/hidden gem flag
    isHiddenGem: {
        type: Boolean,
        default: false
    },

    // Tags for filtering
    tags: [String],

    // Publishing status
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
CulturalItemSchema.index({ category: 1, 'scope.type': 1 });
CulturalItemSchema.index({ 'scope.stateCode': 1 });
CulturalItemSchema.index({ slug: 1 });

// Helper to get primary image
CulturalItemSchema.virtual('primaryImage').get(function () {
    const primary = this.images.find(img => img.isPrimary);
    return primary ? primary.url : (this.images[0]?.url || null);
});

// Ensure virtuals are included in JSON
CulturalItemSchema.set('toJSON', { virtuals: true });
CulturalItemSchema.set('toObject', { virtuals: true });

const CulturalItem = mongoose.model('CulturalItem', CulturalItemSchema);
export default CulturalItem;
