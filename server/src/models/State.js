import mongoose from 'mongoose';

/**
 * State Model - For state pages like /manipur, /nagaland
 * Designed to support the 8-section content structure:
 * 1. Hero - State's Essence
 * 2. State at a Glance
 * 3. Land & Its Memory
 * 4. People & Communities
 * 5. Cultural Life
 * 6. Contributions
 * 7. Places & Experiences
 * 8. Explore Districts
 */
const stateSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true }, // "MN" for Manipur
        code: { type: String, required: true, unique: true, index: true }, // "MN"
        name: { type: String, required: true }, // "Manipur"
        slug: { type: String, required: true, unique: true, index: true }, // "manipur"
        regionId: { type: String, required: true, ref: 'Region', default: 'NE' },

        // Section 1: Hero - The State's Essence
        tagline: { type: String, required: true }, // One line that defines character
        heroImage: {
            url: String,
            caption: String
        },

        // Section 2: State at a Glance (Soft Facts)
        glance: {
            capital: String,
            landscapeType: String, // "Valleys, hills, lakes"
            languages: [String],
            climate: String, // "Subtropical monsoon"
            population: String, // Approximate, not exact numbers
            area: String // In sq km, approximate
        },

        // Section 3: The Land & Its Memory
        landMemory: {
            narrative: String, // How geography shaped culture
            keyTransitions: [String] // Ancient → modern themes
        },

        // Section 4: People & Communities
        communities: {
            description: String,
            coexistingGroups: [String], // Not tribe labels, general groups
            sharedValues: [String]
        },

        // Section 5: Cultural Life of the State
        culturalLife: {
            festivals: [{
                name: String,
                meaning: String // Meaning, not schedule
            }],
            foodCulture: String,
            artForms: [String]
        },

        // Section 6: What This State Gives Back
        contributions: [{
            type: { type: String, enum: ['Crafts', 'Agriculture', 'Ideas', 'Ecology', 'Culture'] },
            title: String,
            description: String
        }],

        // Section 7: Places & Experiences (Selective)
        experienceCategories: [{
            title: String, // "Sacred landscapes"
            description: String,
            icon: String
        }],

        // Search Keywords
        searchKeywords: [String],

        // Metadata
        districtCount: { type: Number, default: 0 }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Virtual for getting all districts in this state
stateSchema.virtual('districts', {
    ref: 'District',
    localField: 'code',
    foreignField: 'stateCode'
});

stateSchema.set('toJSON', { virtuals: true });
stateSchema.set('toObject', { virtuals: true });

export default mongoose.model('State', stateSchema);
