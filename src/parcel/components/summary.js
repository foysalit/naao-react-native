import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { Card, CardItem, Text, Icon, Body, Button, Grid, Row, Col } from 'native-base';

import common from '../../styles/common';
import colors from '../../styles/colors';

import TravelerActions from '../containers/traveler-actions';
import UserAvatar from '../../user/components/avatar';
import ParcelMap from '../../trip/components/map';
import StatusButton from './status-button';
import ParcelReview from './review';

import { getUser } from '../../user/data/api';
import { getTrip } from '../../trip/data/api';

class ParcelSummary extends React.Component {
    static defaultProps = {
        parcel: {},
        showMap: true,
        showFull: false,
        onPress: () => { }
    };

    map = null;

    mapDrawn = () => {
        this.map.fitToElements(true);
    };

    openMessage = () => {
        const { parcel, navigation } = this.props;
        let page = "MessageChat";
        
        if (navigation.state.routeName.indexOf("Parcel") === 0)
            page = "ParcelStackMessageChat"

        if (navigation.state.routeName.indexOf("Trip") === 0)
            page = "TripStackMessageChat";

        if (navigation.state.routeName.indexOf("Home") === 0)
            page = "HomeStackMessageChat";
        
        return navigation.navigate(page, { parcel });
    };

    render() {
        const { parcel, showMap, showFull, currentUserId, navigation } = this.props;
        const isTraveler = currentUserId === parcel.travelerId,
            user = getUser(isTraveler ? parcel.ownerId : parcel.travelerId),
            trip = getTrip(parcel.tripId);

        return (
            <Card style={[common.mb15]}>
                {showMap && (
                    <CardItem cardBody>
                        <ParcelMap trip={trip} />
                    </CardItem>
                )}

                <CardItem
                    button
                    onPress={this.props.onPress}
                    style={[common.py15, common.mb10, common.pl10, common.pr10, showFull && common.borderedSection]}
                >
                    <Grid>
                        <Row>
                            <Col size={1}>
                                <UserAvatar user={user} />
                            </Col>

                            <Col size={2.5} style={[common.pt5]}>
                                <Text>{user.profile.name}</Text>
                                { trip && (
                                    <React.Fragment>
                                        <Text note numberOfLines={1}>{trip.from.description}</Text>
                                        <Text note numberOfLines={1}>{trip.to.description}</Text>
                                    </React.Fragment>
                                )}
                            </Col>

                            <Col size={1} style={[common.flexReverse, common.pt10]}>
                                <StatusButton parcel={parcel}/>
                                <Button
                                    androidRippleColor={colors.danger}
                                    onPress={this.openMessage}
                                    transparent
                                    small
                                    dark>
                                    <Icon name="comments" style={[common.mr10, common.ml10]}></Icon>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </CardItem>

                {showFull && (<React.Fragment> 
                    { !!parcel.counterOffer && (   
                        <CardItem style={[common.pb5]}>
                            <Icon
                                style={common.cardListInfoIcon}
                                name="money" />
                            <Body>
                                <Text>Counter Offer</Text>
                            </Body>
                            <Body>
                                <Text style={common.cardListInfoText}>
                                    {parcel.counterOffer} {parcel.currency}
                                </Text>
                            </Body>
                        </CardItem>
                    )}
                    
                    <CardItem style={[common.pb5]}>
                        <Icon
                            style={common.cardListInfoIcon}
                            name="money" />
                        <Body>
                            <Text>Offer</Text>
                        </Body>
                        <Body>
                            <Text style={common.cardListInfoText}>
                                {parcel.offer} {parcel.currency}
                            </Text>
                        </Body>
                    </CardItem>
                    
                    <CardItem style={[common.pb5]}>
                        <Icon
                            style={common.cardListInfoIcon}
                            name="cube" />
                        <Body>
                            <Text>Size</Text>
                        </Body>
                        <Body>
                            <Text style={common.cardListInfoText}>
                                {parcel.size.len}x{parcel.size.width}x{parcel.size.height} {parcel.size.unit}
                            </Text>
                        </Body>
                    </CardItem>
                    
                    <CardItem style={[common.pb15, common.mb10, common.borderedSection]}>
                        <Icon
                            style={common.cardListInfoIcon}
                            name="balance-scale" />
                        <Body>
                            <Text>Weight</Text>
                        </Body>
                        <Body>
                            <Text style={common.cardListInfoText}>
                                {parcel.size.weight}KG
                            </Text>
                        </Body>
                    </CardItem>
                    
                    <CardItem style={parcel.deliveredAt ? [common.pb15, common.mb10, common.borderedSection] : []}>
                        <Grid>
                            <Row>
                                <Text style={[common.fontBold, common.pb5]}>
                                    Parcel Content
                                </Text>
                            </Row>
                            <Row>
                                <Text style={[common.pb10]}>
                                    { parcel.content || 'Content not specified.' }
                                </Text>
                            </Row>
                            {parcel.note && parcel.note.length > 0 && (
                                <React.Fragment>
                                    <Row>
                                        <Text style={[common.fontBold, common.pb5]}>
                                            Additional Note
                                        </Text>
                                    </Row>
                                
                                    <Row>
                                        <Text style={[common.pb10]}>
                                            { parcel.note }
                                        </Text>
                                    </Row>
                                </React.Fragment>
                            )}
                        </Grid>
                    </CardItem>

                    <ParcelReview parcel={parcel} style={[ common.px15 ]} />

                    <TravelerActions parcel={parcel}/> 
                </React.Fragment>)}
            </Card>
        );
    };
};

ParcelSummary.propTypes = {
    showMap: PropTypes.bool,
    showFull: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    parcel: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    currentUserId: PropTypes.string.isRequired,
};

export default withNavigation(ParcelSummary);