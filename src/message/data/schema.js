import SimpleSchema from 'simpl-schema';

const Message = {
    parcelId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    authorId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    text: {
        type: String,
    },
    createdAt: {
        type: Date,
        optional: true,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return { $setOnInsert: new Date() };
            } else {
                this.unset();  // Prevent user from supplying their own value
            }
        }
    },
};

export const MessageSchema = new SimpleSchema(Message);