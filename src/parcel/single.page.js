import React from "react";
import format from 'date-fns/format';
import Dialog from "react-native-dialog";
import { withTracker } from 'react-native-meteor';
import { StyleSheet, Dimensions } from 'react-native';
import { View, Icon, Text, Button, Container, Spinner, Content, Grid, Row, Col, Card, CardItem, Body, Thumbnail } from "native-base";

import TripMap from "../trip/components/map";
import UserAvatar from "../user/components/avatar";

import { subscribeToTrip, getTrip } from "../trip/data/api";
import { getParcel, subscribeToParcel } from "./data/api";
import { getUser } from "../user/data/api";
import common from "../styles/common";
import colors from "../styles/colors";

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    section: {
        borderBottomColor: colors.primary,
        borderBottomWidth: 2,
        ...common.mb10,
    },
    offerButton: { position: 'absolute', bottom: 0, width },
    backButton: { position: 'absolute', zIndex: 99999 },
});

class ParcelSingle extends React.Component {
    state = {
        showOfferPrompt: false,
    };

    renderOfferPrompt = () => {
        return (
            <Dialog.Container visible={this.state.showOfferPrompt}>
                <Dialog.Title>Make An Offer</Dialog.Title>
                <Dialog.Description>
                    You can request the traveler to carry your package by specifying your package size, weight and an amount of money. However, the traveler has full right to accept or reject your offer.
                </Dialog.Description>

                <Dialog.Input label="Amount"/>

                <Dialog.Button label="Cancel" onPress={() => this.setState({ showOfferPrompt: false })} />
                <Dialog.Button label="Send Offer" onPress={() => this.setState({ showOfferPrompt: false })} />
            </Dialog.Container>
        );
    }

    render () {
        const { parcel, user, parcelLoading, trip, canBook, navigation } = this.props;
        
        if (parcelLoading)
            return <Spinner />;

        return (
            <Container>
                { this.renderOfferPrompt() }
                <Content>
                    <Button
                        dark
                        transparent
                        onPress={() => navigation.goBack()}
                        style={ styles.backButton }>
                        <Icon name="arrow-left"/>
                    </Button>

                    <TripMap 
                        trip={trip} 
                        style={{ height: height / 2 }}/>

                    <View style={[common.pb40]}>
                        <Card noShadow>
                            <CardItem style={[common.pl10, common.pr10, styles.section]}>
                                <Grid>
                                    {user && (
                                        <Row>
                                            <Col size={1}>
                                                <UserAvatar user={user} />
                                            </Col>

                                            <Col size={2.5} style={[common.pt5]}>
                                                <Text>{user.profile.name}</Text>
                                                <Text note>{user.profile.city.description}</Text>
                                            </Col>

                                            <Col size={1} style={[common.flexReverse, common.pt10]}>
                                                {canBook && (
                                                    <React.Fragment>
                                                        <Button
                                                            androidRippleColor={colors.danger}
                                                            transparent
                                                            small
                                                            dark>
                                                            <Icon name="heart" style={[common.mr10, common.ml10]}></Icon>
                                                        </Button>

                                                        <Button
                                                            onPress={() => { console.log(parcel); navigation.navigate("ParcelStackMessageChat", { parcel });}}
                                                            androidRippleColor={colors.danger}
                                                            transparent
                                                            small
                                                            dark>
                                                            <Icon name="comments" style={[common.mr10, common.ml10]}></Icon>
                                                        </Button>
                                                    </React.Fragment>
                                                )}
                                            </Col>
                                        </Row>
                                    )}
                                </Grid>
                            </CardItem>

                            <CardItem style={[common.pb5, common.pl10, common.pr10]}>
                                <Icon
                                    style={common.cardListInfoIcon}
                                    name="arrow-up" />
                                <Body>
                                    <Text>Parcel Pick Up</Text>
                                </Body>
                                <Body>
                                    <Text style={common.cardListInfoText}>
                                        {trip.to.description}
                                    </Text>
                                </Body>
                            </CardItem>
                            <CardItem style={[common.pb20, common.pl10, common.pr10]}>
                                <Icon
                                    style={common.cardListInfoIcon}
                                    name="arrow-down" />
                                <Body>
                                    <Text>Parcel Drop Off</Text>
                                </Body>
                                <Body>
                                    <Text style={common.cardListInfoText}>
                                        {trip.from.description}
                                    </Text>
                                </Body>
                            </CardItem>

                            <CardItem style={[common.pb5, common.pl10, common.pr10]}>
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
                            <CardItem style={[common.pb20, common.pl10, common.pr10, styles.section]}>
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

                            <CardItem style={[common.pb5, common.pr10, common.pl10]}>
                                <Icon
                                    style={common.cardListInfoIcon}
                                    name="cube" />
                                <Body>
                                    <Text>Available Size</Text>
                                </Body>
                                <Body>
                                    <Text style={common.cardListInfoText}>
                                        {trip.totalSpace.len}x{trip.totalSpace.width}x{trip.totalSpace.height} {trip.totalSpace.unit}
                                    </Text>
                                </Body>
                            </CardItem>
                            <CardItem style={[common.pb20, common.pr10, common.pl10]}>
                                <Icon
                                    style={common.cardListInfoIcon}
                                    name="balance-scale" />
                                <Body>
                                    <Text>Available Weight</Text>
                                </Body>
                                <Body>
                                    <Text style={common.cardListInfoText}>
                                        {trip.totalSpace.weight}KG
                                    </Text>
                                </Body>
                            </CardItem>                    
                        </Card>
                    </View>
                </Content>
                
                {!parcel ? (
                    <Button
                        info
                        full
                        style={styles.offerButton}
                        onPress={() => navigation.navigate("ParcelOffer", { trip })}>
                        <Text>MAKE AN OFFER</Text>
                    </Button>
                ) : (
                    <Button 
                        full 
                        disabled
                        style={styles.offerButton}
                        danger={parcel.isRejected}
                        success={parcel.isAccepted}
                        dark={!parcel.isRejected && !parcel.isAccepted}
                    >
                        <Text>{parcel.isAccepted ? 'Offer Accepted' : (parcel.isRejected ? 'Offer Rejected' : 'Request Pending') }</Text>
                    </Button>
                )}
            </Container>
        );
    };
};

export default withTracker((props) => {
    const { state } = props.navigation,
        trip = getTrip({ _id: state.params.parcel.tripId }),
        filters = { _id: state.params.parcel._id };

    const subParcels = subscribeToParcel(filters),
        subTrip = subscribeToTrip(trip._id),
    
        parcelLoading = !subParcels.ready(),
        parcel = parcelLoading ? null : getParcel(filters),
        user = subTrip.ready() ? getUser({_id: trip.travelerId}) : null,
        canBook = !parcel;

    return {
        parcelLoading,
        canBook,
        parcel,
        user,
        trip,
        ...props,
    };
})(ParcelSingle);