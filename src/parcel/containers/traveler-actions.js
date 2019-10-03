import React from 'react';
import Meteor from 'react-native';
import PropTypes from 'prop-types';
import Dialog from 'react-native-dialog';
import StarRating from 'react-native-star-rating';
import { View, Text, Grid, Row, Col, Button } from 'native-base';

import colors from '../../styles/colors';
import common from '../../styles/common';

import { sendCounterOffer, rejectOffer, acceptOffer, markAsDelivered, postReview } from '../data/api';

class TravelerActions extends React.Component {
    constructor (props) {
        super(props);
        Text.defaultProps.uppercase = false;
    };

    state = {
        showCounterDialog: false,
        showReviewDialog: false,
        counterOffer: '0',
        travelerReview: '',
        travelerRating: 0,
    };

    onStarRatingPress(rating) {
        this.setState({ travelerRating: rating });
    };

    componentDidMount() {
        const { travelerRating, travelerReview } = this.props.parcel;
        if (travelerRating) {
            this.setState({ travelerRating });
        }
        
        if (travelerReview) {
            this.setState({ travelerReview });
        }
    };

    render () {
        const { parcel } = this.props;

        if (parcel.deliveredAt) {
            return (
                <View style={[common.flexReverse, common.py15, common.px15]}>
                    <Dialog.Container visible={this.state.showReviewDialog}>
                        <Dialog.Title>Review</Dialog.Title>
                        <Dialog.Description>
                            Feel free to describe your experience with the sender. You can also include your feedback about the Naao platform in general.
                        </Dialog.Description>

                        <StarRating
                            maxStars={5}
                            starSize={25}
                            fullStarColor={colors.warning}
                            rating={this.state.travelerRating}
                            containerStyle={[common.py10, common.px15]}
                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                        />

                        <Dialog.Input
                            label="Write a short review"
                            value={this.state.travelerReview}
                            onChangeText={(travelerReview) => this.setState({ travelerReview })}
                        />

                        <Dialog.Button
                            label="Cancel"
                            color={colors.dark}
                            onPress={() => this.setState({ showReviewDialog: false })}
                        />
                        <Dialog.Button
                            bold={true}
                            label="Post Review"
                            color={colors.success}
                            onPress={() => {
                                setTimeout(() => postReview(parcel, this.state.travelerReview, this.state.travelerRating), 500);
                                this.setState({ showReviewDialog: false });
                            }}
                        />
                    </Dialog.Container>

                    <Button
                        small
                        success
                        rounded
                        onPress={() => this.setState({ showReviewDialog: true })}
                    >
                        <Text>{ (parcel.travelerRating || parcel.travelerReview) ? 'Update Review' : 'Write A Review' }</Text>
                    </Button>
                </View>
            );
        }

        if (parcel.isAccepted) {
            return (
                <View style={[common.flexReverse, common.py15, common.px15]}>
                    <Button
                        small
                        success
                        rounded
                        onPress={() => markAsDelivered(parcel)}
                    >
                        <Text>Mark As Delivered</Text>
                    </Button>
                </View>
            );
        }

        if (parcel.isRejected) {
            return (
                <View style={[common.flexReverse, common.py15, common.px15]}>
                    <Button
                        small
                        danger
                        rounded
                        disabled
                    >
                        <Text>Offer Rejected</Text>
                    </Button>
                </View>
            );
        }

        if (parcel.counterOffer) {
            return (
                <View style={[common.flexReverse, common.py15, common.px15]}>
                    <Button
                        dark
                        small
                        rounded
                        disabled
                    >
                        <Text>Awaiting Response</Text>
                    </Button>
                </View>
            );
        }

        return (
            <Grid style={[common.py15]}>
                <Row>
                    <Col size={1.2}>
                        <Dialog.Container visible={this.state.showCounterDialog}>
                            <Dialog.Title>Counter Offer</Dialog.Title>
                            <Dialog.Description>
                                You can send a counter offer only once. After that, only the sender will be able to accept/reject the offer. The sender will be notified of your offer right away.
                            </Dialog.Description>

                            <Dialog.Input
                                keyboardType="number-pad"
                                label="Insert your offer amount"
                                value={this.state.counterOffer}
                                onChangeText={(counterOffer) => this.setState({ counterOffer })}
                            />

                            <Dialog.Button 
                                label="Cancel"
                                color={colors.dark}
                                onPress={() => this.setState({ showCounterDialog: false })}
                            />
                            <Dialog.Button 
                                bold={true}
                                label="Send Offer"
                                color={colors.success}
                                onPress={() => {
                                    this.setState({ showCounterDialog: false }, () => {
                                        setTimeout(() => sendCounterOffer(parcel, this.state.counterOffer), 500);
                                    });
                                }} 
                            />
                        </Dialog.Container>
                        <Button
                            info
                            small
                            transparent
                            onPress={() => this.setState({ showCounterDialog: true })}
                        >
                            <Text>Counter Offer</Text>
                        </Button>
                    </Col>
                    <Col size={1}>
                        <Button
                            small
                            danger
                            transparent
                            onPress={() => rejectOffer(parcel)}
                        >
                            <Text>Reject</Text>
                        </Button>
                    </Col>
                    <Col size={1}>
                        <Button
                            small
                            success
                            rounded
                            onPress={() => acceptOffer(parcel)}
                        >
                            <Text>Accept</Text>
                        </Button>
                    </Col>
                </Row>
            </Grid>
        );
    };
};

TravelerActions.propTypes = {
    parcel: PropTypes.object.isRequired,
};

export default TravelerActions;