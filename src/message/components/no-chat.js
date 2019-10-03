import React from 'react';
import { Image } from 'react-native';
import { View, Text } from 'native-base';

import common from '../../styles/common';

const EmptyImage = require('../images/empty-chat.png');

const EmptyChat = () => (
    <View style={[common.pt20]}>
        <Image
            style={{ width: null, height: 200 }}
            resizeMethod="resize"
            resizeMode="contain"
            source={EmptyImage}
        />
        <Text style={[common.pt40, common.fontBold, common.textCenter]}>NO MESSAGES AT THE MOMENT.</Text>
        <Text style={[common.pt10, common.textCenter]}>You can send/receive messages with travelers about your parcel and senders about their parcels from this page.</Text>
    </View>
);

export default EmptyChat;