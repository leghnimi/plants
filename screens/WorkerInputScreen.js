import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import { AppContext } from "../AppContext";

export default function WorkerInputScreen() {
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [temperatureInput, setTemperatureInput] = useState("");
  const [humidity, setHumidity] = useState(0);
  const [humidityInput, setHumidityInput] = useState("");
  const [soilTemp, setSoilTemp] = useState(0);
  const [soilTempInput, setSoilTempInput] = useState("");
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [soilMoistureInput, setSoilMoistureInput] = useState("");
  const [light, setLight] = useState(0);
  const [lightInput, setLightInput] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AppContext);

  useEffect(() => {
    let isMounted = true;
    const fetchGreenhouses = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/greenhouses`
        );
        const data = await response.json();
        setGreenhouses(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGreenhouses();
      
    return () => {
      isMounted = false;
    };
  }, []);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const handleUploadSensorData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/greenhouse/${selectedGreenhouse}/sensor-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date,
            time,
            temperature,
            humidity,
            soilTemp,
            soilMoisture,
            light,
            note,
          }),
        }
      );

      if (response.ok) {
        alert("Données ajoutées avec succès");
        setTemperature(0);
        setTemperatureInput("");
        setHumidity(0);
        setHumidityInput("");
        setSoilTemp(0);
        setSoilTempInput("");
        setSoilMoisture(0);
        setSoilMoistureInput("");
        setLight(0);
        setLightInput("");
        setNote("");
        setLoading(false);
      } else {
        setLoading(false);
        const errorData = await response.json();
        console.log(errorData);
        alert(`Erreur: ${errorData.message}`);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Une erreur est survenue");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background.jpg")}
        style={styles.image}
      />
      <Text style={styles.title}>Saisie des données</Text>

      <ScrollView>
        <View style={styles.inputContainer}>
          <Text style={styles.sensorsText}>
            Veillez choisir la seree ci dessous
          </Text>
          <View style={styles.pickerContainer}>
            <MaterialCommunityIcons name="greenhouse" size={20} color="#000" />
            <Picker
              selectedValue={selectedGreenhouse}
              onValueChange={(itemValue) => setSelectedGreenhouse(itemValue)}
              style={styles.picker}
            >
              {greenhouses.map((greenhouse, index) => (
                <Picker.Item
                  key={index}
                  label={greenhouse.greenhouseName}
                  value={greenhouse.greenhouseName}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.dateAndTimeContainer}>
          <View style={styles.datePicker}>
            {showDatePicker && (
              <DateTimePicker
                testID="datePicker"
                value={date}
                mode={"date"}
                display="default"
                onChange={onDateChange}
              />
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.buttonText}>Choisir date</Text>
            </TouchableOpacity>
            <Text style={styles.dateAndTimeText}>
              date : {date.toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.datePicker}>
            {showTimePicker && (
              <DateTimePicker
                testID="timePicker"
                value={time}
                mode={"time"}
                is24Hour={true}
                display="default"
                onChange={onTimeChange}
              />
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.buttonText}>choisir temps</Text>
            </TouchableOpacity>
            <Text style={styles.dateAndTimeText}>
              temps : {time.toLocaleTimeString()}
            </Text>
          </View>
        </View>
        <View style={styles.sensorsContainer}>
          <View>
            <View>
              <Text style={styles.sensorsText}>
                Temperature: {temperature.toFixed(3)} °C
              </Text>
              <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="red"
                maximumTrackTintColor="blue"
                value={temperature}
                onValueChange={(value) => {
                  setTemperature(value);
                  setTemperatureInput(value.toString());
                }}
              />
            </View>
            <View style={styles.inputContainerSensors}>
              <TextInput
                onChangeText={(value) => {
                  setTemperatureInput(value);
                  setTemperature(parseFloat(value) || 0);
                }}
                value={temperatureInput}
                placeholder="ou bien saisir la temperature ici"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={styles.sensorsContainer}>
          <View style={{ marginTop: 25 }}>
            <View>
              <Text style={styles.sensorsText}>
                Humidité: {humidity.toFixed(1)} %
              </Text>
              <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="blue"
                maximumTrackTintColor="gray"
                value={humidity}
                onValueChange={(value) => {
                  setHumidity(value);
                  setHumidityInput(value.toString());
                }}
              />
            </View>
            <View style={styles.inputContainerSensors}>
              <TextInput
                onChangeText={(value) => {
                  setHumidityInput(value);
                  setHumidity(parseFloat(value) || 0);
                }}
                value={humidityInput}
                placeholder="ou bien saisir l'humidité ici"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={styles.sensorsContainer}>
          <View style={{ marginTop: 25 }}>
            <View>
              <Text style={styles.sensorsText}>
                Temérature du sol: {soilTemp.toFixed(1)} °C
              </Text>
              <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="red"
                maximumTrackTintColor="blue"
                value={soilTemp}
                onValueChange={(value) => {
                  setSoilTemp(value);
                  setSoilTempInput(value.toString());
                }}
              />
            </View>
            <View style={styles.inputContainerSensors}>
              <TextInput
                onChangeText={(value) => {
                  setSoilTempInput(value);
                  setSoilTemp(parseFloat(value) || 0);
                }}
                value={soilTempInput}
                placeholder="ou bien saisir température du sol ici"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={styles.sensorsContainer}>
          <View style={{ marginTop: 25 }}>
            <View>
              <Text style={styles.sensorsText}>
                Humidité du sol: {soilMoisture.toFixed(1)} %
              </Text>
              <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="blue"
                maximumTrackTintColor="gray"
                value={soilMoisture}
                onValueChange={(value) => {
                  setSoilMoisture(value);
                  setSoilMoistureInput(value.toString());
                }}
              />
            </View>
            <View style={styles.inputContainerSensors}>
              <TextInput
                onChangeText={(value) => {
                  setSoilMoistureInput(value);
                  setSoilMoisture(parseFloat(value) || 0);
                }}
                value={soilMoistureInput}
                placeholder="ou bien saisir l'humidité du sol ici"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={styles.sensorsContainer}>
          <View style={{ marginTop: 25 }}>
            <View>
              <Text style={styles.sensorsText}>
                Luminosité: {light.toFixed(1)} %
              </Text>
              <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="yellow"
                maximumTrackTintColor="gray"
                value={light}
                onValueChange={(value) => {
                  setLight(value);
                  setLightInput(value.toString());
                }}
              />
            </View>
            <View style={styles.inputContainerSensors}>
              <TextInput
                onChangeText={(value) => {
                  setLightInput(value);
                  setLight(parseFloat(value) || 0);
                }}
                value={lightInput}
                placeholder="ou bien saisir la luminosité ici"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={styles.sensorsContainer}>
          <TextInput
            multiline
            numberOfLines={4}
            onChangeText={setNote}
            value={note}
            placeholder="Notes"
            style={{
              width: "100%",
              height: 100,
              textAlign: "center",
              justifyContent: "flex-start",
            }}
          />
        </View>
        <View
          style={{ width: "100%", alignItems: "center", marginVertical: 15 }}
        >
          <Pressable
            style={styles.submitButton}
            onPress={handleUploadSensorData}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text
                style={{ fontSize: 16, color: "black", fontWeight: "bold" }}
              >
                Valider
              </Text>
            )}
          </Pressable>
        </View>
        <View style={styles.logoutContainer}>
          <Pressable
            style={styles.logoutButton}
            onPress={logout}
          >
            <Text style={styles.logoutButtonText}>
              Se déconnecter
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderBottomWidth: 1,
    width: "80%",
  },
  picker: {
    flex: 1,
  },
  datePicker: {
    padding: 10,
    marginTop: 10,
    width: "50%",
  },
  inputContainer: {
    width: "100%",
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "green",
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
  },
  sensorsContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  inputContainerSensors: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#000",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  sensorsText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  dateAndTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  dateAndTimeText: {
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: 10,
    fontWeight: "bold",
  },
  submitButton: {
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
    justifyContent: "center",
  },
  title: {
    marginTop: "10%",
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  logoutContainer: {
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  logoutButton: {
    backgroundColor: "red",
    borderRadius: 25,
    padding: 10,
    width: "50%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
