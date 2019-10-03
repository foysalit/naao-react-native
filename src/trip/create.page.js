import React from "react";
import { Alert } from "react-native";
import { Content, Container } from "native-base";
import Meteor, { withTracker } from 'react-native-meteor';
import { NavigationActions, StackActions } from "react-navigation";

import MeasurementForm from '../shared/containers/measurement-form';
import ScheduleForm from "../shared/containers/schedule-form";
import ParcelHint from "../parcel/components/hint";

import { getSearch } from "../search/data/api";
import { createTrip } from "./data/api";

class TripCreatePage extends React.Component {
    state = {
        currentForm: 1,
    };

    createTrip = (data) => {
        const tripData = { ...getSearch('inputs'), ...data };
        createTrip(tripData, (err, res) => {
            if (err) {
                return Alert.alert(
                    "Something broke!", 
                    `Sorry we are facing technical issue publishing your trip. Please try again later or contact us with the following error message: ${err.message}`
                );
            }

            Promise.all([
                this.props.navigation.dispatch(
                    StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'TabStack' })]
                    })
                )
            ]).then(() => this.props.navigation.navigate("TripList"));
        });
    };

    attemptToCreateTrip(data) {
        let title = 'Post your trip',
            message = 'Once posted, senders will be able to book parcels for you to deliver. Are you ready to roll?';

        let confirmButton = { 
            text: 'Publish Trip', 
            onPress: () => this.createTrip(data)
        };

        if (!this.props.userId) {
            message = `Before you publishing your trip, we need you to create an account so that you can communicate with senders on our platform. It will just take a minute`;

            confirmButton = {
                text: 'Setup Account',
                onPress: () => this.props.navigation.navigate("AuthStack", { onComplete: () => this.createTrip(data) })
            };
        }

        Alert.alert(
            title, message,
            [
                confirmButton,
                { text: 'Make More Changes' },
            ],
        );

        return;
    };

    // direction 1 is forward and -1 is backward
    handleFormSubmit = (direction = 1, data = {}) => {
        const { currentForm } = this.state;

        if (currentForm === 1 && direction < 0) {
            return this.props.navigation.goBack();
        }

        if (currentForm === 2 && direction > 0) {
            return this.attemptToCreateTrip(data);
        }

        this.setState({ currentForm: direction > 0 ? currentForm + 1 : currentForm - 1 });
    };

    render(props) {
        return (
            <Container>
                <Content>
                    { this.state.currentForm === 1 ? (
                        <ScheduleForm
                            onBack={() => this.handleFormSubmit(-1)}
                            onSubmitted={(data) => this.handleFormSubmit(1, data)} 
                        />
                    ) : (
                        <MeasurementForm
                            onBack={() => this.handleFormSubmit(-1)}
                            onSubmitted={(data) => this.handleFormSubmit(1, data)} />
                    )}

                    <ParcelHint />
                </Content>
            </Container>
        );
    };
};

export default withTracker(props => {
    const userId = Meteor.userId(),
        searchInputs = getSearch('inputs');

    return {
        userId,
        searchInputs,
        ...props,
    };
})(TripCreatePage);