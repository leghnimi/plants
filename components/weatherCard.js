import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

export default function WeatherCard({ wind, temperature, humidity }) {
  return (
    <View style={styles.card}>
      <View style={styles.section}>
        <Text style={styles.title}>Vent</Text>
        <Feather name="wind" size={24} color="green" />
        <Text style={styles.value}>{wind} Km/h</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Température</Text>
        <FontAwesome6 name="temperature-quarter" size={24} color="red" />
        <Text style={styles.value}>{temperature} °C</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Humidité</Text>
        <Entypo name="water" size={24} color="blue" />
        <Text style={styles.value}>{humidity} %</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  section: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontWeight: "bold",
  },
  value: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 18,
  },
});
