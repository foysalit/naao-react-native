import React from "react";
import { Text, Container, Content, Grid, Row, Col, Button, Icon } from "native-base";

import common from '../styles/common';
import colors from '../styles/colors';
import MessageList from './containers/list';

export default class MessageListPage extends React.Component {
    state = {
        type: 'trip'
    };

    render () {
        return (
            <Container>
                <Content style={[common.px10]}>
                    <Grid style={[common.pageHeaderGrid]}>
                        <Row>
                            <Col>
                                <Text style={[common.pageHeaderText]}>
                                    { this.state.type === 'trip' ? 'Trip' : 'Parcel' } Chat
                                </Text>
                            </Col>
                            <Col style={[common.flexReverse]}>
                                <Button
                                    transparent
                                    dark={this.state.type === 'trip'}
                                    danger={this.state.type === 'parcel'}
                                    androidRippleColor={colors.warning}
                                    onPress={() => this.setState({ type: 'parcel' })}>
                                    <Icon name="cube" />
                                </Button>
                                <Button
                                    transparent
                                    dark={this.state.type === 'parcel'}
                                    danger={this.state.type === 'trip'}
                                    androidRippleColor={colors.warning}
                                    onPress={() => this.setState({ type: 'trip' })}>
                                    <Icon name="suitcase" />
                                </Button>
                            </Col>
                        </Row>
                    </Grid>

                    <MessageList 
                        type={this.state.type} 
                        navigation={this.props.navigation}/>
                </Content>
            </Container>
        );
    };
};