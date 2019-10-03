import Meteor, { ReactiveDict } from "react-native-meteor";
import { AsyncStorage } from "react-native";

import colors from "../../styles/colors";

export const apiCall = (method, params) => {
    return new Promise((resolve, reject) => {
        Meteor.call(method, ...params, (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
};

const appState = new ReactiveDict();

export const getAppState = (key = '') => {
    return appState.get(key);
};

export const setAppState = (key = '', value) => {
    return appState.set(key, value);
};

export const setDarkStatusBar = () => {
    appState.set('statusBarColor', colors.background);
};

export const setLightStatusBar = () => {
    appState.set('statusBarColor', 'transparent');
};
// initially set bar to light
setLightStatusBar();

export const adjustStatusBar = (routeName) => {
    const current = getAppState('statusBarColor');

    const darkRoutes = ["Search", "AuthStack", "HomeStackTripCreate", "TripCreate", "ParcelOffer"];
    if (darkRoutes.indexOf(routeName) >= 0) {
        if (current !== colors.background)
            setDarkStatusBar();
    } else if (current !== 'transparent') {
        setLightStatusBar();
    }
};

const onboardKey = 'app.onboarded';
export const hasOnboarded = async () => {
    const val = await AsyncStorage.getItem(onboardKey);
    return !!val;
};

export const markOnboarded = async () => {
    return await AsyncStorage.setItem(onboardKey, 'true');
};