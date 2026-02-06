import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        districtId: { type: String, ref: 'District', required: true, index: true },
        name: { type: String, required: true },
        type: {
            type: String,
            required: true,
            enum: ['waterfall', 'trail', 'hill', 'village', 'lake', 'cave', 'forest', 'valley', 'nature', 'temple', 'monument', 'park', 'river', 'viewpoint'],
            index: true
        },
        shortDescription: { type: String },
        story: {
            overview: String,
            culturalSignificance: String,
            localBelief: String
        },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        logistics: {
            nearestTown: String,
            distanceFromNearestTown: String,
            distanceFromShillong: String,
            distanceFromGuwahati: String,
            transportationInfo: String
        },
        experience: {
            highlights: [String],
            visitorTips: [String]
        },
        contact: {
            phone: String,
            whatsapp: String,
            email: String
        },
        images: [
            {
                url: String,
                caption: String
            }
        ],
        bestTimeToVisit: { type: String },
        isHiddenGem: { type: Boolean, default: false, index: true },
        tagIds: [{ type: String, ref: 'Tag', index: true }],
        createdAt: { type: Date, default: Date.now }
    },
    {
        timestamps: false,
        versionKey: false
    }
);

// Virtual for related homestays
placeSchema.virtual('homestays', {
    ref: 'Homestay',
    localField: '_id',
    foreignField: 'placeId'
});

// Compound index for common queries
placeSchema.index({ districtId: 1, type: 1 });
placeSchema.index({ districtId: 1, isHiddenGem: 1 });

// Text index for search
placeSchema.index({ name: 'text', shortDescription: 'text' });

placeSchema.set('toJSON', { virtuals: true });
placeSchema.set('toObject', { virtuals: true });

export default mongoose.model('Place', placeSchema);
