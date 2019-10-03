import React from 'react';
import PropTypes from 'prop-types';
import StarRating from 'react-native-star-rating';
import { Grid, Row, Col, CardItem, Text, View } from 'native-base';

import common from '../../styles/common';
import colors from '../../styles/colors';

const Review = ({ parcel, style={} }) => {
    const hasTravelerReview = (parcel.travelerReview || parcel.travelerRating),
        hasOwnerReview = (parcel.ownerReview || parcel.ownerRating);

    if (!parcel.deliveredAt || (!hasOwnerReview && !hasTravelerReview))
        return null;
    
    return (
        <View style={style}>
            {hasTravelerReview && (
                <Grid>
                    <Row>
                        <Col>
                            <Text style={[common.fontBold, common.pb5]}>
                                Traveler's Review
                            </Text>
                        </Col>
                        <Col>
                            <StarRating
                                maxStars={5}
                                starSize={18}
                                disabled={true}
                                fullStarColor={colors.warning}
                                rating={parcel.travelerRating}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={[common.pt5]}>
                                {parcel.travelerReview}
                            </Text>
                        </Col>
                    </Row>
                </Grid>
            )}
            {hasOwnerReview && (
                <Grid style={[ common.pt15 ]}>
                    <Row>
                        <Col>
                            <Text style={[common.fontBold, common.pb5]}>
                                Sender's Review
                            </Text>
                        </Col>
                        <Col>
                            <StarRating
                                maxStars={5}
                                starSize={18}
                                disabled={true}
                                fullStarColor={colors.warning}
                                rating={parcel.ownerRating}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={[common.pt5]}>
                                {parcel.ownerReview}
                            </Text>
                        </Col>
                    </Row>
                </Grid>
            )}
        </View>
    )
};

Review.propTypes = {
    parcel: PropTypes.object.isRequired,
    style: PropTypes.any,
};

export default Review;