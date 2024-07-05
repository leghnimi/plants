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
import { AppContext } from "../AppContext";
export default function EngineerInputScreen() {
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [action, setAction] = useState("");
  const [details, setDetails] = useState("");
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
        if (isMounted) {
          setGreenhouses(data);
        }
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/greenhouse/${selectedGreenhouse}/engineer-actions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date,
            action,
            details,
          }),
        }
      );

      if (response.ok) {
        alert("Action enregistrée avec succès");
        setAction("");
        setDetails("");
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
      <Text style={styles.title}>Actions de l'ingénieur</Text>

      <ScrollView style={{width:"100%"}}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sélectionner une serre</Text>
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

        <View style={styles.dateContainer}>
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
            <Text style={styles.buttonText}>Choisir la date</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>
            Date : {date.toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Action effectuée</Text>
          <Picker
            selectedValue={action}
            onValueChange={(itemValue) => setAction(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner une action" value="" />
            <Picker.Item label="Fertilisation" value="Fertilisation" />
            <Picker.Item label="Irrigation" value="Irrigation" />
            <Picker.Item label="Contrôle de température" value="controle de temperature" />
            <Picker.Item label="Contrôle des parasites" value="controle de parasites" />
            <Picker.Item label="Taille" value="Taille" />
            <Picker.Item label="Pollinisation" value="Pollinisation" />
            <Picker.Item label="Ajustement de l'éclairage" value="Ajustement de leclairage" />
            <Picker.Item label="Récolte" value="Recolte" />
            <Picker.Item label="Évaluation de la santé des plantes" value="Evaluation de la sante des plantes" />
            <Picker.Item label="Maintenance de l'équipement" value="Maintenance de lequipement" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Détails de l'action</Text>
          <TextInput
            multiline
            numberOfLines={4}
            onChangeText={setDetails}
            value={details}
            placeholder="Entrez les détails de l'action ici"
            style={styles.textInput}
          />
        </View>

        <View style={styles.submitContainer}>
          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text style={styles.submitButtonText}>
                Enregistrer l'action
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
  inputContainer: {
    width: "100%",
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  picker: {
    flex: 1,
  },
  dateContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
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
    fontWeight: "bold",
  },
  dateText: {
    fontWeight: "bold",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
  },
  submitContainer: {
    width: "90%",
    alignItems: "center",
    marginVertical: 15,
    alignSelf: "center",
  },
  submitButton: {
    backgroundColor: "green",
    borderRadius: 25,
    padding: 15,
    width: "80%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutContainer: {
    width: "90%",
    alignItems: "center",
    marginTop: 20,
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