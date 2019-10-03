import { Alert } from 'react-native';
import Meteor from 'react-native-meteor';

import { TripSchema } from './schema';
import { isFavoriteTrip } from './helpers';
import { apiCall } from '../../shared/data/utils';
import { showAuthPopup } from '../../auth/data/api';

const tripsCollection = Meteor.collection('trips');

export const subscribeToTripsList = (params = {}) => {
    return Meteor.subscribe('trips.list', params);
};

export const getAllTrips = (filters={}) => {
    return tripsCollection.find(filters);
};

export const subscribeToTrips = (favoriteOnly) => {
    return Meteor.subscribe('trips.list.mine', favoriteOnly);
};

export const getMyTrips = (filters = {}) => {
    filters = { travelerId: Meteor.userId(), ...filters };
    return tripsCollection.find(filters, { sort: { collectBy: 1 } });
};

export const subscribeToTrip = (tripId) => {
    return Meteor.subscribe('trips.single', tripId);
};

export const getTrip = (filters = {}) => {
    return tripsCollection.findOne(filters);
};

export const createTrip = (tripData = {}, cb) => {
    const data = TripSchema.clean(tripData);

    Meteor.call('trips.create', data, cb);
};

export const favoriteTrip = (trip={}) => {
    if (!Meteor.userId()) {
        return showAuthPopup();
    }

    let title, message, buttons = [{text: 'Nevermind', style: 'cancel'}],
        tripIsFavorite = isFavoriteTrip(trip);

    const doFav = () => apiCall('trips.favorite', [trip._id]).catch(err => {
        Alert.alert("Something's wrong", err.message, [{ text: 'OK' }]);
    });

    if (tripIsFavorite) {
        title = 'Unfavorite Trip?';
        message = 'This trip will be removed from your saved trip list';
        buttons.push({
            text: 'Unfavorite It', onPress: doFav
        });
    } else {
        title = 'Favorite Trip?';
        message = 'Trip will be added to your saved list and you can make an offer later from the TRIPS tab.';
        buttons.push({ 
            text: 'Favorite It', onPress: doFav
        });
    }

    Alert.alert(title, message, buttons);
};