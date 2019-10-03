import React from 'react';
import { Alert } from 'react-native';
import Meteor from 'react-native-meteor';
import { Form, Button, Label, Item, Input, Segment, Text, Icon, View, Container, Content, Row, Grid, Col, Picker, } from 'native-base';

import ThemeColors from '../../native-base-theme/variables/platform';
import coloredForm from '../styles/colored-form';
import common from '../styles/common'; 

import ParcelHint from './components/hint';

import { ParcelSchema } from './data/schema';
import { showAuthPopup } from '../auth/data/api';
import { createParcel, getTempOffer, setTempOffer } from './data/api';

class ParcelOffer extends React.Component {
    offerValidator = ParcelSchema.newContext();

    state = {
        unit: 'in',
        width: '',
        height: '',
        len: '',
        offer: '',
        weight: '',
        content: '',
        note: '',
        currency: 'USD',
        errors: {},
    };

    componentDidMount () {
        const tempOffer = getTempOffer();

        if (!!tempOffer)
            this.setState(tempOffer);
    };

    handleInputChange = (field, value) => {
        this.setState({[field]: value});
    };

    submitOffer = () => {
        const { unit, width, height, len, weight, note, content, currency, offer} = this.state,
            parcel = this.offerValidator.clean({ 
                note, content, offer, currency,
                size: { unit, width, height, len, weight }, 
                tripId: this.props.navigation.state.params.trip._id,
            });

        this.offerValidator.validate(parcel);
        if (!this.offerValidator.isValid()) {
            return this.setState({ errors: this.offerValidator.validationErrors() });
        }

        if (!Meteor.userId()) {
            return showAuthPopup('Parcel Offer', () => {
                setTempOffer(parcel);
                this.props.navigation.navigate("AuthStack", { returnTo: "ParcelOffer" });
            });
        }

        this.setState({ errors: {} });
        this.sendOffer(parcel);
    };

    sendOffer = (parcel) => {
        const { currency, offer, size } = parcel;
        const onPress = () => createParcel(parcel, (err, res) => {
            if (!err)
                return this.props.navigation.goBack();

            Alert.alert(
                "Something's wrong",
                "Your offer may not be valid. Please try with different input"
            );
        });

        Alert.alert(
            "Confirm Offer",
            `Offering the traveler ${offer} ${currency} to delivery your parcel weighing ${size.weight} KG of ${size.len}x${size.width}x${size.height} ${size.unit} size? Ready to proceed?`,
            [{ text: 'Cancel', type: 'cancel' }, { text: 'Send Offer', onPress }]
        );
    };

    renderFieldError(field) {
        const error = this.offerValidator.keyErrorMessage(field);

        if (!error)
            return null;

        return (
            <Text style={[common.textDanger, common.pl15]}>
                {this.offerValidator.keyErrorMessage(field)}
            </Text>
        )
    };

