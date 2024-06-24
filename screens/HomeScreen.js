import React, { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/background.jpg")}
        style={styles.image}
      />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Plant Monitor</Text>
          <View style={styles.sloganContainer}>
            <Text style={styles.slogan}>Prenez soin de vos plantes</Text>
            <Text style={styles.sloganBottom}>en toute sérénité</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text style={styles.link}> Créer un compte </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  sloganContainer: {
    alignItems: "center",
  },
  slogan: {
    fontSize: 20,
    color: "white",
  },
  sloganBottom: {
    fontSize: 20,
    color: "white",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 100,
  },
  button: {
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 30,
    color: "white",
    fontWeight: "bold",
  },
});
