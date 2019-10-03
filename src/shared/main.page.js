import React from "react";
import { createStackNavigator } from "react-navigation";

import TabsPage from './tabs.page';
import AuthPage from '../auth/main.page';
import CityFinderPage from './city-finder.page';

export default createStackNavigator({
    TabStack: {
        screen: TabsPage,
    },
    CityFinderStack: {
        screen: CityFinderPage,
    },
    AuthStack: {
        screen: AuthPage,
    },
}, {
    headerMode: 'none',
});