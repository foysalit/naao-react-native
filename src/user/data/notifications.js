import { Toast } from "native-base";
import { Platform } from "react-native";
import Meteor from "react-native-meteor";
import { Permissions, Notifications } from 'expo';

import { apiCall } from '../../shared/data/utils';

export async function registerForPushNotifications() {
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    // dont send to server if user already has this device registered
    const user = Meteor.user();
    if (user && user.expoTokens && user.expoTokens.indexOf(token) >= 0) {
        return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return apiCall('users.notification.subscribe', [token]);
};

export function unregisterFromNotification() {
    // Get the token that uniquely identifies this device
    return Notifications.getExpoPushTokenAsync()
        .then(token => apiCall('users.notification.unsubscribe', [token]))
        .catch(err => console.log('error unregistering from notifications', err));
}

export function handleInAppNotification(navigation) {
    // ios doesnt show noti when app is in foreground so we need to show a toast
    // console.log('adding push notification handler');
    Notifications.addListener((notification) => {
        // console.log('got push noti', notification);
        if (Platform.OS == 'ios') {
            Toast.show({
                text: notification.data.title,
                duration: 1000 * 15,
            });
        }

        if (notification.origin == 'selected' && notification.data.type == 'message') {
            navigation.navigate('MessageChat', { parcel: notification.data.parcel });
        }

        if (notification.origin == 'selected' && notification.data.type == 'trip') {
            navigation.navigate('TripTravelerView', { trip: notification.data.trip });
        }
    });
};