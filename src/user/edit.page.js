import React from "react";
import Meteor, { withTracker } from "react-native-meteor";
import { Header, Container, Content, Button, Icon, Left, Right, Body, View } from "native-base";

import { updateProfile } from "./data/api";
import { getProfilePic } from "../images/api";

import common from "../styles/common";
import ProfileEditor from "./containers/profile-editor";

class Edit extends React.Component {
    state = {
        loading: false
    };

    updateProfile = async (profile) => {
        this.setState({ loading: true });
        await updateProfile(profile);
        this.setState({ loading: false });
        this.props.navigation.goBack();
    };

    render () {
        const { loading } = this.state;

        let profileData = {};

        if (this.props.user) {
            profileData = this.props.user.profile;
            profileData.cityName = profileData.city.description;
            profileData.pic = getProfilePic(this.props.user);
        }

        return (
            <Container style={[common.bgBackground]}>
                <Header transparent noShadow>
                    <Left>
                        <Button
                            light
                            transparent
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Icon name="arrow-left" />
                        </Button>
                    </Left>
                    <Body />
                </Header>

                <Content>
                    <View style={[ common.px15 ]}>
                        <ProfileEditor 
                            loading={loading}
                            submitText="SAVE"
                            profileData={profileData}
                            onSubmit={this.updateProfile} 
                            navigation={this.props.navigation}
                        />
                    </View>
                </Content>
            </Container>
        );
    };
};

export default withTracker(props => {
    const user = Meteor.user();

    return {
        user,
        ...props,
    };
})(Edit);