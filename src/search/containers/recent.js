import React from 'react';
import { withNavigation } from 'react-navigation';
import { View, Text, ListItem, List, Body } from 'native-base';

import common from '../../styles/common';
import { getRecentSearch, updateSearch } from '../data/api';

class Recent extends React.Component {
    state = {
        searches: []
    };

    redoSearch (search) {
        updateSearch('inputs', search);
        this.props.navigation.navigate('SearchResult');
    };

    componentWillMount () {
        getRecentSearch().then(searches => this.setState({ searches }));
    };

    render () {
        const { searches } = this.state;

        if (searches.length < 1)
            return null;

        return (
            <View style={[ common.pb20 ]}>
                <Text style={[ common.textSuccess, common.fontBold, common.pb10 ]}>
                    RECENT SEARCHES
                </Text>

                <List>
                    {searches.map(search => (
                        <ListItem 
                            style={[common.ml0]}
                            onPress={() => this.redoSearch(search)}
                            key={`${search.from.description}_${search.to.description}`}>
                            <Body>
                                <Text style={[common.ml0, common.fontBold]}>{ search.from.description }</Text>
                                <Text note style={[common.ml0]}>{ search.to.description }</Text>
                            </Body>
                        </ListItem>
                    ))}
                </List>
            </View>
        );
    };
};

export default withNavigation(Recent);