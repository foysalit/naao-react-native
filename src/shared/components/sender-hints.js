
import React from "react";
import { View, Text } from "native-base";

import common from "../../styles/common";

const SenderHints = () => (
    <View>
        <Text style={[common.fontBold, common.textSuccess]}>
            WHAT IS SENDER?
        </Text>

        <Text style={[common.pt10, common.pb15]}>
            If you have a parcel you want to send from one place to another through a human being who you can talk/meet and trust then you're a SENDER in Naao App.
        </Text>
    </View>
);

export default SenderHints;