import Meteor from "react-native-meteor";

export const isMyTrip = (trip={}) => {
    return trip && trip.travelerId === Meteor.userId();
};

export const isFavoriteTrip = (trip={}) => {
    return trip && trip.favoritedBy && trip.favoritedBy.indexOf(Meteor.userId()) >= 0;
};