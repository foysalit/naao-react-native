import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { StyleSheet } from 'react-native';
import { Card, CardItem, Text, Icon, Body, Button, Grid, Row, Col } from 'native-base';

import common from '../../styles/common';
import colors from '../../styles/colors';

import TripMap from './map';
import UserAvatar from '../../user/components/avatar';

import { favoriteTrip } from '../data/api';
import { getUser } from '../../user/data/api';
import { isMyTrip, isFavoriteTrip } from '../data/helpers';

const styles = StyleSheet.create({
    user: { 
        ...common.py15, 
        ...common.mb10, 
        ...common.pl10,
        ...common.pr10,
        borderBottomWidth: 2, 
        borderBottomColor: colors.primary 
    },
});

class TripSummary extends React.Component {
    static defaultProps = {
        trip:  {},
        showMap: true,
        onPress: () => {}
    };

    render () {
        const { trip, showMap } = this.props;
        const user = getUser(trip.travelerId),
            tripIsMine = isMyTrip(trip),
            space = tripIsMine ? trip.totalSpace : trip.availableSpace,
            isFavorite = isFavoriteTrip(trip);

        return (
            <Card style={[common.mb15]}>
                {showMap && (
                    <CardItem cardBody>
                        <TripMap trip={trip}/>
                    </CardItem>
                )}

                <CardItem 
                    button
                    style={[styles.user]} 
                    onPress={this.props.onPress}
                >
                    <Grid>
                        <Row>
                            <Col size={1}>
                                <UserAvatar user={user} />
                            </Col>

                            <Col size={!tripIsMine ? 2.5 : 3} style={[common.pt5]}>
                                <Text>{user.profile.name}</Text>
                                <Text note>{user.profile.city.description}</Text>
                            </Col>

                            {!tripIsMine && (
                                <Col size={1} style={[common.flexReverse, common.pt10]}>
                                    <Button
                                        androidRippleColor={colors.danger}
                                        onPress={() => favoriteTrip(trip)}
                                        danger={isFavorite}
                                        dark={!isFavorite}
                                        transparent
                                        small>
                                        <Icon name="heart" style={[common.mr10, common.ml10]}></Icon>
                                    </Button>
                                    <Button
                                        androidRippleColor={colors.danger}
                                        transparent
                                        small
                                        dark>
                                        <Icon name="comments" style={[common.mr10, common.ml10]}></Icon>
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Grid>
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
                            { format(trip.collectBy, 'DD MMM, YYYY') }
                        </Text>
                    </Body>
                </CardItem>
                <CardItem style={[common.pb5]}>
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
                <CardItem style={[common.pb5]}>
                    <Icon
                        style={common.cardListInfoIcon}
                        name="cube" />
                    <Body>
                        <Text>{tripIsMine ? 'Max' : 'Available'} Size</Text>
                    </Body>
                    <Body>
                        <Text style={common.cardListInfoText}>
                            {space.len}x{space.width}x{space.height} {space.unit}
                        </Text>
                    </Body>
                </CardItem>
                <CardItem style={[common.pb25]}>
                    <Icon
                        style={common.cardListInfoIcon}
                        name="balance-scale" />
                    <Body>
                        <Text>{tripIsMine ? 'Max' : 'Available'} Weight</Text>
                    </Body>
                    <Body>
                        <Text style={common.cardListInfoText}>
                            {space.weight}KG
                        </Text>
                    </Body>
                </CardItem>
            </Card>
        );
    };
};

TripSummary.propTypes = {
    showMap: PropTypes.bool,
    trip: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default TripSummary;