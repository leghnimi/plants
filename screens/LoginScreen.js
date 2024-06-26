import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  ImageBackground,
  Pressable,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AppContext } from "../App";

export default function LoginScreen() {
  const appContext = useContext(AppContext);
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setModalVisible(true);

      return () => {
        setModalVisible(false);
      };
    }, [])
  );
  const handleLogin = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        appContext.login(data);
        alert("Connecté avec succès");
      } else {
        console.log();
        const errorData = await response.json();
        alert(`Erreur: ${errorData.message}`);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  };

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <ImageBackground
          source={require("../assets/background.jpg")}
          style={styles.image}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.navigate("Home")}
              >
                <Icon name="long-arrow-left" size={25} color="#000" />
              </Pressable>
              <Text style={styles.headerText}>Se Connecter</Text>
              <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#000" />
                <TextInput
                  style={styles.input}
                  onChangeText={setEmail}
                  value={email}
                  placeholder="Addresse mail"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#000" />
                <TextInput
                  style={styles.input}
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Mot de passe"
                  secureTextEntry={!isPasswordVisible}
                />
                <Pressable
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Icon
                    name={isPasswordVisible ? "eye-slash" : "eye"}
                    size={20}
                    color="#000"
                  />
                </Pressable>
              </View>
              <View style={styles.loginContainer}>
                <Pressable
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 25,
                  }}
                  onPress={handleLogin}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Se connecter
                  </Text>
                </Pressable>
              </View>
              <View style={styles.bottomView}>
                <Pressable
                  onPress={() => navigation.navigate("RecoverPassword")}
                >
                  <Text style={styles.subText}>
                    <Text style={styles.linkText}>Mot de passe oublieé?</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    width: "100%",
    height: "50%",
    backgroundColor: "white",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  headerText: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    alignSelf: "flex-start",
  },
  subText: {
    textAlign: "center",
    fontSize: 14,
    color: "black",
  },
  linkText: {
    color: "green",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 25,
  },
  backButtonText: {
    fontSize: 14,
    color: "#000",
  },
  bottomView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#000",
    padding: 10,
    marginTop: 10,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    marginVertical: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  loginContainer: {
    width: "90%",
    backgroundColor: "green",
    borderRadius: 45,
    padding: 10,
    marginTop: 25,
  },
});
