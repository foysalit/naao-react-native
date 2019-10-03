import React from 'react';
import { Image } from 'react-native';
import { View, Text } from 'native-base';

import common from '../../styles/common';

const EmptyImage = require('../images/empty-search.png');

const EmptySearch = () => (
    <View style={[common.pt20]}>
        <Image
            style={{ width: null, height: 180 }}
            resizeMethod="resize"
            resizeMode="contain"
            source={EmptyImage}
        />
        <Text style={[common.pt40, common.fontBold, common.textCenter]}>NO RESULTS.</Text>
        <Text style={[common.pt10, common.textCenter]}>Sorry, no trips found matching your search filters.</Text>
    </View>
);

export default EmptySearch;