    render() {
        const { navigation } = this.props;

        return (
            <Container>
                <Content>
                    <Form style={[common.bgBackground, common.px15, common.py15, common.mb20]}>
                        <Label style={coloredForm.label}>MEASUREMENTS</Label>
                        <Segment rounded style={coloredForm.segment}>
                            <Button 
                                first 
                                rounded 
                                active={ this.state.unit === 'in' }
                                onPress={() => this.handleInputChange('unit', 'in')}
                                style={[coloredForm.segmentButton, coloredForm.segmentButtonFirst]}
                            >
                                <Text style={[this.state.unit === 'in' ? common.textCadetBlue : common.textWhiteSmoke]}>INCH</Text>
                            </Button>
                            <Button 
                                last 
                                rounded 
                                active={ this.state.unit === 'cm' }
                                onPress={() => this.handleInputChange('unit', 'cm')}
                                style={[coloredForm.segmentButton, coloredForm.segmentButtonLast]}
                            >
                                <Text style={[this.state.unit === 'cm' ? common.textCadetBlue : common.textWhiteSmoke]}>CM</Text>
                            </Button>
                        </Segment>

                        <Label style={coloredForm.label}>PACKAGE SIZE</Label>
            
                        <View style={[common.flexRow]}>
                            <Item rounded style={[coloredForm.inlineItem, common.mr10]}>
                                <Input
                                    placeholder="Width"
                                    keyboardType="number-pad"
                                    value={this.state.width} 
                                    style={[coloredForm.input, common.pl20]}
                                    selectionColor={ThemeColors.textColor}
                                    placeholderTextColor={ThemeColors.inverseTextColor}
                                    onChangeText={(text) => this.handleInputChange('width', text)}/>
                            </Item>
                            <Item rounded style={[coloredForm.inlineItem, common.mr10]}>
                                <Input
                                    placeholder="Height"
                                    keyboardType="number-pad"
                                    value={this.state.height} 
                                    style={[coloredForm.input, common.pl20]}
                                    selectionColor={ThemeColors.textColor}
                                    placeholderTextColor={ThemeColors.inverseTextColor}
                                    onChangeText={(text) => this.handleInputChange('height', text)}/>
                            </Item>
                            <Item rounded last style={[coloredForm.inlineItem]}>
                                <Input
                                    placeholder="Length"
                                    keyboardType="number-pad"
                                    value={this.state.len} 
                                    style={[coloredForm.input, common.pl20]}
                                    selectionColor={ThemeColors.textColor}
                                    placeholderTextColor={ThemeColors.inverseTextColor}
                                    onChangeText={(text) => this.handleInputChange('len', text)}/>
                            </Item>
                        </View>

                        {this.renderFieldError('size.width')}
                        {this.renderFieldError('size.height')}
                        {this.renderFieldError('size.len')}

                        <Label style={coloredForm.label}>PARCEL WEIGHT</Label>

                        <Item rounded style={[coloredForm.item]}>
                            <Icon 
                                style={[coloredForm.itemIcon]}
                                name="balance-scale" />
                            <Input
                                keyboardType="number-pad"
                                value={this.state.weight} 
                                style={[coloredForm.input]}
                                onChangeText={(text) => this.handleInputChange('weight', text)}/>
                            
                            <Text style={[coloredForm.inputNote]}>KG</Text>
                        </Item>
                        {this.renderFieldError('size.weight')}

                        <Label style={coloredForm.label}>OFFER AMOUNT</Label>

                        <Item rounded style={[coloredForm.item]}>
                            <Icon 
                                style={[coloredForm.itemIcon]}
                                name="money" />
                            <Input
                                keyboardType="number-pad"
                                value={this.state.offer} 
                                style={[coloredForm.input]}
                                onChangeText={(text) => this.handleInputChange('offer', text)}/>

                            <Text 
                                style={[coloredForm.inputNote]} 
                                onPress={() => navigation.navigate("ParcelStackCurrency", { 
                                    current: this.state.currency,
                                    setCurrency: (currency) => this.handleInputChange('currency', currency)
                                })}
                            >
                                { this.state.currency }
                            </Text>
                        </Item>
                        {this.renderFieldError('offer')}
                        
                        <Label style={coloredForm.label}>SHORTLY DESCRIBE YOUR CONTENT</Label>

                        <Item rounded style={[coloredForm.item]}>
                            <Icon 
                                style={[coloredForm.itemIcon]}
                                name="cube" />
                            <Input
                                value={this.state.content} 
                                style={[coloredForm.input]}
                                onChangeText={(text) => this.handleInputChange('content', text)}/>
                        </Item>
                        {this.renderFieldError('content')}
                        
                        <Label style={coloredForm.label}>ADDITIONAL NOTE/INSTRUCTION</Label>

                        <Item rounded style={[coloredForm.item]}>
                            <Icon 
                                style={[coloredForm.itemIcon]}
                                name="edit" />
                            <Input
                                value={this.state.note} 
                                style={[coloredForm.input]}
                                onChangeText={(text) => this.handleInputChange('note', text)}/>
                        </Item>
                        {this.renderFieldError('note')}

                        <Grid style={[ common.pt10 ]}>
                            <Row>
                                <Col>
                                    <Button
                                        success
                                        transparent
                                        onPress={() => this.props.navigation.goBack()}>
                                        <Text>GO BACK</Text>
                                    </Button>
                                </Col>
                                <Col style={[ common.flexReverse ]}>
                                    <Button 
                                        success 
                                        transparent 
                                        onPress={this.submitOffer}>
                                        <Text>SEND REQUEST</Text>
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </Form>

                    <ParcelHint />
                </Content>
            </Container>
        );
    };
};

export default ParcelOffer;