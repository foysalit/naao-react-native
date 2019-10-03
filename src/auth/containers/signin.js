import React from 'react';
import PropTypes from 'prop-types';
import { Image, Alert } from 'react-native';
import { Accounts } from 'react-native-meteor';
import { Form, Item, Label, Icon, Input, Button, Text, Spinner, View } from 'native-base';

import colors from '../../styles/colors';
import common from '../../styles/common';
import coloredForm from '../../styles/colored-form';

import { login } from '../data/api';
const Logo = require('../../shared/images/naao-logo.png');

class Signin extends React.Component {
    state = {
        email: "",
        password: "",
        loading: false,
        showPass: true,
        showForgot: false,
        focusedField: null,
    };

    componentDidMount() {
        this.props.setBackAction('close');
    };

    placeholderText(fieldName) {
        const placeholders = {
            'email': 'Email Address',
            'password': 'Password',
        };

        if (this.state.focusedField === fieldName)
            return "";

        return placeholders[fieldName];
    };

    handleInput(field, text) {
        this.setState({ [field]: text });
    };

    submitLogin = () => {
        if (this.props.isLoggingIn)
            return;

        const { email, password } = this.state;

        if (email.length < 1) {
            return this.email._root.focus();
        }

        if (password.length < 1) {
            return this.password._root.focus();
        }

        this.setState({ loading: true });
        login(email, password, (err) => {
            this.setState({ loading: false });
            console.log('signin complete', err);
            if (!err) {
                this.props.onSignin();
            }
        });
    };

    submitForgot = () => {
        const { email } = this.state;

        if (email.length < 1) {
            return Alert.alert("Email Missing", "Please insert your email address to receive the reset password link");
        }

        this.setState({ loading: true });
        Accounts.forgotPassword({ email }, (err) => {
            this.setState({ loading: false });
            
            if (err) {
                return Alert.alert("Oops!", err.reason);
            }

            Alert.alert(
                "Email Sent", 
                `Check your inbox and follow instructions to reset your password for your account with email address ${email}`,
                [{text: 'GOT IT', onPress: () => this.setState({ showForgot: false })}]
            );
        });
    };

    emailSubmitted = () => {
        if (this.state.showForgot)
            return this.submitForgot();

        if (this.state.password.length < 6)
            this.password._root.focus();
        else
            this.submitLogin();
    };

    render() {
        const { email, password, loading } = this.state;

        return (
            <Form style={[common.px10]}>
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
                    <Icon 
                        name="envelope" 
                        style={[coloredForm.itemIcon]} />

                        <Input
                            name="email"
                            value={email}
                            autoCorrect={false}
                            returnKeyType="next"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={[coloredForm.input]}
                            ref={ref => (this.email = ref)}
                            placeholderTextColor={colors.primary}
                            onSubmitEditing={this.emailSubmitted}
                            placeholder={this.placeholderText("email")}
                            onChangeText={this.handleInput.bind(this, 'email')}
                            onBlur={() => this.setState({ focusedField: null })}
                            onFocus={() => this.setState({ focusedField: 'email' })} />
                </Item>

                {!this.state.showForgot ? (
                    <React.Fragment>
                        <Label style={[coloredForm.label]}>
                            PASSWORD
                        </Label>
                        <Item 
                            rounded
                            style={[coloredForm.item]}
                        >
                            <Icon 
                                name="key" 
                                style={[coloredForm.itemIcon]} />

                                <Input
                                    value={password}
                                    returnKeyType="go"
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    keyboardType="default"
                                    style={[coloredForm.input]}
                                    ref={ref => (this.password = ref)}
                                    secureTextEntry={this.state.showPass}
                                    placeholderTextColor={colors.primary}
                                    onSubmitEditing={this.submitLogin.bind(this)}
                                    placeholder={ this.placeholderText("password") }
                                    onBlur={() => this.setState({ focusedField: null })}
                                    onChangeText={this.handleInput.bind(this, 'password')}
                                    onFocus={() => this.setState({ focusedField: 'password' })} />
                        </Item>

                        <Button
                            info
                            block
                            rounded
                            disabled={loading}
                            onPress={this.submitLogin}
                            style={[common.mt25]}
                            androidRippleColor={colors.cadetBlue}
                        >
                            {loading 
                                ? <Spinner color={ colors.light } /> 
                                : <Text style={[ common.textCadetBlue ]}>SIGN IN</Text>
                            }
                        </Button>

                        <Button
                            light
                            transparent
                            onPress={() => this.setState({ showForgot: true })}
                        >
                            <Text>Forgot Password?</Text>
                        </Button>
                    </React.Fragment>
                ) : (
                    <Button
                        info
                        block
                        rounded
                        disabled={loading}
                        style={[common.mt25]}
                        onPress={this.submitForgot}
                        androidRippleColor={colors.cadetBlue}
                    >
                        {loading
                            ? <Spinner color={colors.light} />
                            : <Text style={[common.textCadetBlue]}>GET RESET LINK</Text>
                        }
                    </Button>
                )}
            </Form>
        );
    }
};

Signin.propTypes = {
    navigation: PropTypes.object,
    onSignin: PropTypes.func.isRequired,
    setBackAction: PropTypes.func.isRequired,
};

export default Signin;