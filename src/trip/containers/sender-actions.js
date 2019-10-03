import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'react-native-dialog';
import StarRating from 'react-native-star-rating';
import { withNavigation } from 'react-navigation';
import { StyleSheet, Dimensions } from 'react-native';
import { Text, Grid, Row, Col, Button } from 'native-base';

import { acceptCounterOffer, rejectCounterOffer, markAsDelivered, postReview } from '../../parcel/data/api';

import common from '../../styles/common';
import colors from '../../styles/colors';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    actionButton: { position: 'absolute', bottom: 0, width },
});

class SenderActions extends React.Component {
    constructor(props) {
        super(props);
    };

    state = {
        showReviewDialog: false,
        ownerReview: '',
        ownerRating: 0,
    };

    onStarRatingPress(rating) {
        this.setState({ ownerRating: rating });
    };

    componentDidMount() {
        if (!this.props.parcel)
            return;
            
        const { ownerRating, ownerReview } = this.props.parcel;
        if (ownerRating) {
            this.setState({ ownerRating });
        }

        if (ownerReview) {
            this.setState({ ownerReview });
        }
    };

    render() {
        const { parcel, trip, navigation } = this.props;

        if (!parcel || !parcel._id) {
            return (
                <Button
                    info
                    full
                    style={styles.actionButton}
                    onPress={() => navigation.navigate("ParcelOffer", { trip })}>
                    <Text>MAKE AN OFFER</Text>
                </Button>
            );
        }

        if (parcel.isRejected) {
            return (
                <Button
                    full
                    danger
                    disabled
                    style={styles.actionButton}>
                    <Text>Offer Rejected</Text>
                </Button>
            );
        }

        if (parcel.deliveredAt) {
            return (
                <React.Fragment>
                    <Dialog.Container visible={this.state.showReviewDialog}>
                        <Dialog.Title>Review</Dialog.Title>
                        <Dialog.Description>
                            Feel free to describe your experience sending your parcel with this traveler. 
                            You can also include your feedback about the Naao platform in general.
                        </Dialog.Description>

                        <StarRating
                            maxStars={5}
                            starSize={25}
                            fullStarColor={colors.warning}
                            rating={this.state.ownerRating}
                            containerStyle={[common.py10, common.px15]}
                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                        />

                        <Dialog.Input
                            label="Write a short review"
                            value={this.state.ownerReview}
                            onChangeText={(ownerReview) => this.setState({ ownerReview })}
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
                                postReview(parcel, this.state.ownerReview, this.state.ownerRating);
                                this.setState({ showReviewDialog: false });
                            }}
                        />
                    </Dialog.Container>

                    <Button
                        full
                        success
                        style={styles.actionButton}
                        onPress={() => this.setState({ showReviewDialog: true })}
                    >
                        <Text>{(parcel.ownerRating || parcel.ownerReview) ? 'Update Review' : 'Write A Review'}</Text>
                    </Button>
                </React.Fragment>
            );
        }

        if (parcel.isAccepted) {
            return (
                <Button
                    full
                    success
                    onPress={() => markAsDelivered(parcel)}
                    style={styles.actionButton}
                >
                    <Text>Mark Delivered</Text>
                </Button>
            );
        }

        if (parcel.counterOffer) {
            return (
                <Grid style={[styles.actionButton]}>
                    <Row>
                        <Col>
                            <Button
                                full
                                danger
                                onPress={() => rejectCounterOffer(parcel)}
                            >
                                <Text>Reject</Text>
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                full
                                success
                                onPress={() => acceptCounterOffer(parcel)}
                            >
                                <Text>Accept</Text>
                            </Button>
                        </Col>
                    </Row>
                </Grid>
            );
        }

        return (
            <Button
                full
                dark
                disabled
                style={[styles.actionButton]}>
                <Text>Awaiting Response</Text>
            </Button>
        );
    };
};

SenderActions.propTypes = {
    parcel: PropTypes.object,
    trip: PropTypes.object.isRequired,
};

export default withNavigation(SenderActions);