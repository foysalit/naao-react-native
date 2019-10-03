import React from "react";
import { Container } from "native-base";

import LocationForm from '../shared/containers/location-form';

import { addRecentSearch, getSearch } from "./data/api";

export default class SearchPage extends React.Component {
    handleSubmit = ({type}) => {
        if (type === 'sender') {
            addRecentSearch(getSearch('inputs'));
            return this.props.navigation.navigate("SearchResult");
        }

        this.props.navigation.navigate("HomeStackTripCreate");
    };

    render (props) {
        return (
            <Container>
                <LocationForm 
                    onBack={() => this.props.navigation.goBack(null)}
                    onSubmitted={this.handleSubmit} 
                />
            </Container>
        );
    };
};