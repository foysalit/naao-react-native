import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { StyleSheet } from 'react-native';
import { Card, Col, Row, Text, Grid, CardItem } from 'native-base';

import common from '../../styles/common';
import colors from '../../styles/colors';

import UserAvatar from '../../user/components/avatar';

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

const MessageSummary = ({ user, lastMessage, onPress }) => {
    return (
        <Card>
            <CardItem 
                button
                style={[styles.user]} 
                onPress={onPress}
            >
                <Grid>
                    <Row>
                        <Col size={1}>
                            <UserAvatar user={user} />
                        </Col>

                        <Col size={3} style={[common.pt5]}>
                            <Text>{user.profile.name}</Text>
                            <Text note>{user.profile.city.description}</Text>
                        </Col>
                    </Row>
                </Grid>
            </CardItem>

                <CardItem>
                {lastMessage ? (
                    <Grid style={[common.pb10]}>
                        <Row style={[common.pb10]}>
                            <Col><Text note>{lastMessage.text}</Text></Col>
                        </Row>
                        <Row>
                            <Col><Text style={[common.fontBold]}>{format(lastMessage.createdAt, 'DD MMM YYYY')}</Text></Col>
                        </Row>
                    </Grid>
                ) : (
                    <Text note>You haven't exchanged any messages with this user yet. </Text>
                )}
                </CardItem>
        </Card>
    );
};

MessageSummary.propTypes = {
    lastMessage: PropTypes.object,
    user: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default MessageSummary;