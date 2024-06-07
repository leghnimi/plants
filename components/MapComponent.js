import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

const MapComponent = ({ latitude, longitude }) => {
  const coordinates = {
    latitude,
    longitude,
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={coordinates}
        title="Location"
        description="This is the location"
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapComponent;