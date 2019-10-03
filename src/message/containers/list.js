import React from "react";
import { View, Spinner, Text } from 'native-base';
import Meteor, { withTracker } from 'react-native-meteor';

import MessageSummary from '../components/summary';
import NoChat from '../components/no-chat';
import common from '../../styles/common';

import { subscribeToParcels, getAllParcels } from "../../parcel/data/api";
import { getUser } from "../../user/data/api";
import { findMessages } from "../data/api";

const List = ({ parcelReady, parcels, navigation }) => {
    if (!parcelReady)
        return (<Spinner />);
        
    if (parcels.length < 1)
        return (<NoChat />);

    return (
        <View>
            {parcels.map(parcel => <MessageSummary
                onPress={() => navigation.navigate('MessageChat', { parcel })}
                lastMessage={parcel.lastMessage}
                traveler={parcel.traveler}
                user={parcel.user}
                key={parcel._id}
                chat={parcel} />
            )}
        </View>
    );
};

export default withTracker(props => {
    const parcelSub = subscribeToParcels(),
        parcelReady = parcelSub.ready(),
        parcels = parcelReady ? getAllParcels().filter(p => {
            return props.type === 'parcel' ? p.ownerId === Meteor.userId() : p.travelerId === Meteor.userId();
        }).map(p => {
            return { 
                lastMessage: p.lastMessageId ? findMessages({ _id: p.lastMessageId })[0] : null,
                user: getUser(props.type === 'parcel' ? p.travelerId : p.ownerId), 
                ...p, 
            };
        }) : [];

    // console.log(parcels[0], findMessages());
    return {
        parcels, parcelReady,
        ...props
    };
})(List);