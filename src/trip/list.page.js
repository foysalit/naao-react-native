import React from "react";
import Meteor, { withTracker } from 'react-native-meteor';
import { View, Text, Container, Spinner, Content, Grid, Row, Col, Button, Icon } from "native-base";

import common from '../styles/common'; 
import colors from '../styles/colors'; 

import TripSummary from './components/summary';
import EmptyTrip from "./components/empty-trip";

import { isMyTrip } from "./data/helpers";
import { subscribeToTrips, getAllTrips, getMyTrips } from "./data/api";

export default class Trips extends React.Component {
    state = {
        favoriteOnly: false
    };

    toggleFavoriteOnly = () => {
        this.setState({ favoriteOnly: !this.state.favoriteOnly });
    };

    render () {
        const { favoriteOnly } = this.state;

        return (
            <Container>
                <Content style={[common.px10]}>
                    <Grid style={[common.pageHeaderGrid]}>
                        <Row>
                            <Col>
                                <Text style={ [common.pageHeaderText] }>
                                    { favoriteOnly ? 'Saved Trips' : 'My Trips' }
                                </Text>
                            </Col>
                            <Col style={[common.flexReverse]}>
                                <Button
                                    transparent
                                    dark={!favoriteOnly}
                                    danger={favoriteOnly}
                                    onPress={this.toggleFavoriteOnly}
                                    androidRippleColor={colors.warning}>
                                    <Icon name="heart" />
                                </Button>
                                <Button
                                    transparent
                                    dark={favoriteOnly}
                                    danger={!favoriteOnly}
                                    onPress={this.toggleFavoriteOnly}
                                    androidRippleColor={colors.warning}>
                                    <Icon name="suitcase" />
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                    
                    <ReactiveTripList 
                        favoriteOnly={favoriteOnly}
                        navigation={this.props.navigation}
                    />
                </Content>
            </Container>
        );
    };
};


const TripList = ({ trips, tripsLoading, navigation }) => {
    if (tripsLoading)
        return (<Spinner />);
    
    if (trips.length < 1) {
        return <EmptyTrip />;
    }

    return (
        <View>
            {trips.map(trip => <TripSummary
                onPress={() => navigation.push(isMyTrip(trip) ? 'TripTravelerView' : 'TripSenderView', { trip })}
                key={trip._id}
                trip={trip} />
            )}
        </View>
    );
};

const ReactiveTripList = withTracker(props => {
    const subTrips = subscribeToTrips(props.favoriteOnly),
        tripsLoading = !subTrips.ready(),
        trips = tripsLoading ? [] : (props.favoriteOnly ? getAllTrips({favoritedBy: Meteor.userId()}) : getMyTrips());

    return {
        tripsLoading,
        trips,
        ...props,
    };
})(TripList);