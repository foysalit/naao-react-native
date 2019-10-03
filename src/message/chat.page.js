import React from "react";
import { Alert } from "react-native";
import Meteor, { withTracker } from "react-native-meteor";
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat'
import { Container, Header, Left, Button, Icon, Body, Title, Right } from "native-base";

import colors from "../styles/colors";
import common from "../styles/common";

import { sendMessage, getFormattedMessages } from "./data/api";
import { apiCall } from "../shared/data/utils";
import { getProfilePic } from "../images/api";
import { getUser } from "../user/data/api";
import { getTrip } from "../trip/data/api";

class Chat extends React.Component {
    componentWillMount () {
        apiCall('users.messaging.state', [true])
            .then(() => console.log('user messaging'))
            .catch(err => console.log('error setting messaging status', err));
    };

    componentWillUnmount () {
        apiCall('users.messaging.state', [false])
            .then(() => console.log('user not messaging'))
            .catch(err => console.log('error setting messaging status', err));
    };

    showStatusHint = () => {
        const { receiver } = this.props;
        Alert.alert(
            'User Status', 
            `When the pulse is green, you know ${receiver.profile.name} is online and naturally, red means offline.`,
            [{ text: 'Got It', style: 'cancel', onPress: () => null }]
        );
    };

    showInfo = () => {
        const { trip, navigation, isOwner } = this.props;
        let route = isOwner ? 'TripSenderView' : 'TripTravelerView';

        if (navigation.state.routeName.indexOf('HomeStack') === 0) {
            route = 'HomeStack'+ route;
        } else if (navigation.state.routeName.indexOf('ParcelStack') === 0) {
            route = 'HomeStack' + route;
        } else {
            route = 'MessageStack'+ route;
        }

        return this.props.navigation.navigate(route, { trip });
    };

    renderSend (props) {
        return (
            <Send {...props} label="Send" textStyle={{ color: colors.dark }}></Send>
        );
    };

    renderBubble (props) {
        return (
            <Bubble
                {...props}
                textStyle={{
                    left: {
                        color: colors.primary,
                    },
                    right: {
                        color: colors.primary,
                    }
                }}
                wrapperStyle={{
                    left: {
                        backgroundColor: colors.dark,
                    },
                    right: {
                        backgroundColor: colors.info,
                    }
                }}
            />
        );
    };

    render () {
        const { parcel, user, messages, receiver, navigation } = this.props;

        return (
            <Container>
                <Header transparent>
                    <Left>
                        <Button
                            dark
                            transparent
                            onPress={() => navigation.goBack()}>
                            <Icon name="arrow-left" />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={[common.textDark]}>
                            { receiver.profile.name }
                        </Title>
                    </Body>
                    <Right>
                        <Button
                            dark
                            small
                            transparent
                            onPress={this.showInfo}>
                            <Icon name="info-circle" style={{ fontSize: 20 }} />
                        </Button>
                        <Button
                            small
                            transparent
                            onPress={this.showStatusHint}
                            success={receiver.isMessaging}
                            danger={!receiver.isMessaging}>
                            <Icon name="signal" style={{ fontSize: 20 }} />
                        </Button>
                    </Right>
                </Header>

                <GiftedChat
                    user={user}
                    messages={messages}
                    renderSend={this.renderSend}
                    renderBubble={this.renderBubble}
                    onSend={(msgs) => sendMessage(parcel._id, msgs)} />
            </Container>
        );
    };
};

const MessageChatPage = withTracker(props => {
    const { parcel } = props.navigation.state.params;

    const messageSub = Meteor.subscribe('messages.list', {parcelId: parcel._id}),
        messagesReady = messageSub.ready(),
        messages = messagesReady ? getFormattedMessages(parcel._id) : [];

    const user = Meteor.user(), 
        // if the current user is the owner, then the receiver must be the traveler
        // otherwise the receiver of this chat must be the sender of the parcel
        isOwner = parcel.ownerId === user._id,
        trip = getTrip({_id: parcel.tripId}),
        receiver = getUser({ _id: isOwner ? parcel.travelerId : parcel.ownerId });
    
    return {
        user: {_id: user._id, name: user.profile.name, avatar: getProfilePic(user)}, 
        messagesReady, messages, parcel, receiver, isOwner, trip,
        ...props,
    };
})(Chat);

export default MessageChatPage;