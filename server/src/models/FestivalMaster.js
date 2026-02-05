import mongoose from 'mongoose';

const festivalMasterSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true }, // slug
        name: { type: String, required: true },
        tagline: { type: String },
        description: { type: String },
        category: { type: String, default: 'Cultural' },
        subCategory: { type: String },
        stateId: { type: String },    // Added for CMS pre-filling
        districtId: { type: String }, // Added for CMS pre-filling
        images: {
            preview: { type: String }, // Thumbnail
            hero: [{ type: String }],   // Array of hero images
            content: [{ type: String }] // Images for the body content
        },
        ecoCertified: { type: Boolean, default: false },
        bookingLink: { type: String },
        websiteUrl: { type: String },
        tags: [{ type: String }],
        recurring: { type: Boolean, default: true }
    },
    {
        timestamps: true, // Track updates
        versionKey: false
    }
);

// Text index for search
festivalMasterSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('FestivalMaster', festivalMasterSchema);
