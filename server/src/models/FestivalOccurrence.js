import mongoose from 'mongoose';

const festivalOccurrenceSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        festivalId: { type: String, ref: 'FestivalMaster', required: true, index: true },
        districtId: { type: String, ref: 'District', required: true, index: true },
        placeId: { type: String, ref: 'Place', default: null },
        venue: { type: String }, // Specific venue name
        location: {
            lat: Number,
            lng: Number
        },
        startDate: { type: Date, required: true, index: true },
        endDate: { type: Date, required: true }
    },
    {
        timestamps: false,
        versionKey: false
    }
);

// Compound indexes for common queries
festivalOccurrenceSchema.index({ startDate: 1, endDate: 1 });
festivalOccurrenceSchema.index({ districtId: 1, startDate: 1 });

export default mongoose.model('FestivalOccurrence', festivalOccurrenceSchema);
