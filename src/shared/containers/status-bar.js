import React from 'react';
import { Constants } from 'expo';
import { View } from 'native-base';
import { withTracker } from 'react-native-meteor';
import { StyleSheet, StatusBar } from 'react-native';

import { getAppState } from '../data/utils';

const styles = StyleSheet.create({
    statusBar: {
        height: Constants.statusBarHeight,
    },
});

const Bar = ({ backgroundColor }) => {
    const barStyle = (backgroundColor == 'transparent') ? 'dark-content' : 'light-content';
    // console.log({barStyle, backgroundColor})

    return (
        <View style={[styles.statusBar, { backgroundColor }]}>
            <StatusBar 
                translucent
                barStyle={barStyle}
                backgroundColor={backgroundColor}
            />
        </View>
    );
};

export default withTracker(props => {
    const backgroundColor = getAppState('statusBarColor') || 'transparent';

    return {
        backgroundColor
    };
})(Bar);