import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { Alert } from 'react-native';
import addDays from 'date-fns/add_days';
import isBefore from 'date-fns/is_before';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Form, Button, Label, Item, Input, Text, Icon, View, Grid, Row, Col } from 'native-base';

import coloredForm from '../../styles/colored-form';
import common from '../../styles/common'; 

import { updateSearch } from '../../search/data/api';
import { TripSchema } from '../../trip/data/schema';

class ScheduleForm extends React.Component {
    validator = TripSchema.pick('collectBy', 'deliveryBy').newContext();

    state = {
        showDatePicker: false,
        datePickerFor: 'collectBy',
        collectBy: addDays(new Date(), 1),
        deliveryBy: addDays(new Date(), 3),
        datePickerDate: addDays(new Date(), 1),
    };

    handleInputChange = (field, value) => {
        this.setState({[field]: value});

        if (field === 'collectBy') {
            if (isBefore(this.state.deliveryBy, value)) {
                this.setState({deliveryBy: addDays(value, 1)});
            }
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

    submitSearch = () => {
        const { collectBy, deliveryBy } = this.state;
        const locations = this.validator.clean(this.state);

        this.validator.validate(locations);

        if (!this.validator.isValid()) {
            return this.setState({ errors: this.validator.validationErrors() });
        }

        this.setState({ errors: {} });
        updateSearch('inputs', { collectBy, deliveryBy });
        this.props.onSubmitted(this.state);
    };

    openDatePicker = (datePickerFor='collectBy') => {
        this.setState({ 
            showDatePicker: true, datePickerFor, 
            datePickerDate: this.state[datePickerFor] 
        });
    };

    closeDatePicker = () => {
        this.setState({ showDatePicker: false });
    };

    handlePickedDate = (date) => {
        this.handleInputChange(this.state.datePickerFor, date);
        this.closeDatePicker();
    };

    render() {
        return (
            <Form style={[common.bgBackground, common.px15, common.py15]}>
                <DateTimePicker
                    maximumDate={addDays(this.state.collectBy, this.state.datePickerFor === 'deliveryBy' ? 10 : 100)}
                    minimumDate={this.state.datePickerFor === 'deliveryBy' ? this.state.collectBy : addDays(new Date(), 1)}
                    isVisible={this.state.showDatePicker}
                    onConfirm={this.handlePickedDate}
                    date={this.state.datePickerDate}
                    onCancel={this.closeDatePicker}
                />
                <Label style={coloredForm.label}>COLLECT BY</Label>
                <Item 
                    rounded
                    style={[coloredForm.item]}
                    onPress={() => this.openDatePicker('collectBy')}>
                    <Icon 
                        name="calendar-plus-o"
                        style={[coloredForm.itemIcon]} />
                    <Input
                        editable={false}
                        style={[coloredForm.input]}
                        value={format(this.state.collectBy, 'MMM DD, YYYY')} />
                </Item>
                {this.renderFieldError('collectBy')}

                <Label style={coloredForm.label}>DELIVERY BY</Label>
                <Item 
                    rounded
                    style={[coloredForm.item]}
                    onPress={() => this.openDatePicker('deliveryBy')}>
                    <Icon 
                        name="calendar-check-o"
                        style={[coloredForm.itemIcon]} />
                    <Input
                        editable={false}
                        style={[coloredForm.input]}
                        value={format(this.state.deliveryBy, 'MMM DD, YYYY')} />
                </Item>
                {this.renderFieldError('deliveryBy')}

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
                                <Text>{this.props.submitText || 'NEXT' }</Text>
                            </Button>
                        </Col>
                    </Row>
                </Grid>
            </Form>
        );
    };
};

ScheduleForm.propTypes = {
    onSubmitted: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    submitText: PropTypes.string,
};

export default ScheduleForm;