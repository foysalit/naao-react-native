import React from 'react';
import { Button, Text } from 'native-base';
import { Image, Dimensions, Alert } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import colors from '../styles/colors';
import common from '../styles/common';
import { markOnboarded } from './data/utils';

const { width, height } = Dimensions.get('window');

const pages = [
    {
        backgroundColor: colors.background,
        image: <Image
            source={require('./images/create.png')}
            style={{ width: width / 1.7, height: height / 2.2 }}
        />,
        title: 'TRAVEL WITH NAAO',
        subtitle: "Make some extra 💰 on your trip by delivering parcels to anywhere in the world.",
    },
    {
        backgroundColor: colors.background,
        image: <Image
            source={require('./images/setup.png')}
            style={{ width: width / 1.7, height: height / 2.2 }}
        />,
        title: 'SEND YOUR PARCEL',
        subtitle: 'Connect with a traveler near you and send your parcel to your friends & family.',
    },
    {
        backgroundColor: colors.background,
        image: <Image
            source={require('./images/aggreement.png')}
            style={{ width: width / 1.7, height: height / 2.2 }}
        />,
        title: 'CONVENIENT ARRANGEMENTS',
        subtitle: "Make and receive offers and workout suitable arrangements without ever leaving the app.",
    },
    {
        backgroundColor: colors.background,
        image: <Image
            source={require('./images/updates.png')}
            style={{ width: width / 1.7, height: height / 2.2 }}
        />,
        title: 'STAY UPDATED',
        subtitle: "Send and receive live updates from your sender/traveler in real time.",
    },
    {
        backgroundColor: colors.background,
        image: <Image
            source={require('./images/messages.png')}
            style={{ width: width / 1.7, height: height / 2.2 }}
        />,
        title: 'KEEP IN TOUCH',
        subtitle: "No need to exchange phone numbers, You can chat in realtime from right within the Naao app.",
    },
];

const DoneButton = ({ isLight, ...props }) => (
    <Button transparent danger small full style={{ justifyContent: "flex-end" }} {...props}>
        <Text>LET'S GO</Text>
    </Button>
);

const NextButton = ({ nextLabel, ...props }) => (
    <Button transparent success small full style={{ justifyContent: "flex-end" }} {...props}>
        <Text>{ nextLabel }</Text>
    </Button>
);

const SkipButton = ({ skipLabel, ...props }) => (
    <Button transparent primary small full style={{ justifyContent: "flex-start" }} {...props}>
        <Text>{ skipLabel }</Text>
    </Button>
);

const confirmSkip = (onDone) => {
    Alert.alert(
        "Savvy user, Eh?",
        "We built Naao to be super intuitive and easy to use. However, reading through these intro steps would help you get a better understanding of the Naao platform.",
        [
            { text: 'Cancel', type: 'cancel' },
            { text: 'Skip Intro', onPress: () => markOnboarded().then(onDone) }, 
        ]
    );
};

const OnboardingPage = ({ onDone }) => (
    <Onboarding
        pages={pages}
        skipLabel="SKIP"
        nextLabel="NEXT"
        bottomBarHeight={40}
        bottomBarHighlight={false}
        DoneButtonComponent={DoneButton}
        NextButtonComponent={NextButton}
        SkipButtonComponent={SkipButton}
        onSkip={() => confirmSkip(onDone)}
        subTitleStyles={{ ...common.textPrimary }}
        onDone={() => markOnboarded().then(onDone)}
        titleStyles={{ ...common.textDanger, ...common.fs15, ...common.fontBold }}
        flatlistProps={{ snapToInterval: width, snapToAlignment: 'center', decelerationRate: 0 }}
    />
);

export default OnboardingPage;