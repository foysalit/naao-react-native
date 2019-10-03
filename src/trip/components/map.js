import React from 'react';
import { MapView } from 'expo';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
    map: { flex: 1, height: 150 }
});

const Map = ({ trip = {}, style={}, onMapDrawn }) => {
    let map;
    const fromLatLng = { latitude: trip.from.coordinates[1], longitude: trip.from.coordinates[0] },
        toLatLng = { latitude: trip.to.coordinates[1], longitude: trip.to.coordinates[0] };

    const onLayout = () => {
        setTimeout(() => map && map.fitToSuppliedMarkers(['from', 'to'], true), 100);

        if (typeof onMapDrawn === 'function')
            onMapDrawn(map);
    };

    return (
        <MapView
            onLayout={onLayout}
            style={[styles.map, style ]}
            ref={mapRef => map = mapRef}
            initialRegion={{
                ...fromLatLng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            <MapView.Marker
                description={`Any sender from the nearby area will be able to request delivery for their parcel`}
                title={`From ${trip.from.description}`}
                coordinate={fromLatLng}
                identifier="from"
            />
            <MapView.Marker
                description={`Any sender looking to send their parcel to ${trip.to.description} will be able to request delivery for their parcel`}
                title={`To ${trip.to.description}`}
                coordinate={toLatLng}
                identifier="to"
            />

            <MapView.Polyline
                strokeWidth={2}
                geodesic={true}
                lineCap="round"
                strokeColor={colors.danger}
                coordinates={[fromLatLng, toLatLng]} />
        </MapView>
    );
};

Map.propTypes = {
    trip: PropTypes.object.isRequired,
    onMapDrawn: PropTypes.func,
    style: PropTypes.object,
};

export default Map;