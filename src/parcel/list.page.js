import React from "react";
import Meteor, { withTracker } from 'react-native-meteor';
import { Text, Container, Spinner, Content, Grid, Row, Col } from "native-base";

import common from '../styles/common'; 

import ParcelSummary from './components/summary';
import EmptyParcel from "./components/empty-parcel";

import { getParcels, subscribeToParcels } from "./data/api";
import { getTrip } from "../trip/data/api";

const Parcels = ({ parcels, parcelsLoading, navigation, userId }) => (
    <Container>
        <Content style={[common.px10]}>
            <Grid style={[common.pageHeaderGrid]}>
                <Row>
                    <Col>
                        <Text style={ [common.pageHeaderText] }>
                            My Parcels
                        </Text>
                    </Col>
                </Row>
            </Grid>
            {parcelsLoading
                ? <Spinner />
                : parcels.length > 0 ? parcels.map(parcel => <ParcelSummary 
                    onPress={() => navigation.navigate('ParcelStackTripSenderView', { trip: getTrip(parcel.tripId) })}
                    currentUserId={userId}
                    key={parcel._id} 
                    parcel={parcel} />
                ) : <EmptyParcel onSearchPress={() => navigation.navigate('Search')}/>
            }
        </Content>
    </Container>
);

export default withTracker(props => {
    const userId = Meteor.userId(),
        subTrips = subscribeToParcels(),
        parcelsLoading = !subTrips.ready(),
        parcels = parcelsLoading ? [] : getParcels({ ownerId: userId });

    // console.log({ parcels, parcelsLoading });
    return {
        parcelsLoading,
        parcels,
        userId,
        ...props,
    };
})(Parcels);