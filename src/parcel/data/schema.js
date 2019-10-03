import SimpleSchema from 'simpl-schema';

export const ParcelSizeSchema = new SimpleSchema({
    weight: {
        type: Number,
        min: 1,
    },
    width: {
        type: Number,
        min: 1,
    },
    height: {
        type: Number,
        min: 1,
    },
    len: {
        label: 'Length',
        type: Number,
        min: 1,
    },
    unit: {
        type: String,
        allowedValues: ['cm', 'in'],
        defaultValue: 'cm',
        optional: true,
    }
});

export const ParcelSchema = new SimpleSchema({
    size: {
        type: ParcelSizeSchema,
    },
    ownerId: {
        type: SimpleSchema.RegEx.Id,
        optional: true,
    },
    tripId: {
        type: SimpleSchema.RegEx.Id,
    },
    travelerId: {
        type: SimpleSchema.RegEx.Id,
        optional: true,
    },
    lastMessageId: {
        type: SimpleSchema.RegEx.Id,
        optional: true,
    },
    note: {
        type: String,
        optional: true,
    },
    content: {
        type: String,
        optional: true,
    },
    currency: {
        type: String,
        defaultValue: 'USD'
    },
    offerAt: {
        type: Date,
        optional: true,
        autoValue: function () {
            if (this.isSet)
                return new Date();
        }
    },
    offer: {
        type: Number,
        min: 1,
    },
    counterOfferAt: {
        type: Date,
        optional: true
    },
    counterOffer: {
        type: Number,
        optional: true,
    },
    isAccepted: {
        type: Boolean,
        optional: true,
    },
    isRejected: {
        type: Boolean,
        optional: true,
    },
    deliveredAt: {
        type: Date,
        optional: true,
    },
    markedDeliveredBy: {
        type: SimpleSchema.RegEx.Id,
        optional: true,
    },
    ownerRating: {
        type: Number,
        optional: true,
    },
    travelerRating: {
        type: Number,
        optional: true,
    },
    ownerReview: {
        type: String,
        optional: true,
    },
    travelerReview: {
        type: String,
        optional: true,
    },
    closedAt: {
        type: Date,
        optional: true,
    }
});