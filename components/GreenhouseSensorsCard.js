import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SensorReading = ({ label, value }) => (
  <View style={styles.sensor}>
    <Text style={styles.sensorLabel}>{label}</Text>
    <Text style={styles.sensorValue}>{value}</Text>
  </View>
);

const GreenhouseSensorsCard = ({ sensors, date, time }) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 14, padding: 10 }}>
          Date : {date}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>temps: {time}</Text>
      </View>
      <View style={styles.card}>
        <SensorReading label="Température" value={`${sensors.temperature}°C`} />
        <SensorReading label="Humidité" value={`${sensors.humidity}%`} />
        <SensorReading label="Eclairage" value={`${sensors.light} lux`} />
        <SensorReading
          label="Humidité du sol"
          value={`${sensors.soilMoisture}%`}
        />
        <SensorReading label="Temp du sol" value={`${sensors.soilTemp} °C`} />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 1,
          borderColor: "lightgrey",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 14, padding: 10 }}>
          Notes
        </Text>
        <Text style={{ fontSize: 14, padding: 10 }}>{sensors.note}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
  },
  card: {
    padding: 20,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sensor: {
    width: "45%",
    height: 100,
    padding: 10,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  sensorLabel: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  sensorValue: {
    textAlign: "center",
  },
});

export default GreenhouseSensorsCard;
