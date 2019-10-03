import Meteor from 'react-native-meteor';

import { apiCall } from '../../shared/data/utils';

const usersCollection = Meteor.collection('users');

export const getUser = (filters = {}) => {
    return usersCollection.findOne(filters);
};

export const updateProfile = async (profile={}) => {
    return await apiCall('users.update.profile', [profile]);
};