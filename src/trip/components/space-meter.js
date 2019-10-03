import React from "react";
import { Text, Col, Row, Grid } from "native-base";

import common from "../../styles/common";
const cardTitleStyle = [common.pl10, common.py10, common.textSuccess, common.fontBold, { fontSize: 13 }];

const SpaceMeter = ({ totalSpace = {}, availableSpace = {} }) => {
    const fullWidth = totalSpace.weight - availableSpace.weight,
        emptyWidth = availableSpace.weight;

    return (
        <Grid>
            <Row style={[common.pr15, common.pt10]}>
                <Col size={2}>
                    <Text style={cardTitleStyle}>SPACE REMAINING</Text>
                </Col>
                <Col size={1}>
                    <Text style={[common.cardListInfoText, common.py10]}>{availableSpace.weight} / {totalSpace.weight}KG</Text>
                </Col>
            </Row>
            <Row style={[common.px10, common.pb10]}>
                <Col
                    size={fullWidth}
                    style={[fullWidth < 1 ? common.bgDark : common.bgDanger, common.py15, common.btlr20, common.bblr20]}></Col>
                <Col
                    size={emptyWidth}
                    style={[emptyWidth < 1 ? common.bgDanger : common.bgDark, common.py15, common.btrr20, common.bbrr20]}></Col>
            </Row>
        </Grid>
    );
};

export default SpaceMeter;