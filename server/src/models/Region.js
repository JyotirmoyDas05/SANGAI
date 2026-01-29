import mongoose from 'mongoose';

/**
 * Region Model - For macro region pages like /northeast
 * Designed to support the 8-section content structure:
 * 1. Hero - Identity
 * 2. Defining Themes
 * 3. Shared Story
 * 4. People
 * 5. Cultural Threads
 * 6. Contributions
 * 7. Ways to Explore
 * 8. Gateway to States
 */
const regionSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true }, // "NE" for Northeast
        name: { type: String, required: true }, // "Northeast India"
        slug: { type: String, required: true, unique: true, index: true }, // "northeast"

        // Section 1: Hero - The Identity
        tagline: { type: String, required: true }, // "The Hidden Jewel"
        heroImages: [{
            url: { type: String, required: true },
            caption: String,
            focus: { type: String, enum: ['landscape', 'people', 'culture'] }
        }],

        // Section 2: What Defines This Region
        definingThemes: [{
            icon: String, // Material icon name
            title: { type: String, required: true },
            description: String
        }],

        // Section 3: A Shared Story (Short Narrative)
        sharedStory: {
            paragraphs: [String], // 4-5 lines
            tone: { type: String, enum: ['philosophical', 'historical', 'cultural'] }
        },

        // Section 4: People of the Region
        peopleSection: {
            title: String,
            description: String,
            portraits: [{
                imageUrl: String,
                attribution: String
            }]
        },

        // Section 5: Cultural Threads (Pan-Regional)
        culturalThreads: [{
            title: String, // "Festival Rhythms"
            insight: String, // One-line insight
            imageUrl: String
        }],

        // Section 6: Ecological & Cultural Contribution
        contributions: [{
            category: { type: String, enum: ['Biodiversity', 'Knowledge', 'Agriculture', 'Crafts', 'Culture'] },
            title: String,
            description: String
        }],

        // Section 7: Ways to Explore
        explorationCategories: [{
            title: String, // "Cultural journeys"
            description: String,
            icon: String
        }],

        // Search Keywords (for search index)
        searchKeywords: [String],

        // Metadata
        stateCount: { type: Number, default: 8 }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Virtual for getting all states in this region
regionSchema.virtual('states', {
    ref: 'State',
    localField: '_id',
    foreignField: 'regionId'
});

regionSchema.set('toJSON', { virtuals: true });
regionSchema.set('toObject', { virtuals: true });

export default mongoose.model('Region', regionSchema);
