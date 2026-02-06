import mongoose from 'mongoose';

/**
 * District Model - For district pages like /ukhrul, /kohima
 * Extended to support the 8-section content structure:
 * 1. Hero - Sense of Place
 * 2. Where You Are (Context)
 * 3. Everyday Life Here
 * 4. Culture in Daily Practice
 * 5. Landscapes That Shape Life
 * 6. How to Experience
 * 7. Voices & Stories
 * 8. Continue the Journey
 */
const districtSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        stateCode: { type: String, required: true, index: true },
        stateName: { type: String, required: true },
        districtName: { type: String, required: true },
        region: { type: String, required: true, default: 'northeast' },

        // NEW: URL-friendly slug
        slug: { type: String, index: true },

        // Section 1: Hero - Sense of Place
        tagline: String, // Very intimate line
        heroImage: {
            url: String,
            caption: String
        },

        // Extended Hero Images (multiple)
        heroImages: [{
            url: { type: String, required: true },
            caption: String
        }],
        images: {
            hero: [String], // Legacy support, optional
            map: String
        },

        // Sense of Place (legacy support)
        senseOfPlace: {
            oneLiner: String,
            backgroundTexture: String
        },

        // Description Section
        description: {
            title: String,
            content: String
        },

        // Defining Themes (cards)
        definingThemes: [{
            icon: String,
            title: String,
            description: String
        }],

        // Known For (quick facts)
        knownFor: [String],

        // Stats Section
        population: String,
        area: String,
        location: {
            lat: Number,
            lng: Number
        },

        // Land and Memory Section
        landAndMemory: {
            title: String,
            content: String
        },

        // Shopping CTA
        shoppingCta: {
            title: String,
            categories: [String]
        },

        // Audio/Weather
        audioKey: String,
        weatherCode: Number,


        // Section 2: Where You Are (Context)
        context: {
            landscapeType: String,
            surroundings: String,
            partOfState: String
        },

        // Section 3: Everyday Life Here
        everydayLife: {
            description: String, // How people spend their days
            rhythms: [String] // Markets, farms, rivers, streets
        },

        // Section 4: Culture in Daily Practice
        dailyCulture: {
            clothing: String,
            foodHabits: String,
            localCustoms: [String],
            communityRituals: [String]
        },

        // Section 5: Landscapes That Shape Life
        landscapes: [{
            type: { type: String, enum: ['river', 'hill', 'forest', 'lake', 'valley', 'mountain'] },
            name: String,
            significance: String // Why it matters emotionally
        }],

        // Section 6: How to Experience This District
        experiences: [{
            type: { type: String, enum: ['walking', 'homestays', 'food', 'conversations', 'seasonal'] },
            title: String,
            description: String
        }],

        // Section 7: Voices & Stories
        voices: {
            localQuote: String,
            quoteSpeaker: String,
            folkBelief: String,
            anecdote: String
        },

        // Section 8: Continue the Journey (navigation)
        nearbyDistricts: [{ type: String, ref: 'District' }],

        // Search Keywords
        searchKeywords: [String]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Virtual for places in this district
districtSchema.virtual('places', {
    ref: 'Place',
    localField: '_id',
    foreignField: 'districtId'
});

// Virtual for state reference
districtSchema.virtual('state', {
    ref: 'State',
    localField: 'stateCode',
    foreignField: 'code',
    justOne: true
});

districtSchema.set('toJSON', { virtuals: true });
districtSchema.set('toObject', { virtuals: true });

export default mongoose.model('District', districtSchema);
