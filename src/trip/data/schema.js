import SimpleSchema from 'simpl-schema';
import { addDays, isBefore } from 'date-fns';

import { LocationSchema } from '../../shared/data/location-schema';
import { ParcelSizeSchema } from '../../parcel/data/schema';

export const TripSchema = new SimpleSchema({
    collectBy: {
        type: Date,
        min: function () {
            return new Date();
        }
    },
    deliveryBy: {
        type: Date,
        min: function () {
            return addDays(new Date(), 1);
        },
        custom() {
            if (isBefore(this.value, this.field('collectBy').value)) {
                return "Delivery date must be after collection date";
            }
        },
    },
    from: {
        type: LocationSchema,
    },
    to: {
        type: LocationSchema,
    },
    totalSpace: {
        type: ParcelSizeSchema,
    },
    // gets calculated on the fly when new bookings are made
    availableSpace: {
        type: ParcelSizeSchema,
        optional: true,
    },
    isPublished: {
        type: Boolean,
        optional: true,
        defaultValue: false,
    },
    favoritedBy: {
        type: Array,
        optional: true,
    },
    'favoritedBy.$': {
        type: SimpleSchema.RegEx.Id
    },
    travelerId: {
        type: String,
        optional: true,
    },
    createdAt: {
        type: Date,
        optional: true,
        autoValue: function () {
            return new Date();
        }
    }
});