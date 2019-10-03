import React from 'react';
import { View, Text } from 'native-base';
import { StyleSheet, Image } from 'react-native';

import common from '../../styles/common';
import colors from '../../styles/colors';

const SizeHintImage = require('../images/size-hint.png');

const styles = StyleSheet.create({
    section: {
        ...common.pb20,
        ...common.mb10,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    }
});

export default class ParcelHint extends React.Component {
    render () {
        return (
            <View style={[common.px15, common.py20]}>
                <Text style={[common.textSuccess, common.pb5, common.fontBold]}>HINTS</Text>
                <Text style={[styles.section]}>
                    Travelers preset how much available space they have in their luggage when posting their trip. 
                    Senders, please make sure your parcel is within that size and weight. 
                    If it's not, you can still make an offer but keep in mind that the traveler is always in charge of accepting/rejecting that offer.
                </Text>
                
                <Text style={[common.textSuccess, common.pb5, common.fontBold]}>PARCEL SIZE</Text>
                <Text style={[styles.section]}>
                    Package your items properly to make it easier for the traveler to carry and deliver your parcel. 
                    Once packed, measure your parcel's width, height and length in either inches or centimeters. 
                    Travelers, please make sure that you only accept offers that are within your available space.
                </Text>
                
                <Image
                    resizeMode="contain"
                    source={ SizeHintImage }
                    style={{ flex: 1, width: null, height: 150 }} 
                />

                <Text style={[common.textSuccess, common.pt15, common.pb5, common.fontBold]}>PARCEL WEIGHT</Text>
                <Text style={[styles.section]}>
                    In most flights, travelers get a limited allowance of luggage weight. 
                    Travelers should make sure that they stay within that limit when accepting parcel offers.
                    Which is why senders should carefully check how much available weight a traveler has left in their trip before making an offer.
                    Please post your parcel weight only measured in KG unit.
                </Text>
                
                <Text style={[common.textSuccess, common.pb5, common.fontBold]}>ABOUT OFFER</Text>
                <Text style={[common.pb15]}>
                    To keep things secure, civil and private, Naao provides a very streamlined bid/offer system within the app.
                    A sender can only make an offer to a traveler, requesting them to delivery their parcel, by stating their parcel size, weight and amount of offer (currency specific).
                    Once the offer is sent, both parties can use Naao Chat to arrange pick up, drop off, transaction etc.
                    As a traveler, you have the option to make a counter offer for each offer. Above all, travelers are at full liberty to accept/reject/negotiate an offer.
                </Text>
            </View>
        );
    };
};