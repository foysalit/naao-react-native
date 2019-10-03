import React from 'react';
import { Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Grid, Row, Col, Text, View, Button } from 'native-base';
import Meteor, { withTracker } from "react-native-meteor";

import common from '../../styles/common';
import ParcelSummary from '../components/summary';
import HeroImage from '../../shared/images/hero-image.png';

import { getTrip } from '../../trip/data/api';
import { subscribeToParcels, getParcels } from '../data/api';

const NoCarryMessage = () => (
    <Text style={[common.fontItalic, common.pb15]}>
        You don't have any offers or upcoming parcels to be delivered. All your parcel deliveries and offers will be shown here when you post your trip on Naao and start delivering parcels.
    </Text>
);

const NoSendingMessage = () => (
    <Text style={[common.fontItalic, common.pb15]}>
        You have not made any offers yet or no one has responded to your offers. When travelers respond to your offers, your parcels will show up here for you to easily keep track of it.
    </Text>
);

class Upcoming extends React.Component {
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

    componentWillUnmount() {
        this.props.sub.stop();
    };

    render () {
        const { navigation, userId, loading, parcelsDelivering, parcelsCarrying } = this.props;

        if (loading || !userId || (parcelsCarrying.length < 1 && parcelsDelivering.length < 1)) {
            return (
                <View style={[common.pt20]}>
                    <Image
                        style={{ width: null, height: 180 }}
                        resizeMethod="resize"
                        resizeMode="contain"
                        source={HeroImage} 
                    />
                    <Text style={[common.pt40, common.fontBold, common.textCenter]}>YOUR NAAO HOME.</Text>
                    <Text style={[common.pt10, common.px15, common.textCenter]}>
                        Welcome to Naao. 
                        This is your home feed. 
                        All your recent activities and updates will be shown here at the right time.
                    </Text>
                </View>
            );
        }

        return (
            <Grid>
                <Row style={[common.px15, common.py10]}>
                    <Col>
                        <Text style={[common.fontBold, common.fs20]}>
                            Parcels For My Trips
                        </Text>
                    </Col>
                </Row>

                <Row>
                    <Col style={[common.px15]}>
                        {parcelsCarrying.length < 1 && <NoCarryMessage />}
                        {parcelsCarrying.length > 0 && parcelsCarrying.map(parcel => (
                            <ParcelSummary
                                parcel={parcel}
                                showMap={false}
                                key={parcel._id}
                                currentUserId={userId}
                                onPress={() => this.openParcel(parcel._id)}
                                showFull={this.state.openedParcel === parcel._id}
                            />
                        ))}
                    </Col>
                </Row>

                <Row style={[common.px15, common.py10]}>
                    <Col>
                        <Text style={[common.fontBold, common.fs20]}>
                            Parcels Sending
                        </Text>
                    </Col>
                </Row>

                <Row>
                    <Col style={[common.px15]}>
                        {parcelsDelivering.length < 1 && <NoSendingMessage />}
                        {parcelsDelivering.length > 0 && parcelsDelivering.map(parcel => (
                            <ParcelSummary
                                parcel={parcel}
                                showMap={false}
                                key={parcel._id}
                                showFull={false}
                                currentUserId={userId}
                                onPress={() => navigation.navigate("HomeStackTripSenderView", {trip: getTrip({_id: parcel.tripId})})}
                            />
                        ))}
                    </Col>
                </Row>
            </Grid>     
        );
    };
};

export default withNavigation(withTracker(props => {
    const userId = Meteor.userId(),
        closedQuery = { closedAt: { $exists: false } },
        sub = subscribeToParcels(closedQuery),
        loading = !sub.ready(),
        parcelsCarrying = loading ? [] : getParcels({ ...closedQuery, ownerId: { $ne: userId } }),
        parcelsDelivering = loading ? [] : getParcels({ ...closedQuery, ownerId: userId });

    return {
        userId, loading, parcelsDelivering, 
        parcelsCarrying, sub, ...props
    };
})(Upcoming));