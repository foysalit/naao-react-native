import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import { View, Text, Button } from 'native-base';

import common from '../../styles/common';

const EmptyImage = require('../images/empty-parcel.png');

const EmptyParcel = ({ onSearchPress }) => (
    <View style={[common.pt20]}>
        <Image
            style={{ width: null, height: 180 }}
            resizeMethod="resize"
            resizeMode="contain"
            source={EmptyImage}
        />
        <Text style={[common.pt40, common.fontBold, common.textCenter]}>NOTHING TO SEE HERE.</Text>
        <Text style={[common.pt10, common.textCenter]}>No parcels found. Offers you make to travelers of Naao will show up here.</Text>

        <View style={[common.px25, common.pt20]}>
            <Button
                onPress={onSearchPress}
                rounded
                danger
                block>
                <Text>FIND A TRAVELER</Text>
            </Button>
        </View>    
    </View>
);

EmptyParcel.propTypes = {
    onSearchPress: PropTypes.func.isRequired,
};

export default EmptyParcel;