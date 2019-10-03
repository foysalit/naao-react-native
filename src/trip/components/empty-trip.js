import React from 'react';
import { Image } from 'react-native';
import { View, Text, Button } from 'native-base';
import { withNavigation } from 'react-navigation';

import common from '../../styles/common';
import { updateSearch } from '../../search/data/api';

const EmptyImage = require('../images/empty-trip.png');

const EmptyTrip = ({ navigation, favoriteOnly = false }) => (
    <View style={[common.pt20]}>
        <Image
            style={{ width: null, height: 180 }}
            resizeMethod="resize"
            resizeMode="contain"
            source={EmptyImage}
        />
        <Text style={[common.pt40, common.fontBold, common.textCenter]}>NOTHING TO SEE HERE.</Text>

        {favoriteOnly ? (
            <Text style={[common.pt10, common.textCenter, common.textLight]}>No trips right now. Going somewhere? Why not post your trip and make some $$$.</Text>
        ) : (
            <Text style={[common.pt10, common.textCenter, common.textLight]}>Other travelers trips you want to keep track of will show up here.</Text>
        )}

        <View style={[ common.px25, common.pt20 ]}>
            <Button
                onPress={() => navigation.navigate("Search")}
                rounded
                danger
                block>
                <Text>POST YOUR TRIP</Text>
            </Button>
        </View>
    </View>
);

export default withNavigation(EmptyTrip);