import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import { Form, Button, Label, Item, Input, Segment, Text, Icon, View, Grid, Row, Col } from 'native-base';

import ThemeColors from '../../../native-base-theme/variables/platform';
import ColoredFormStyles from '../../styles/colored-form';
import CommonStyles from '../../styles/common'; 

import { ParcelSizeSchema } from '../../parcel/data/schema';
import common from '../../styles/common';

class MeasurementForm extends React.Component {
    validator = ParcelSizeSchema.newContext();

    state = {
        unit: 'in',
        width: '',
        height: '',
        len: '',
        weight: '',
        errors: {},
    };

    handleInputChange = (field, value) => {
        this.setState({[field]: value});
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

    submitSearch = () => {
        const totalSpace = this.validator.clean(this.state);

        this.validator.validate(totalSpace);
        
        if (!this.validator.isValid()) {
            return this.setState({ errors: this.validator.validationErrors() });
        }

        this.setState({ errors: {} });
        this.props.onSubmitted({ totalSpace });
    };

    render() {
        return (
            <Form style={[CommonStyles.bgBackground, CommonStyles.px15, CommonStyles.py15]}>
                <Label style={ColoredFormStyles.label}>MEASUREMENTS</Label>
                <Segment rounded style={ColoredFormStyles.segment}>
                    <Button 
                        first 
                        rounded 
                        active={ this.state.unit === 'in' }
                        onPress={() => this.handleInputChange('unit', 'in')}
                        style={[ColoredFormStyles.segmentButton, ColoredFormStyles.segmentButtonFirst]}
                    >
                        <Text style={[this.state.unit === 'in' ? CommonStyles.textCadetBlue : CommonStyles.textWhiteSmoke]}>INCH</Text>
                    </Button>
                    <Button 
                        last 
                        rounded 
                        active={ this.state.unit === 'cm' }
                        onPress={() => this.handleInputChange('unit', 'cm')}
                        style={[ColoredFormStyles.segmentButton, ColoredFormStyles.segmentButtonLast]}
                    >
                        <Text style={[this.state.unit === 'cm' ? CommonStyles.textCadetBlue : CommonStyles.textWhiteSmoke]}>CM</Text>
                    </Button>
                </Segment>

                <Label style={ColoredFormStyles.label}>PACKAGE SIZE</Label>
    
                <View style={[CommonStyles.flexRow]}>
                    <Item rounded style={[ColoredFormStyles.inlineItem, CommonStyles.mr10]}>
                        <Input
                            placeholder="Width"
                            keyboardType="number-pad"
                            value={this.state.width} 
                            style={[ColoredFormStyles.input, CommonStyles.pl20]}
                            selectionColor={ThemeColors.textColor}
                            placeholderTextColor={ThemeColors.inverseTextColor}
                            onChangeText={(text) => this.handleInputChange('width', text)}/>
                    </Item>
                    <Item rounded style={[ColoredFormStyles.inlineItem, CommonStyles.mr10]}>
                        <Input
                            placeholder="Height"
                            keyboardType="number-pad"
                            value={this.state.height} 
                            style={[ColoredFormStyles.input, CommonStyles.pl20]}
                            selectionColor={ThemeColors.textColor}
                            placeholderTextColor={ThemeColors.inverseTextColor}
                            onChangeText={(text) => this.handleInputChange('height', text)}/>
                    </Item>
                    <Item rounded last style={[ColoredFormStyles.inlineItem]}>
                        <Input
                            placeholder="Length"
                            keyboardType="number-pad"
                            value={this.state.len} 
                            style={[ColoredFormStyles.input, CommonStyles.pl20]}
                            selectionColor={ThemeColors.textColor}
                            placeholderTextColor={ThemeColors.inverseTextColor}
                            onChangeText={(text) => this.handleInputChange('len', text)}/>
                    </Item>
                </View>

                {this.renderFieldError('width')}
                {this.renderFieldError('height')}
                {this.renderFieldError('len')}

                <Label style={ColoredFormStyles.label}>WEIGHT</Label>

                <Item rounded style={[ColoredFormStyles.item]}>
                    <Icon 
                        style={[ColoredFormStyles.itemIcon]}
                        name="balance-scale" />
                    <Input
                        keyboardType="number-pad"
                        value={this.state.weight} 
                        style={[ColoredFormStyles.input]}
                        onChangeText={(text) => this.handleInputChange('weight', text)}/>
                    
                    <Text style={[ColoredFormStyles.inputNote]}>KG</Text>
                </Item>
                {this.renderFieldError('weight')}
                
                <Grid style={[ common.pt10 ]}>
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
                                <Text>{ this.props.submitText || 'PUBLISH' }</Text>
                            </Button>
                        </Col>
                    </Row>
                </Grid>
            </Form>
        );
    };
};

MeasurementForm.propTypes = {
    onSubmitted: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    submitText: PropTypes.string,
};

export default MeasurementForm;