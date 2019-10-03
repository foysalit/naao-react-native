import Meteor from 'react-native-meteor';

import { getUser } from "../../user/data/api";
import { getProfilePic } from '../../images/api';
import { apiCall } from '../../shared/data/utils';

export const Messages = Meteor.collection('messages');

export const findMessages = (filters = {}, options = { sort: { createdAt: -1 } }) => {
    return Messages.find(filters, options);
};

export const sendMessage = (parcelId = null, messages = []) => {
    apiCall('messages.create', [parcelId, { text: messages[0].text }]);
};

export const getFormattedMessages = (parcelId) => {
    return findMessages({ parcelId }).map(({ text, createdAt, authorId, _id }) => {
        const user = getUser({_id: authorId});

        return {
            _id, text, createdAt, user: {
                avatar: getProfilePic(user),
                name: user.profile.name,
                _id: user._id
            },
        };
    });
};