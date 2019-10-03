import React from "react";
import { Platform } from "react-native";
import { Button, Text, Icon, Footer, FooterTab } from "native-base";
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import HomePage from "./home.page";
import CurrencyPage from "./currency.page";
import SearchPage from "../search/main.page";
import TripListPage from "../trip/list.page";
import ProfilePage from "../user/profile.page";
import ProfileEditPage from "../user/edit.page";
import TripCreatePage from "../trip/create.page";
import ParcelListPage from "../parcel/list.page";
import MessageListPage from "../message/list.page";
import MessageChatPage from "../message/chat.page";
import ParcelOfferPage from "../parcel/offer.page";
import SearchResultPage from "../search/result.page";
import ParcelSinglePage from "../parcel/single.page";
import TripSenderViewPage from "../trip/sender-view.page";
import TripTravelerViewPage from "../trip/traveler-view.page";

import Common from "../styles/common";

const TripStack = createStackNavigator({
    TripList: {
        screen: TripListPage
    },
    TripTravelerView: {
        screen: TripTravelerViewPage
    },
    TripSenderView: {
        screen: TripSenderViewPage
    },
    TripCreate: {
        screen: TripCreatePage
    },
    TripStackMessageChat: {
        screen: MessageChatPage,
    },
}, {
    headerMode: 'none',
});

const ParcelStack = createStackNavigator({
    ParcelList: {
        screen: ParcelListPage
    },
    ParcelSingle: {
        screen: ParcelSinglePage
    },
    ParcelOffer: {
        screen: ParcelOfferPage
    },
    ParcelStackTripSenderView: {
        screen: TripSenderViewPage,
    },
    ParcelStackMessageChat: {
        screen: MessageChatPage,
    },
    ParcelStackCurrency: {
        screen: CurrencyPage,
    },
}, {
    headerMode: 'none',
});

const MessageStack = createStackNavigator({
    MessageList: {
        screen: MessageListPage
    },
    MessageChat: {
        screen: MessageChatPage
    },
    MessageStackTripSenderView: {
        screen: TripSenderViewPage
    },
    MessageStackTripSenderView: {
        screen: TripSenderViewPage
    },
}, {
    headerMode: 'none',
});

const HomeStack = createStackNavigator({
    Home: {
        screen: HomePage
    },
    Search: {
        screen: SearchPage,
    },
    SearchResult: {
        screen: SearchResultPage,
    },
    HomeStackTripCreate: {
        screen: TripCreatePage
    },
    HomeStackTripTravelerView: {
        screen: TripTravelerViewPage,
    },
    HomeStackTripSenderView: {
        screen: TripSenderViewPage,
    },
    HomeStackMessageChat: {
        screen: MessageChatPage,
    },
}, {
    headerMode: 'none',
});

const ProfileStack = createStackNavigator({
    ProfilePage: { screen: ProfilePage },
    ProfileEditPage: { screen: ProfileEditPage },
}, {
    headerMode: 'none',
});

const hideTabBar = ({ navigation }) => {
    const tablessPages = [
            "Search", "ProfileEditPage",
            "ParcelSingle", "ParcelOffer", 
            "MessageChat", "HomeStackMessageChat", "ParcelStackMessageChat", "TripStackMessageChat", 
            "TripSenderView", "HomeStackTripSenderView", "ParcelStackTripSenderView", "MessageStackTripSenderView", 
        ],
        currentPage = navigation.state.routes[navigation.state.index].routeName;
    
    // console.log({currentPage});
    let tabBarVisible = true;
    if (tablessPages.includes(currentPage)) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
    }
};

MessageStack.navigationOptions = hideTabBar;
ProfileStack.navigationOptions = hideTabBar;
ParcelStack.navigationOptions = hideTabBar;
TripStack.navigationOptions = hideTabBar;
HomeStack.navigationOptions = hideTabBar;

const pageMap = [
{
    icon: 'home',
    text: 'HOME',
    name: 'HomeStack',
}, 
{
    icon: 'cube',
    text: 'PARCEL',
    name: 'ParcelStack',
}, 
{
    icon: 'suitcase',
    text: 'TRIPS',
    name: 'TripStack',
}, 
{
    icon: 'comments',
    text: 'CHAT',
    name: 'MessageStack',
}, 
{
    icon: 'user-circle',
    text: 'PROFILE',
    name: 'ProfileStack',
}
];

export default createBottomTabNavigator({
    HomeStack: { screen: HomeStack },
    ParcelStack: { screen: ParcelStack },
    TripStack: { screen: TripStack },
    MessageStack: { screen: MessageStack },
    ProfileStack: { screen: ProfileStack },
}, {
    tabBarPosition: "bottom",
    tabBarComponent: props => {
        let textStyle = [Common.fontBold];

        if (Platform.OS === 'ios') {
            textStyle.push(Common.pl10, Common.pr10);
        }

        return (
            <Footer>
                <FooterTab>
                    {pageMap.map((page, i) => {
                        const isActive = props.navigation.state.index === i;

                        return (
                            <Button
                                vertical
                                key={page.name}
                                active={isActive}
                                onPress={() => props.navigation.navigate(page.name)}
                            >
                                <Icon name={page.icon} />
                                <Text style={textStyle}>{page.text}</Text>
                            </Button>
                        );
                    })}
                </FooterTab>
            </Footer>
        );
    }
});