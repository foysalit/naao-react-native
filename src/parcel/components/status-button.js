import React from 'react';
import { Alert } from 'react-native';
import Meteor from 'react-native-meteor';
import { Button, Icon } from 'native-base';

import common from '../../styles/common';

const getStatusMessage = (parcel={}) => {
    let buttons = [{ text: 'Got It', style: 'cancel' }],
        isTraveler = Meteor.userId() === parcel.travelerId,
        message = !isTraveler 
            ? 'Your offer has been sent to the traveler and still waiting for their response'
            : "You haven't responded to the offer yet, While you're at full liberty to accept or reject the offer, we urge you to respond to each offer in a timely fashion.";
    
    if (parcel.isAccepted) {
        message = !isTraveler 
            ? "Your offer has been accepted. Feel free to chat with the traveler and arrange delivery of the parcel if you haven't already. Once the parcel is delivered, the traveler or you can mark it as delivered."
            : "You have accepted this parcel. Please discuss about the details of pickup and delivery of the parcel with the sender if you haven't already. After delivering, don't forget to mark it as delivered.";
    } else if (parcel.isRejected) {
        message = !isTraveler 
            ? "We are sorry to tell you that the traveler has rejected your offer. We hope you find someone else to deliver your package soon."
            : "You have rejected this offer. The sender won't be able to make another offer for this trip.";
    } else if (parcel.counterOffer) {
        message = !isTraveler 
            ? "Traveler has made a counter offer. You can accept or reject their offer. Please do so in a timely manner to have enough time to arrange pick up and delivery of your item."
            : "You have made a counter offer to the sender. We will let you know as soon as the sender responds to your offer.";
    }

    return {message, buttons};
}

export default ({ parcel }) => {
    let icon = 'money';
    const {message, buttons} = getStatusMessage(parcel);

    if (parcel.isAccepted) {
        icon = 'plane';
    } else if (parcel.isRejected) {
        icon = 'times-circle';
    } else if (parcel.counterOffer) {
        icon = 'money';
    }

    return (
        <Button
            dark
            small
            transparent
            info={!!parcel.counterOffer}
            success={!!parcel.closedAt}
            danger={parcel.isRejected}
            warning={parcel.isAccepted}
            onPress={() => Alert.alert("Parcel Status", message, buttons)}
        >
            <Icon name={icon} style={[common.mr10, common.ml10]}/>
        </Button>
    );
};