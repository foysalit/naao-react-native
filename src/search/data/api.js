import { AsyncStorage } from "react-native";
import { ReactiveDict } from 'react-native-meteor';

const state = new ReactiveDict('state/search');

export const getSearch = (key='') => {
    return state.get(key);
};

export const updateSearch = (key, data) => {
    // inputs are appendable, instead of overwriting, append to the object
    if (key === 'inputs') {
        let current = getSearch(key);
        data = {...current, ...data};
    }

    // console.log('updateSearch', data);
    return state.set(key, data);
};

const recentSearchKey = 'search.recent';
export const getRecentSearch = async () => {
    const searches = await AsyncStorage.getItem(recentSearchKey);

    if (searches !== null) {
        return JSON.parse(searches)
            .filter(s => typeof(s) === 'object');
    }

    return [];
};

export const addRecentSearch = async (search) => {
    let searches = await getRecentSearch();
    const exists = searches.find(s => s.from.description === search.from.description && s.to.description === search.to.description);

    if (exists) {
        return searches;
    }
    
    searches = [search, ...searches];

    if (searches.length > 10) {
        searches.pop();
    }

    await AsyncStorage.setItem(recentSearchKey, JSON.stringify(searches));
    return searches;
};