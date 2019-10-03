import { FlatList } from 'react-native';
import React, { Component } from 'react';
import { Container, Header, Content, ListItem, Text, Radio, Right, Left, Grid, Row, Col } from 'native-base';

import common from '../styles/common.js';
import colors from '../styles/colors.js';

const currencies = require('../shared/data/currencies.json');

export default class CurrencyPage extends Component {
    state = {
        current: 'USD'
    };

    componentDidMount() {
        const { navigation } = this.props;
        if (navigation.state.params)
            this.setState({ current: navigation.state.params.current });
    };

    selectCurrency = (current) => {
        this.setState({ current });
        this.props.navigation.state.params.setCurrency(current);
        this.props.navigation.goBack();
    };

    render() {
        return (
            <Container>
                <Content>
                    <Grid style={[common.pageHeaderGrid]}>
                        <Row>
                            <Col>
                                <Text style={[common.pageHeaderText]}>
                                    Pick Your Currency
                                </Text>
                            </Col>
                        </Row>
                    </Grid>
                    <FlatList 
                        data={Object.keys(currencies)}  
                        keyExtractor={(item, index) => item}
                        renderItem={({item}) => (
                            <ListItem
                                selected={this.state.current === currencies[item].code}
                                onPress={() => this.selectCurrency(currencies[item].code)}
                                key={item}
                                noIndent
                                button
                            >
                                <Left>
                                    <Text>{currencies[item].symbol} ({currencies[item].code})</Text>
                                </Left>
                                <Right>
                                    <Radio
                                        selectedColor={colors.info}
                                        selected={currencies[item].code === this.state.current}
                                    />
                                </Right>
                            </ListItem>
                        )}  
                    />
                </Content>
            </Container>
        );
    }
}