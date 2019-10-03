import React from 'react';
import debounce from 'lodash/debounce';
import { withTracker } from 'react-native-meteor';
import { Content, Container, Item, Icon, Input, Grid, Row, Col, Spinner, List, ListItem, Body, Text, Button, Right } from 'native-base';

import { getCity, updateCity, findCity } from './data/location';
import AppColors from '../styles/colors';
import Common from '../styles/common';

const doCityQuery = (query) => {
    updateCity('query', query);
    findCity();
};
const debouncedUpdateCity = debounce(doCityQuery, 300);

class CityFinder extends React.Component {
    state = {
        query: '',
    };

    handleInputChange = (query) => {
        this.setState({ query });
        debouncedUpdateCity(query);
    };

    renderCities = () => {
        const { cities, loading } = this.props;

        if (cities && cities.length > 0 && !loading)
            return cities.map(this.renderCity);

        if (!loading) {
            return (
                <ListItem>
                    <Body>
                        <Text>
                            Sorry we couldn't find any city matching your query 
                            <Text style={[Common.fontBold, Common.textBackground]}> {this.state.query}</Text>
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="exclamation-triangle" />
                    </Right>
                </ListItem>
            );
        }
    };

    selectCity(city) {
        this.props.navigation.state.params.setCity(city);
        this.props.navigation.goBack();
    };

    renderCity = (city) => {
        if (!city)
            return null;

        const { id, structured_formatting } = city;
        
        return (
            <ListItem 
                key={id} 
                onPress={() => this.selectCity(city)}
            >
                <Body>
                    <Text style={[Common.fontBold]}>{ structured_formatting.main_text }</Text>
                    <Text note>{ structured_formatting.secondary_text }</Text>
                </Body>
                {this.props.selected && this.props.selected.id === id && (
                    <Right>
                        <Icon color={AppColors.background} name="check-circle"  />
                    </Right>
                )}
            </ListItem>
        );
    };

    render() {
        return (
            <Container>
                <Content>
                    <Grid>
                        <Row>
                            <Col size={1}>
                                <Button
                                    dark
                                    transparent
                                    style={[Common.mt15]}
                                    onPress={() => this.props.navigation.goBack()}>
                                    <Icon name="arrow-left" />
                                </Button>
                            </Col>
                            <Col size={5}>
                                <Item rounded style={[Common.mx10, Common.my10]}>
                                    <Input
                                        autoFocus={true}
                                        style={[Common.pl15]}
                                        value={this.state.query}
                                        onChangeText={this.handleInputChange} />
                                </Item>
                            </Col>
                            <Col size={1}>
                                {this.props.loading ? <Spinner size="small" /> : null}
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <List>
                                    { this.state.query.length < 2 ? (
                                        <ListItem>
                                            <Body><Text>Start typing in the input above to find your city quickly</Text></Body>
                                        </ListItem>
                                    ) : this.renderCities() }
                                </List>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    };
};

export default withTracker(props => {
    const error = getCity('error'),
        query = getCity('query'),
        { selected } = props.navigation.state.params;

    let cities = getCity('results'),
        loading = getCity('loading');

    if (selected && cities && cities.length > 0 && !cities.find(c => c.id === selected.id)) {
        cities = [props.navigation.state.params.selected, ...cities];
    }

    // console.log('city finder', cities);
    return {
        query, cities, loading,
        error, selected, ...props, 
    };
})(CityFinder);