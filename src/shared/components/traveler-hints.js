
import React from "react";
import { View, Text } from "native-base";

import common from "../../styles/common";

const TravelerHints = () => (
    <View>
        <Text style={[common.fontBold, common.textSuccess]}>
            WHAT IS TRAVELER?
        </Text>

        <Text style={[common.pt10, common.pb15]}>
            You're traveling somewhere and have some empty space in your luggage and you're willing to deliver a parcel? You can be a traveler on Naao.
        </Text>
        <Text style={[common.fontBold, common.textSuccess]}>
            HOW DOES IT WORK?
        </Text>

        <Text style={[common.pt10, common.pb15]}>
            All you have to do is, post your trip on Naao. We will walk you through the process step by step.
            Once posted, senders will offer you their price with details of their parcel. You're at 100% liberty to accept/reject/negotiate their offer.
        </Text>
    </View>
);

export default TravelerHints;