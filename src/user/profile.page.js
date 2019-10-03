import React from "react";
import { MapView } from "expo";
import Meteor, { withTracker } from "react-native-meteor";
import { Text, Container, Content, Grid, Row, Col, Button, Icon, Card, CardItem, Thumbnail } from "native-base";

import { logout } from "../auth/data/api";

import common from "../styles/common";
import colors from "../styles/colors";
import UserAvatar from '../user/components/avatar';
import EmptyUser from "./components/empty-user";

class Profile extends React.Component {
    componentDidMount() {
        if (!this.props.user)
            return this.props.navigation.navigate("AuthStack");
    }

    render () {
        const { user } = this.props;

        return (
            <Container>
                <Content>
                    <Grid style={[common.pageHeaderGrid]}>
                        <Row style={[common.px10, common.pb15]}>
                            <Col>
                                <Text style={[common.pageHeaderText]}>
                                    My Profile
                                </Text>
                            </Col>
                            <Col style={[common.flexReverse]}>
                                <Button
                                    dark
                                    transparent
                                    androidRippleColor={colors.warning}
                                    onPress={user ? logout : () => this.props.navigation.navigate("AuthStack")}
                                >
                                    <Icon name={ user ? "sign-out" : "sign-in" }/>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>

                    {!!user ? (
                        <Card>
                            <CardItem cardBody>
                                <MapView
                                    scrollEnabled={false}
                                    style={{ flex: 1, height: 150 }}
                                    initialRegion={{
                                        latitude: user.profile.city.coordinates[1],
                                        longitude: user.profile.city.coordinates[0],
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                >
                                    <MapView.Marker
                                        coordinate={{
                                            latitude: user.profile.city.coordinates[1],
                                            longitude: user.profile.city.coordinates[0],
                                        }}
                                    />
                                </MapView>
                            </CardItem>

                            <CardItem button onPress={() => this.props.navigation.navigate('ProfileEditPage')}>
                                <Grid>
                                    <Row>
                                        <Col size={1}>
                                            <UserAvatar user={user} />
                                        </Col>

                                        <Col size={3} style={[common.pt5]}>
                                            <Text>{user.profile.name}</Text>
                                            <Text note>{user.emails[0].address}</Text>
                                            <Text note>{user.profile.city.description}</Text>
                                        </Col>
                                    </Row>
                                </Grid>
                            </CardItem>
                        </Card>
                    ) : (
                        <EmptyUser onLoginPress={() => this.props.navigation.navigate("AuthStack")}/>
                    )}
                </Content>
            </Container>    
        );
    };  
}

export default withTracker(props => {
    const user = Meteor.user();
    // console.log(user);

    return {
        user,
        ...props,
    };
})(Profile);