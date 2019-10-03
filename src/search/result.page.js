import React from "react";
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { StyleSheet, ScrollView } from 'react-native';
import Meteor, { withTracker } from 'react-native-meteor';
import { View, Input, Item, Icon, Text, Button, Container, Spinner, Content } from "native-base";

import common from '../styles/common'; 

import EmptySearch from './components/empty-search';
import TripSummary from '../trip/components/summary';
import ScheduleForm from '../shared/containers/schedule-form';
import MeasurementForm from '../shared/containers/measurement-form';

import { isMyTrip } from "../trip/data/helpers";
import { getSearch, updateSearch } from "./data/api";
import { getAllTrips, subscribeToTripsList } from "../trip/data/api";

const styles = StyleSheet.create({
    header: {
        ...common.pt20,
        ...common.pb15,
        ...common.px15,
        elevation: 2,
        shadowColor: '#ECECEC',
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    filterButton: {
        ...common.mr10,
        ...common.px15,
    },
    filterContainer: {
        flexDirection: 'row',
        ...common.mt15,
    }
});

class SearchResult extends React.Component {
    static defaultProps = {
        trips: [],
        navigation: {},
        searchInputs: {},
        tripsLoading: true,
    };

    state = {
        filterForm: null,
    };

    renderFilterForm () {
        const { filterForm } = this.state;
        const { searchInputs, navigation } = this.props;

        if (!filterForm) {
            return (
                <View style={[styles.header]}>
                    <Item
                        rounded
                        onPress={() => navigation.goBack()} >
                        <Icon name="search" />
                        <Input
                            editable={false}
                            onTouchStart={() => navigation.goBack()}
                            value={`From ${searchInputs.from.description} To ${searchInputs.to.description}`} />
                    </Item>

                    <View style={[styles.filterContainer]}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {searchInputs.collectBy ? (
                                <Button
                                    small
                                    info
                                    rounded
                                    style={[styles.filterButton]}
                                    onPress={() => updateSearch('inputs', { collectBy: null, deliveryBy: null })}
                                >
                                    <Text>
                                        {format(searchInputs.collectBy, 'MMM DD, YYYY')} - {format(searchInputs.deliveryBy, 'MMM DD, YYYY')}
                                    </Text>
                                    <Icon name="times"/>
                                </Button>
                            ) : (
                                    <Button
                                        small
                                        danger
                                        rounded
                                        style={[styles.filterButton]}
                                        onPress={() => this.setState({ filterForm: 'schedule' })}
                                    >
                                        <Text>Date</Text>
                                    </Button>
                            )}

                            {searchInputs.totalSpace ? (
                                <Button
                                    small
                                    info
                                    rounded
                                    style={[styles.filterButton]}
                                    onPress={() => updateSearch('inputs', { totalSpace: null })}
                                >
                                    <Text>At least {searchInputs.totalSpace.len}x{searchInputs.totalSpace.width}x{searchInputs.totalSpace.height} {searchInputs.totalSpace.unit} & {searchInputs.totalSpace.weight} KG</Text>
                                    <Icon name="times" />
                                </Button>
                            ) : (
                                <Button
                                    small
                                    danger
                                    rounded
                                    style={[styles.filterButton]}
                                    onPress={() => this.setState({filterForm: 'measurement'})}
                                >
                                    <Text>Size & Weight</Text>
                                </Button>
                            )}
                        </ScrollView>
                    </View>
                </View>
            );
        }

        if (filterForm === 'schedule') {
            return (
                <ScheduleForm
                    submitText="APPLY FILTERS"
                    onBack={() => this.setState({ filterForm: null })}
                    onSubmitted={(data) => this.setState({ filterForm: null})}
                />
            );
        }

        if (filterForm === 'measurement') {
            return (
                <MeasurementForm 
                    submitText="APPLY FILTERS"
                    onBack={() => this.setState({ filterForm: null })}
                    onSubmitted={(data) => {
                        updateSearch('inputs', data); 
                        this.setState({ filterForm: null});
                    }}
                />
            );
        }

        return null;
    };

    openTripPage = (trip) => {
        const page = isMyTrip(trip) ? 'HomeStackTripTravelerView' : 'HomeStackTripSenderView';
        // console.log({page, trip});
        this.props.navigation.navigate(page, { trip });
    };
    
    render () {
        const { trips, tripsLoading } = this.props;

        return  (
            <Container>
                <Content>
                    { this.renderFilterForm() }

                    <View style={[common.px10, common.mt15]}>
                        {tripsLoading
                            ? <Spinner />
                            : trips.length > 0 ? trips.map(trip => <TripSummary
                                onPress={() => this.openTripPage(trip)}
                                showMap={false}
                                key={trip._id}
                                trip={trip} />
                            ) : <EmptySearch />
                        }
                    </View>
                </Content>
            </Container>
        );
    };
}

SearchResult.propTypes = {
    searchInputs: PropTypes.object.isRequired,
    tripsLoading: PropTypes.bool.isRequired,
    navigation: PropTypes.object.isRequired,
    trips: PropTypes.array.isRequired,
};

export default withTracker(props => {
    const searchInputs = getSearch('inputs'),
        filters = {};

    if (searchInputs.from) {
        filters['from.description'] = { $regex: searchInputs.from.description.split(", ").join("|"), $options: 'ig' };
    }

    if (searchInputs.to) {
        filters['to.description'] = { $regex: searchInputs.to.description.split(", ").join("|"), $options: 'ig' };
    }

    if (searchInputs.collectBy) {
        filters.collectBy = { $lte: searchInputs.collectBy };
    }

    if (searchInputs.deliverBy) {
        filters.deliverBy = { $lte: searchInputs.deliverBy };
    }

    if (Meteor.userId()) {
        filters.travelerId = {$ne: Meteor.userId()};
    }

    const subTrips = subscribeToTripsList(filters),
        tripsLoading = !subTrips.ready(),
        trips = tripsLoading ? [] : getAllTrips(filters);

    // console.log({ filters });
    return {
        searchInputs,
        tripsLoading,
        trips,
        ...props,
    };
})(SearchResult);