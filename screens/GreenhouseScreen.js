import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ImageBackground,
} from "react-native";
import GreenhouseCard from "../components/GreenhouseCard";
import { useNavigation } from "@react-navigation/native";

export default function GreenhouseScreen() {
  const [greenhouses, setGreenhouses] = useState([]);
  const navigation = useNavigation();

  console.log('greenhouses:', process.env.EXPO_PUBLIC_API_ENDPOINT);

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
        console.error('Fetch error:', err);
        console.error('Error details:', err.message);
      }
    };

    fetchGreenhouses();

      
    return () => {
      isMounted = false;
    };
  }, []);

  const handleGreenhousePress = (id) => {
    navigation.navigate("HomeStack", {
      screen: "GreenhouseDetails",
      params: { id },
    });
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background.jpg")}
        style={styles.image}
      />
      <Text style={styles.title}>Serres</Text>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        {greenhouses.map((greenhouse) => (
          <GreenhouseCard
            key={greenhouse._id}
            title={greenhouse.greenhouseName}
            location={greenhouse.city}
            numberOfPlants={greenhouse.numberOfPlants}
            onPress={() => handleGreenhousePress(greenhouse._id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  image: {
    width: "100%", // Cover the full width of the screen
    height: "100%", // Cover the full height of the screen
    position: "absolute", // Position it absolutely
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
});
