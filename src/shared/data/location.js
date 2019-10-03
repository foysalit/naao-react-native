import Meteor, { ReactiveDict } from 'react-native-meteor';

const city = new ReactiveDict('state/city');
city.set('loading', false);
city.set('results', []);
city.set('error', null);
city.set('query', '');

export const getCity = (key = '') => {
    return city.get(key);
};

export const updateCity = (key, data) => {
    return city.set(key, data);
};

export const findCity = () => {
    const query = getCity('query');
    
    if (query.length < 2) {
        return;
    }

    updateCity('loading', true);

    Meteor.call('location.city.autocomplete', query, (err, data) => {
        updateCity('loading', false);

        if (err) {
            updateCity('results', []);
            updateCity('error', err.message);
            return;
        }

        updateCity('error', null);
        updateCity('results', data);
    });
};