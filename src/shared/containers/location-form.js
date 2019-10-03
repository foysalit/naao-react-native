import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Form, Button, Label, Item, Input, Segment, Text, Icon, View, Content, Grid, Row, Col } from 'native-base';

import RecentSearches from '../../search/containers/recent';
import TravelerHints from '../components/traveler-hints';
import SenderHints from '../components/sender-hints';
import coloredForm from '../../styles/colored-form'; 
import common from '../../styles/common';

import { updateSearch } from '../../search/data/api';
import { TripSchema } from '../../trip/data/schema';
import colors from '../../styles/colors';

class LocationForm extends React.Component {
    validator = TripSchema.pick('from', 'to').newContext();

    state = {
        type: 'sender',
        from: null,
        to: null,
        fromName: null,
        toName: null,
        errors: {},
    };

    handleInputChange = (field, value) => {
        this.setState({[field]: value});
    };

    submitSearch = () => {
        const locations = this.validator.clean(this.state);

        this.validator.validate(locations);

        if (!this.validator.isValid()) {
            return this.setState({ errors: this.validator.validationErrors() });
        }

        if (this.validator.isValid()) {
            this.setState({ errors: {} });
            updateSearch('inputs', {...locations, type: this.state.type});
            this.props.onSubmitted({...locations, type: this.state.type});
            return;
        }
    };

    renderFieldError(field) {
        const error = this.validator.keyErrorMessage(field);

        if (!error)
            return null;

        return (
            <Text style={[common.textDanger, common.pl15]}>
                {this.validator.keyErrorMessage(field)}
            </Text>
        )
    };

    openCityPicker = (field='from') => {
        const nameKey = `${field}Name`;
        this.props.navigation.navigate("CityFinderStack", {
            setCity: (city) => {
                this.handleInputChange(field, city);
                this.handleInputChange(nameKey, city.description);
            },
            selected: this.state[field]
        });
    };

    render() {
        return (
            <Content>
                <Form style={[coloredForm.form]}>
                    <Label style={coloredForm.label}>I AM A</Label>
                    <Segment rounded style={coloredForm.segment}>
                        <Button 
                            first 
                            rounded 
                            info={ this.state.type === 'sender' }
                            active={ this.state.type === 'sender' }
                            style={[coloredForm.segmentButton, coloredForm.segmentButtonFirst]}
                            onPress={() => this.handleInputChange('type', 'sender')}
                        >
                            <Text>SENDER</Text>
                        </Button>
                        <Button 
                            last 
                            rounded 
                            info={ this.state.type === 'traveler' }
                            active={ this.state.type === 'traveler' }
                            style={[coloredForm.segmentButton, coloredForm.segmentButtonLast]}
                            onPress={() => this.handleInputChange('type', 'traveler')}
                        >
                            <Text>TRAVELER</Text>
                        </Button>
                    </Segment>

                    <Label style={coloredForm.label}>PARCEL PICK-UP</Label>

                    <Item 
                        rounded
                        style={[coloredForm.item]}
                        onPress={() => this.openCityPicker('from')}
                    >
                        <Icon 
                            name="map-marker" 
                            style={[coloredForm.itemIcon]}/>
                        <Input
                            editable={false}
                            value={this.state.fromName} 
                            style={[coloredForm.input]}
                            placeholder="city/area of pick up"
                            placeholderTextColor={colors.primary}
                            onTouchStart={() => this.openCityPicker('from')} />
                    </Item>
                    {this.renderFieldError('from')}

                    <Label 
                        style={coloredForm.label}
                        onPress={() => this.openCityPicker('to')}
                    >
                        PARCEL DROP-OFF
                    </Label>

                    <Item 
                        rounded 
                        style={[coloredForm.item]}
                        onPress={() => this.openCityPicker('to')}>
                        <Icon 
                            name="map-marker" 
                            style={[coloredForm.itemIcon]}/>
                        <Input
                            editable={false}
                            value={this.state.toName} 
                            style={[coloredForm.input]}
                            placeholder="city/area of delivery"
                            placeholderTextColor={colors.primary}
                            onTouchStart={() => this.openCityPicker('to')}/>
                    </Item>
                    {this.renderFieldError('to')}

                    <Grid style={[common.pt10]}>
                        <Row>
                            <Col>
                                <Button
                                    success
                                    transparent
                                    onPress={this.props.onBack}>
                                    <Text>BACK</Text>
                                </Button>
                            </Col>
                            <Col style={[common.flexReverse]}>
                                <Button
                                    success
                                    transparent
                                    onPress={this.submitSearch}>
                                    <Text>{this.state.type === 'sender' ? 'SEARCH' : 'PUBLISH TRIP'}</Text>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </Form>

                <View style={[common.py15, common.px15]}>
                    { this.state.type === 'sender' && <RecentSearches /> }
                    {this.state.type === 'sender' ? <SenderHints /> : <TravelerHints />}
                </View>
            </Content>
        );
    };
};

LocationForm.propTypes = {
    onSubmitted: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default withNavigation(LocationForm);