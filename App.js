import React from 'react';
import Meteor from 'react-native-meteor';
import { StyleProvider, Root } from 'native-base';

import Config from './config';
import getTheme from './native-base-theme/components';

import colors from './src/styles/colors';
import MainPage from './src/shared/main.page';
import OnboardingPage from './src/shared/onboarding.page';
import StatusBar from './src/shared/containers/status-bar';

import { handleInAppNotification } from './src/user/data/notifications';
import { setAppState, hasOnboarded, adjustStatusBar } from './src/shared/data/utils';

Meteor.connect(Config.apiUrl);
Meteor.subscribe('users.me');

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            isReady: false, 
            onboarded: false,
        };
    };

    async componentWillMount() {
        await Expo.Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'),
        });

        const onboarded = await hasOnboarded();
        this.setState({ isReady: true, onboarded });
    };

    componentDidMount() {
        handleInAppNotification();

        if (!this.state.onboarded)
            setAppState('statusBarColor', colors.background);
    };

    completeOnboarding = () => {
        setAppState('statusBarColor', 'transparent');
        this.setState({ onboarded: true });
    };

    // when page changes, based on which page we're on, we might want to change the status bar color
    handleNavigationChange(prevState, newState, action) {
        if (!action.routeName)
            return;

        adjustStatusBar(action.routeName);
    };

    render() {
        if (!this.state.isReady) {
            return <Expo.AppLoading />;
        }

        return (
            <StyleProvider style={getTheme()}>
                <Root>
                    <StatusBar />

                    { this.state.onboarded ? (
                        <MainPage onNavigationStateChange={this.handleNavigationChange}/>
                    ) : (
                        <OnboardingPage onDone={this.completeOnboarding}/>
                    ) }
                </Root>
            </StyleProvider>
        );
    };
}