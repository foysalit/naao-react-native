import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import { View, Text, Button } from 'native-base';

import common from '../../styles/common';

const EmptyImage = require('../images/empty-profile.png');

const EmptyUser = ({ onLoginPress }) => (
    <View style={[common.pt20]}>
        <Image
            style={{ width: null, height: 180 }}
            resizeMethod="resize"
            resizeMode="contain"
            source={EmptyImage}
        />
        <Text style={[common.pt40, common.fontBold, common.textCenter]}>NOT LOGGED IN.</Text>
        <Text style={[common.pt10, common.textCenter]}>Please make an account or login to start using Naao at its fullest.</Text>

        <View style={[common.px25, common.pt20]}>
            <Button
                onPress={onLoginPress}
                rounded
                info
                block>
                <Text>SIGN IN</Text>
            </Button>
        </View>    
    </View>
);

EmptyUser.propTypes = {
    onLoginPress: PropTypes.func.isRequired,
};

export default EmptyUser;