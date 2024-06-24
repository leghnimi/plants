import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const LocationSuggestions = ({ locations, onSelect }) => {
  return (
    <View style={styles.container}>
      {locations.map((location, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestion}
          onPress={() => onSelect(location.name)}
        >
          <Text>{location.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  suggestion: {
    padding: 10,
  },
});

export default LocationSuggestions;
