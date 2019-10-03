import SimpleSchema from 'simpl-schema';

export const LocationSchema = new SimpleSchema({
    description: {
        type: String
    },
    place_id: {
        type: String
    },
    type: {
        type: String,
        allowedValues: ['Point'],
        defaultValue: 'Point',
        optional: true
    },
    coordinates: {
        optional: true,
        type: Array, // [lat, lng]
        maxCount: 2,
        minCount: 2,
    },
    'coordinates.$': {
        type: Number,
        optional: true,
    }
});