import React from "react";
import format from 'date-fns/format';
import Meteor, { withTracker } from 'react-native-meteor';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import { View, Icon, Text, Button, Container, Spinner, Content, Grid, Row, Col, Card, CardItem, Body, Thumbnail } from "native-base";

import TripMap from "./components/map";
import UserAvatar from '../user/components/avatar';
import ParcelReview from '../parcel/components/review';
import SenderActions from "./containers/sender-actions";

import { getParcel, subscribeToParcel } from "../parcel/data/api";
import { getUser } from "../user/data/api";

import common from "../styles/common";
import colors from "../styles/colors";

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
    section: {
        borderBottomColor: colors.primary,
        borderBottomWidth: 2,
        ...common.mb10,
    },
    backButton: { position: 'absolute', zIndex: 99999 },
});

const SizeForSender = ({ parcel, trip }) => {
    const hasParcel = parcel && parcel._id,
        size = hasParcel ? parcel.size : trip.availableSpace;

    return (
        <React.Fragment>
            {hasParcel && (
                <React.Fragment>

                    { !!parcel.counterOffer && (
                        <CardItem style={[common.pb5, common.pr10, common.pl10]}>
                            <Icon
                                style={common.cardListInfoIcon}
                                name="money" />
                            <Body>
                                <Text>Counter Offer</Text>
                            </Body>
                            <Body>
                                <Text style={common.cardListInfoText}>
                                    { parcel.counterOffer } {parcel.currency}
                                </Text>
                            </Body>
                        </CardItem>
                    ) }

                    <CardItem style={[common.pb5, common.pr10, common.pl10]}>
                        <Icon
                            style={common.cardListInfoIcon}
                            name="money" />
                        <Body>
                            <Text>Offer</Text>
                        </Body>
                        <Body>
                            <Text style={common.cardListInfoText}>
                                { parcel.offer } { parcel.currency }
                            </Text>
                        </Body>
                    </CardItem>
                </React.Fragment>
            )}

            <CardItem style={[common.pb5, common.pr10, common.pl10]}>
                <Icon
                    style={common.cardListInfoIcon}
                    name="cube" />
                <Body>
                    <Text>{!hasParcel ? 'Available Space' : 'Size'}</Text>
                </Body>
                <Body>
                    <Text style={common.cardListInfoText}>
                        {size.len}x{size.width}x{size.height} {size.unit}
                    </Text>
                </Body>
            </CardItem>
            <CardItem style={[common.pb20, common.pr10, common.pl10]}>
                <Icon
                    style={common.cardListInfoIcon}
                    name="balance-scale" />
                <Body>
                    <Text>{!hasParcel && 'Available '}Weight</Text>
                </Body>
                <Body>
                    <Text style={common.cardListInfoText}>
                        {size.weight}KG
                    </Text>
                </Body>
            </CardItem>
        </React.Fragment>
    );
};

class SenderView extends React.Component {
    openMessages = () => {
        const { parcel, navigation } = this.props;

        if (parcel) {
            const page = navigation.state.routeName.indexOf("ParcelStack") === 0 ? "ParcelStackMessageChat" : "TripStackMessageChat";
            return navigation.navigate(page, {parcel});
        }

        Alert.alert("Make an offer first", "For better privacy, you can only message travelers after making an offer.");
    };

    render () {
        const { parcel, user, parcelLoading, trip, navigation } = this.props;
        
        if (parcelLoading)
            return <Spinner />;

        return (
            <Container>
                <Content>
                    <Button
                        dark
                        transparent
                        onPress={() => navigation.goBack(null)}
                        style={ styles.backButton }>
                        <Icon name="arrow-left"/>
                    </Button>

                    <TripMap 
                        trip={trip} 
                        style={{ height: height / 2 }}
                    />

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

                                            {parcel && (
                                                <Col size={1} style={[common.flexReverse, common.pt10]}>
                                                    <Button
                                                        androidRippleColor={colors.danger}
                                                        transparent
                                                        small
                                                        dark>
                                                        <Icon name="heart" style={[common.mr10, common.ml10]}></Icon>
                                                    </Button>
                                                    <Button
                                                        onPress={this.openMessages}
                                                        androidRippleColor={colors.danger}
                                                        transparent
                                                        small
                                                        dark>
                                                        <Icon name="comments" style={[common.mr10, common.ml10]}></Icon>
                                                    </Button>
                                                </Col>
                                            )}
                                        </Row>
                                    )}
                                </Grid>
                            </CardItem>

                            {parcel && <ParcelReview parcel={parcel} style={[common.pb15, common.mb10, common.px15, styles.section]} />}

                            <CardItem style={[common.pb5, common.pl10, common.pr10]}>
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
                            <CardItem style={[common.pb20, common.pl10, common.pr10]}>
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
                            
                            <SizeForSender trip={trip} parcel={parcel}/>
                        </Card>
                    </View>
                </Content>

                <SenderActions trip={trip} parcel={parcel} />
            </Container>
        );
    };
};

export default withTracker((props) => {
    const { state } = props.navigation,
        { trip } = state.params,
        filters = { tripId: trip._id, ownerId: Meteor.userId() };

    const subParcels = subscribeToParcel(filters),
        parcelLoading = !subParcels.ready(),
        parcel = parcelLoading ? null : getParcel(filters),
        user = getUser({ _id: trip.travelerId });

    return {
        parcelLoading,
        parcel,
        trip,
        user,
        ...props,
    };
})(SenderView);