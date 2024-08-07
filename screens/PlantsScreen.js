import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ModalUniversal from "../components/ModalUniversal";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "../components/ImageViewer";
import { Picker } from "@react-native-picker/picker";

export default function PlantsScreen() {
  const [visibility, setVisibility] = useState(false);
  const [visibitlityGreenhouse, setVisibilityGreenhouse] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGreenhouse, setIsLoadingGreenhouse] = useState(false);
  const [greenhouseName, setGreenhouseName] = useState("");
  const [numberOfPlants, setNumberOfPlants] = useState("");
  const [greenhouseLocation, setGreenhouseLocation] = useState("");
  const [plantsInGreenhouse, setPlantsInGreenhouse] = useState("");
  const [plants, setPlants] = useState([]);
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState(null);

  const handleLocationInput = (text) => {
    setLocationInput(text);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput}`
      );
      const responseData = await response.json();
      setData(responseData);
      if (responseData && responseData.results) {
        setSuggestions(
          responseData.results.map(
            (result) => `${result.admin1}, ${result.country}`
          )
        );
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLocationSelect = (location) => {
    const selectedResult = data.results.find(
      (result) => `${result.admin1}, ${result.country}` === location
    );
    if (selectedResult) {
      setCoordinates({
        latitude: selectedResult.latitude,
        longitude: selectedResult.longitude,
      });
    }
    setGreenhouseLocation(location);
    setLocationInput(location);
    setSuggestions([]);
  };

  useEffect(() => {
    return () => {
      setSelectedImage(null);
    };
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    let isMounted = true;
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/plants`
      );
      const data = await response.json();
      setPlants(data);
      return () => {
        isMounted = false;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalPlant = () => {
    setVisibility(true);
  };
  const handleModalGreenhouse = () => {
    setVisibilityGreenhouse(true);
  };

  const addPicture = async () => {
    // Request camera roll permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const imageFile = {
        uri: selectedImage,
        type: "image/jpeg",
        name: "image.jpg",
      };
      formData.append("image", imageFile);
      formData.append("plantName", plantName);
      formData.append("description", description);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        alert("Plant added successfully");
        // reset form fields
        setPlantName("");
        setDescription("");
        setSelectedImage(null);
        fetchPlants();
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.error("erreur ajout plante");
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  const addPlant = () => {
    if (selectedImage) {
      uploadImage();
    } else {
      console.log("Please select an image first");
    }
  };

  const addGreenhouse = async () => {
    setIsLoadingGreenhouse(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/add-greenhouse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            greenhouseName: greenhouseName,
            location: coordinates,
            numberOfPlants: numberOfPlants,
            plantType: plantsInGreenhouse,
            city: greenhouseLocation,
          }),
        }
      );
      console.log("response", response);
      if (response.ok) {
        alert("serre ajoutée avec succès");
        setGreenhouseName("");
        setGreenhouseLocation("");
        setNumberOfPlants("");
        setPlantsInGreenhouse("");
        setIsLoadingGreenhouse(false);
        setVisibilityGreenhouse(false);
      } else {
        setIsLoadingGreenhouse(false);
        const responseBody = await response.json();
        console.error("Server responded with status 500", responseBody);
        setIsLoadingGreenhouse(false);
        console.error("une erreur est survenue lors de l'ajout de la serre");
      }
    } catch (err) {
      setIsLoadingGreenhouse(false);
      alert(
        "une erreur est survenue lors de l'ajout de la serre: ",
        err.message
      );
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background.jpg")}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.addPlantButton}>
          <Pressable style={styles.addPlant} onPress={handleModalPlant}>
            <FontAwesome6 name="plus" size={15} color="#000" />
            <Text style={{ fontSize: 18 }}>Ajouter Plante</Text>
          </Pressable>
        </View>
        <View style={styles.addPlantButton}>
          <Pressable style={styles.addPlant} onPress={handleModalGreenhouse}>
            <FontAwesome6 name="plus" size={15} color="#000" />
            <Text style={{ fontSize: 18 }}>Ajouter Serre</Text>
          </Pressable>
        </View>
        <ModalUniversal isVisible={visibility} height={"80%"}>
          <AntDesign
            name="closecircle"
            size={30}
            color="orange"
            onPress={() => {
              setVisibility(false);
              setSelectedImage(null); // Clear the selected image when closing the modal
            }}
            style={{ position: "absolute", top: 10, right: 15 }}
          />
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            Ajouter une plante
          </Text>
          <View style={styles.inputContainer}>
            <FontAwesome6 name="plant-wilt" size={20} color="#000" />
            <TextInput
              style={styles.input}
              onChangeText={setPlantName}
              value={plantName}
              placeholder="Nom de la plante"
            />
          </View>
          <View style={styles.inputContainer}>
            <Entypo name="text" size={20} color="#000" />
            <TextInput
              style={styles.input}
              multiline={true}
              numberOfLines={4}
              onChangeText={setDescription}
              value={description}
              placeholder="description de la plante"
            />
          </View>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <ImageViewer
                placeholderImageSource={require("../assets/icon.png")}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            </View>
          ) : (
            <Pressable style={styles.pictureContainer} onPress={addPicture}>
              <Text style={{ marginVertical: 15 }}>Ajouter une photo</Text>
              <FontAwesome name="picture-o" size={35} color="#000" />
            </Pressable>
          )}

          <View style={styles.addPlantButton}>
            <Pressable style={styles.addPlant} onPress={addPlant}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                <Text style={{ fontSize: 16 }}>Ajouter</Text>
              )}
            </Pressable>
          </View>
        </ModalUniversal>
        <ModalUniversal isVisible={visibitlityGreenhouse} height={"50%"}>
          <AntDesign
            name="closecircle"
            size={30}
            color="orange"
            onPress={() => {
              setVisibilityGreenhouse(false);
            }}
            style={{ position: "absolute", top: 10, right: 15 }}
          />
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            Ajouter une serre
          </Text>
          <View style={styles.inputContainer}>
            <FontAwesome6 name="pencil" size={20} color="#000" />
            <TextInput
              style={styles.input}
              onChangeText={setGreenhouseName}
              value={greenhouseName}
              placeholder="Nom de la serre"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="greenhouse" size={20} color="#000" />
            <TextInput
              style={styles.input}
              onChangeText={handleLocationInput}
              value={locationInput}
              placeholder="Emplacement de la serre"
            />
            <TouchableOpacity onPress={handleSearch}>
              <MaterialCommunityIcons
                name="search-web"
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions?.map((suggestion, index) => (
                <Pressable
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleLocationSelect(suggestion)}
                >
                  <Text>{suggestion}</Text>
                </Pressable>
              ))}
            </View>
          )}
          <View style={styles.pickerContainer}>
            <FontAwesome6 name="plant-wilt" size={20} color="#000" />
            <Picker
              selectedValue={plantsInGreenhouse}
              onValueChange={(itemValue) => setPlantsInGreenhouse(itemValue)}
              style={styles.picker}
            >
              {plants.map((plant, index) => (
                <Picker.Item
                  key={index}
                  label={plant.plantName}
                  value={plant.plantName}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Octicons name="number" size={20} color="#000" />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={setNumberOfPlants}
              value={numberOfPlants}
              placeholder="nombre de plantes dans la serre"
            />
          </View>
          <View style={styles.addPlantButton}>
            <Pressable style={styles.addPlant} onPress={addGreenhouse}>
              {isLoadingGreenhouse ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                <Text style={{ fontSize: 16 }}>Ajouter</Text>
              )}
            </Pressable>
          </View>
        </ModalUniversal>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  addPlant: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  addPlantButton: {
    marginTop: 10,
    width: "45%",
    backgroundColor: "orange",
    padding: 10,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    gap: 10,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#000",
    padding: 10,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    gap: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  pictureContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  selectAnotherButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  selectAnotherButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    padding: 10,
    marginTop: 10,
  },
  picker: {
    flex: 1,
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  suggestionItem: {
    padding: 10,
  },
});
