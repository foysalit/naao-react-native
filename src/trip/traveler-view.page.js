import React from "react";
import format from 'date-fns/format';
import { Dimensions } from 'react-native';
import Meteor, { withTracker } from 'react-native-meteor';
import { View, Icon, Text, Button, Container, Spinner, Content, Grid, Row, Col, Card, CardItem, Body } from "native-base";

import ParcelSummary from '../parcel/components/summary';
import SpaceMeter from './components/space-meter';
import TripMap from "./components/map";
import common from "../styles/common";

import { getAllParcels } from "../parcel/data/api";
import { getTrip, subscribeToTrip } from "./data/api";

const { height } = Dimensions.get('window');

const cardTitleStyle = [common.pl10, common.py10, common.textSuccess, common.fontBold, {fontSize: 13}];

class TravelerView extends React.Component {
    state = {
        openedParcel: null,
    };

    openParcel = (parcelId) => {
        if (this.state.openedParcel === parcelId) {
            this.setState({ openedParcel: null });
        } else {
            this.setState({ openedParcel: parcelId });
        }
    };

    render () {
        const { trip, tripLoading, parcels, navigation, userId } = this.props;
        
        if (tripLoading)
            return <Spinner />;

        return (
            <Container>
                <Content>
                    <Button
                        dark
                        transparent
                        onPress={() => navigation.goBack()}
                        style={{ position: 'absolute', zIndex: 99999 }}>
                        <Icon name="arrow-left"/>
                    </Button>

                    <TripMap 
                        trip={trip} 
                        style={{ height: height / 2 }}
                    />

                    <View style={[common.px10]}>
                        <SpaceMeter {...trip}/>

                        <Text style={cardTitleStyle}>TRIP INFO</Text>

                        <Card>
                            <CardItem style={[common.pb5]}>
                                <Icon
                                    style={common.cardListInfoIcon}
                                    name="arrow-up" />
                                <Body>
                                    <Text>Pick Up</Text>
                                </Body>
                                <Body>
                                    <Text style={common.cardListInfoText} numberOfLines={1}>
                                        {trip.from.description}
                                    </Text>
                                </Body>
                            </CardItem>
                            <CardItem style={[common.pb10]}>
                                <Icon
                                    style={common.cardListInfoIcon}
                                    name="arrow-down" />
                                <Body>
                                    <Text>Drop Off</Text>
                                </Body>
                                <Body>
                                    <Text style={common.cardListInfoText} numberOfLines={1}>
                                        {trip.to.description}
                                    </Text>
                                </Body>
                            </CardItem>
                            <CardItem style={[common.pb5]}>
                                <Icon
                                    style={common.cardListInfoIcon}
                                    name="calendar-plus-o" />
                                <Body>
                                    <Text>Collection By</Text>
                                </Body>
                                <Body>
                                    <Text style={common.cardListInfoText}>
                                        {format(trip.collectBy, 'DD MMM, YYYY')}
                                    </Text>
                                </Body>
                            </CardItem>
                            <CardItem style={[common.pb15]}>
                                <Icon
                                    style={common.cardListInfoIcon}
                                    name="calendar-check-o" />
                                <Body>
                                    <Text>Delivery By</Text>
                                </Body>
                                <Body>
                                    <Text style={common.cardListInfoText}>
                                        {format(trip.deliveryBy, 'DD MMM, YYYY')}
                                    </Text>
                                </Body>
                            </CardItem>
                        </Card>

                        <Text style={cardTitleStyle}>SENDERS</Text>

                        {parcels.length > 0 ? parcels.map(parcel => (
                            <ParcelSummary 
                                parcel={ parcel }
                                showMap={ false }
                                key={ parcel._id }
                                currentUserId={ userId }
                                onPress={ () => this.openParcel(parcel._id) }
                                showFull={ this.state.openedParcel === parcel._id }
                            />
                        )) : (
                            <Text style={[common.fontItalic, common.px10, common.pb15]}>
                                You haven't gotten any offers from any senders yet. As soon as anyone makes an offer to send a parcel with you, it will appear here. Keep an eye on it.
                            </Text>
                        )}
                    </View>
                </Content>
            </Container>
        );
    };
};

export default withTracker((props) => {
    const { state } = props.navigation,
        userId = Meteor.userId(),
        subTrips = subscribeToTrip(state.params.trip._id),
        tripLoading = !subTrips.ready(),
        trip = tripLoading ? null : getTrip({ _id: state.params.trip._id }),
        parcels = tripLoading ? [] : getAllParcels({ tripId: trip._id });

    return {
        tripLoading,
        parcels,
        userId,
        trip,
        ...props,
    };
})(TravelerView);