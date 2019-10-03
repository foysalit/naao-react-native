import { Alert } from 'react-native';
import Meteor, { ReactiveDict } from 'react-native-meteor';

import { ParcelSchema } from './schema';
import { apiCall } from '../../shared/data/utils';

const parcelsCollection = Meteor.collection('parcels');

export const getAllParcels = (filters={}) => {
    return parcelsCollection.find(filters);
};

export const subscribeToParcels = (filters={}) => {
    return Meteor.subscribe('parcels.list.mine', filters);
};

export const getParcels = (filters = {}) => {
    return parcelsCollection.find(filters, { sort: { collectBy: 1 } });
};

export const subscribeToParcel = (filters) => {
    return Meteor.subscribe('parcels.single', filters);
};

export const getParcel = (filters = {}) => {
    return parcelsCollection.findOne(filters);
};

const parcelOffer = new ReactiveDict('parcels.offer');

export const getTempOffer = () => {
    return parcelOffer.get('temp');
};

export const setTempOffer = (offer={}) => {
    return parcelOffer.set('temp', offer);
};

export const createParcel = (parcelData = {}, cb) => {
    const data = ParcelSchema.clean(parcelData);

    Meteor.call('parcels.create', data, cb);
};

export const sendCounterOffer = (parcel={}, counterOffer=0) => {
    counterOffer = parseInt(counterOffer);
    return apiCall('parcels.update', [parcel._id, {counterOffer, counterOfferAt: new Date()}])
        .then(() => {
            Alert.alert('Counter Offer Sent', "Now we wait... Sender will be notified of your counter offer and we will let you know as soon as they respond");
        }).catch((err) => {
            Alert.alert('Error Sending Counter', `Sorry something doesn't look right. This is what the almighty machines are telling you: ${err.message}`);
        });
};

export const acceptOffer = (parcel={}) => {
    const onPress = () => apiCall('parcels.update', [parcel._id, { isAccepted: true }])
        .then(() => {
            Alert.alert('Offer Accepted', "This is the perfect time to talk to the sender and arrange pickup-delivery schedules if you already haven't. You can chat with the sender from the CHAT page");
        }).catch((err) => {
            Alert.alert('Error Accepting Offer', `Sorry something doesn't look right. This is what the almighty machines are telling you: ${err.message}`);
        });

    return Alert.alert(
        "Accept Offer", 
        `Please make sure you discuss the details of the pickup and delivery for this parcel. The sender will be paying you ${parcel.offer} to deliver the package. Ready to accept?`, 
        [{text: 'Cancel', style: 'cancel'}, {text: 'Accept', onPress}]
    ); 
};

export const rejectOffer = (parcel={}) => {
    const onPress = () => apiCall('parcels.update', [parcel._id, { isRejected: true, closedAt: new Date() }])
        .then(() => {
            Alert.alert('Offer Rejected', "Sorry things didn't work out between you two. This sender won't be able to book any parcel with you for this trip");
        }).catch((err) => {
            Alert.alert('Error Rejecting Offer', `Sorry something doesn't look right. This is what the almighty machines are telling you: ${err.message}`);
        });

    return Alert.alert(
        "Reject Offer", 
        `Don't like the offer? you're at liberty to reject it but please know that once you reject, this sender will not be able to book any parcel for this trip.`, 
        [{text: 'Cancel', style: 'cancel'}, {text: 'Reject', onPress}]
    ); 
};

export const acceptCounterOffer = (parcel={}) => {
    const onPress = () => apiCall('parcels.update', [parcel._id, { isAccepted: true }])
        .then(() => {
            Alert.alert(
                'Counter Offer Accepted', 
                `You have agreed to pay ${parcel.counterOffer} ${ parcel.currency } instead of your original offer to the traveler for carrying your parcel. After accepting, don't forget to discuss details of pickup and dropoff of your parcel with the traveler.`
            );
        }).catch((err) => {
            Alert.alert(
                'Error Accepting Offer', 
                `Sorry something doesn't look right. This is what the almighty machines are telling you: ${err.message}`
            );
        });

    return Alert.alert(
        "Accept Counter Offer?", 
        `The user asked for ${parcel.counterOffer} ${ parcel.currency } instead of your offer ${parcel.offer} ${parcel.currency}. You sure you want to pay ${parcel.counterOffer} for this parcel delivery?`, 
        [{text: 'Cancel', style: 'cancel'}, {text: 'Accept', onPress}]
    ); 
};

export const rejectCounterOffer = (parcel={}) => {
    const onPress = () => apiCall('parcels.update', [parcel._id, { isRejected: true, closedAt: new Date() }])
        .then(() => {
            Alert.alert('Counter Offer Rejected', "Sorry things didn't work out between you two. We hope you find someone else on Naao to send your package with.");
        }).catch((err) => {
            Alert.alert('Error Rejecting Offer', `Sorry something doesn't look right. This is what the almighty machines are telling you: ${err.message}`);
        });

    return Alert.alert(
        "Reject Counter Offer?", 
        `Don't like the counter offer? you're at liberty to reject it but please know that once you reject, you won't be able to book any parcel with this traveler for this trip.`, 
        [{text: 'Cancel', style: 'cancel'}, {text: 'Reject', onPress}]
    ); 
};

export const markAsDelivered = (parcel = {}) => {
    const isTraveler = Meteor.userId() === parcel.travelerId;

    const onPress = () => apiCall('parcels.update', [parcel._id, { deliveredAt: new Date(), closedAt: new Date() }])
        .then(() => {
            const message = isTraveler ? 'Thank you delivering the pacakge. We will now notify the sender. Please leave a review about the sender and your overall experience with Naao. Hope the sender will leave you a great review too.' : 'Thank you for letting us know that the parcel has been delivered. Please take a minute to leave a review about the traveler and your overall experience with Naao.';
            Alert.alert('Parcel Delivered', message);
        }).catch((err) => {
            console.log(err)
            Alert.alert('Error Delivering Parcel', `Sorry something doesn't look right. This is what the almighty machines are telling you: ${err.message}`);
        });
    
    const title = isTraveler ? 'Parcel Delivered?' : 'Received Parcel?',
        message = isTraveler ? 'Please confirm that you have delivered the package as per your arrangement with the sender.' : 'Please confirm that the package has been delivered as per your arrangement with the traveler.';
    
    return Alert.alert(
        title, message,
        [{ text: 'Cancel', style: 'cancel' }, { text: 'Mark Delivered', onPress }]
    ); 
};

export const postReview = (parcel={}, review='', rating=0) => {
    const isTraveler = Meteor.userId() === parcel.travelerId,
        data = isTraveler ? { travelerReview: review, travelerRating: rating } : { ownerReview: review, ownerRating: rating };

    return apiCall('parcels.update', [parcel._id, data]).then(() => {
        Alert.alert('Review Posted', 'Thank you for your taking the time to post your review.');
    }).catch((err) => {
        Alert.alert('Error Posting Review', `Sorry something doesn't look right. This is what the almighty machines are telling you: ${err.message}`);
    });
};