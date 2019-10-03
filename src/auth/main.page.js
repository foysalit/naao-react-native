import React from 'react';
import { Button, Icon, View, Text, Content, Container, Header, Right, Left, Body } from 'native-base';

import common from '../styles/common';

import Signin from './containers/signin';
import Signup from './containers/signup';
import Forgot from './containers/forgot';

class AuthPage extends React.Component {
    backAction = null;
    state = {
        backIcon: 'times',
        section: 'signin',
    };

    setBackAction = (backIcon, backAction) => {
        this.setState({ backIcon });
        this.backAction = backAction;
    };

    goBack = () => {
        if (this.backAction) {
            this.backAction();
        } else {
            this.props.navigation.goBack();
        }
    };

    changeSection = () => {
        let section = 'signin';

        if (this.state.section === 'signin') {
            section = 'signup';
        }

        this.setState({ section });
    };

    onSignin = () => {
        const { navigation } = this.props,
            { state: { params } } = navigation;

        // console.log('signed in', params);
        if (params && params.onComplete) {
            return params.onComplete();
        }

        if (params && params.returnTo) {
            navigation.navigate(params.returnTo);
        } else {
            navigation.navigate("Home");
        }
    };

    render() {
        const sectionMap = {
            signin: Signin,
            signup: Signup,
            forgot: Forgot,
        };
        const menuMap =  {
            signin: 'user-circle',
            signup: 'sign-in'
        };

        const { section, backIcon } = this.state,
            CurrentSection = sectionMap[section],
            CurrentMenuIcon = menuMap[section];

        return (
            <Container style={[common.bgBackground]}>
                <Header transparent noShadow>
                    <Left>
                        <Button
                            light
                            transparent
                            onPress={this.goBack}
                        >
                            <Icon name={backIcon} />
                        </Button>
                    </Left>
                    <Body />
                    <Right>
                        <Button
                            light
                            transparent
                            onPress={this.changeSection}
                        >
                            <Icon name={CurrentMenuIcon} />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <View style={[common.my20, common.mx10,]}>
                        <CurrentSection
                            onSignin={this.onSignin}
                            navigation={this.props.navigation}
                            setBackAction={this.setBackAction} />
                    </View>
                </Content>
            </Container>
        );
    };
};

export default AuthPage;