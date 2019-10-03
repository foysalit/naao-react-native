import React from 'react';
import { Image } from 'react-native';
import { Form, Item, Label, Icon, Input, Button, Text, View } from 'native-base';

import colors from '../../styles/colors';
import common from '../../styles/common';
import coloredForm from '../../styles/colored-form';

import { RegistrationSchema, register } from '../data/api';
import { ProfileEditor } from '../../user/containers/profile-editor';

const Logo = require('../../shared/images/naao-logo.png');

class Signup extends React.Component {
    accountValidator = RegistrationSchema.pick('email', 'password', 'confirm_password').newContext();

    state = {
        step: 1,
        email: "",
        errors: [],
        password: "",
        loading: false,
        showPass: false,
        focusedField: null,
        confirm_password: "",
    };

    componentDidMount() {
        this.props.setBackAction('close');
    };

    handleInput(field, text) {
        this.setState({ [field]: text });
    };

    submitRegister = ({ pic, name, city }) => {
        const { email, password } = this.state,
            data = { email, password, profile: { name, city, pic } };

        this.setState({ loading: true });
        register(data, (err) => {
            this.setState({ loading: false });
            console.log('registration err', err);
            if (!err) {
                this.props.onSignin();
            }
        });
    };

    goToProfileSetup = () => {
        const account = this.accountValidator.clean(this.state);

        this.accountValidator.validate(account);

        if (this.accountValidator.isValid()) {
            this.setState({ errors: [], step: 2 });
            this.props.setBackAction('arrow-left', () => {
                this.setState({ step: 1 }, () => {
                    this.props.setBackAction('close');
                });
            });
            return;
        }

        this.setState({ errors: this.accountValidator.validationErrors() });
    };

    placeholderText(fieldName) {
        const placeholders = {
            'email': 'Email address',
            'password': 'Secure password',
            'confirm_password': 'Repeat your password',
        };

        if (this.state.focusedField === fieldName)
            return "";

        return placeholders[fieldName];
    };

    renderFieldError(field) {
        const error = this.accountValidator.keyErrorMessage(field);

        if (!error)
            return null;

        return (
            <Text style={[common.textDanger, common.pl15]}>
                {this.accountValidator.keyErrorMessage(field)}
            </Text>
        )
    };

    renderAccountFields() {
        const { email, password, confirm_password } = this.state;

        return (
            <View>
                <View style={[common.mb15]}>
                    <Image
                        style={{ width: 80, height: 50 }}
                        resizeMethod="resize"
                        resizeMode="contain"
                        source={Logo}
                    />
                </View>

                <Label style={[coloredForm.label]}>EMAIL</Label>
                <Item
                    rounded
                    style={[coloredForm.item]}
                >
                    <Icon name="envelope" style={[coloredForm.itemIcon]} />
                    <Input
                        value={email}
                        autoCorrect={false}
                        returnKeyType="next"
                        keyboardType="email-address"
                        ref={ref => (this.email = ref)}
                        style={[coloredForm.input]}
                        placeholderTextColor={colors.primary}
                        placeholder={this.placeholderText("email")}
                        onSubmitEditing={() => this.password._root.focus()}
                        onChangeText={this.handleInput.bind(this, 'email')}
                        onFocus={() => this.setState({ focusedField: 'email' })}
                    />
                </Item>
                { this.renderFieldError('email') }

                <Label style={[coloredForm.label]}>PASSWORD</Label>
                <Item
                    rounded
                    style={[coloredForm.item]}
                >
                    <Icon name="key" style={[coloredForm.itemIcon]} />
                    <Input
                        value={password}
                        returnKeyType="go"
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="default"
                        style={[coloredForm.input]}
                        ref={ref => (this.password = ref)}
                        secureTextEntry={!this.state.showPass}
                        placeholderTextColor={colors.primary}
                        placeholder={this.placeholderText("password")}
                        onSubmitEditing={() => this.confirm_password._root.focus()}
                        onChangeText={this.handleInput.bind(this, 'password')}
                        onFocus={() => this.setState({ focusedField: 'password' })}
                    />
                    <Icon 
                        name="eye"
                        style={[{ fontSize: 16 }, common.textPrimary, common.pr10]} 
                        onPress={() => this.setState({showPass: !this.state.showPass})} />
                </Item>
                {this.renderFieldError('password')}

                <Label style={[coloredForm.label]}>CONFIRM PASSWORD</Label>
                <Item
                    rounded
                    style={[coloredForm.item]}
                >
                    <Icon name="key" style={[coloredForm.itemIcon]} />
                    <Input
                        value={confirm_password}
                        returnKeyType="go"
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="default"
                        style={[coloredForm.input]}
                        ref={ref => (this.confirm_password = ref)}
                        secureTextEntry={!this.state.showPass}
                        placeholderTextColor={colors.primary}
                        onSubmitEditing={this.goToProfileSetup}
                        placeholder={this.placeholderText("confirm_password")}
                        onChangeText={this.handleInput.bind(this, 'confirm_password')}
                        onFocus={() => this.setState({ focusedField: 'confirm_password' })}
                    />
                </Item>
                {this.renderFieldError('confirm_password')}

                <Button
                    info
                    block
                    rounded
                    style={[common.mt25]}
                    onPress={this.goToProfileSetup}
                >
                    <Text>SETUP PROFILE</Text>
                </Button>
            </View>
        );
    };

    render () {
        const { step, loading } = this.state;

        return (
            <Form style={[common.px10]}>
                { step === 1 
                    ? this.renderAccountFields() : 
                    <ProfileEditor 
                        loading={loading}
                        submitText="SIGN UP" 
                        onSubmit={this.submitRegister}
                        navigation={this.props.navigation}
                    /> 
                }
            </Form>
        );
    }
};

export default Signup;