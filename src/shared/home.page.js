import React from "react";
import { Content, Container, Icon, Input, Item } from "native-base";

import Theme from "../../native-base-theme/variables/platform";
import common from "../styles/common";

import UpcomingParcels from '../parcel/containers/upcoming';

class HomePage extends React.Component {
    render () {
        const { navigation } = this.props;

        return (
            <Container>
                <Content style={[Theme.Inset.portrait]}>
                    <Item
                        rounded
                        onPress={() => navigation.navigate("Search")}
                        style={[common.ml10, common.mr10, common.my15]}
                    >
                        <Icon name="search"/>
                        <Input
                            editable={false}
                            onTouchStart={() => navigation.navigate("Search")}
                            placeholder="Find travelers or become one..." />
                    </Item>

                    <UpcomingParcels />
                </Content>
            </Container>
        );
    };
};

export default HomePage;