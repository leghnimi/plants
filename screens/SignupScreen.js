import React, { useState } from "react";
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
import { Picker } from "@react-native-picker/picker";

export default function SignupScreen() {
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const handleValidation = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password || !confirmPassword || !selectedRole) {
      alert("Veuillez remplir tous les champs");
    } else if (!emailRegex.test(email)) {
      alert("Veuillez entrer une adresse e-mail valide");
    } else if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
    } else {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}/api/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
              role: selectedRole,
            }),
          }
        );

        if (response.ok) {
          alert("Utilisateur créé avec succès");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setSelectedRole("");
        } else {
          const errorData = await response.json();
          alert(`Erreur: ${JSON.stringify(errorData.message)}`);
        }
      } catch (err) {
        console.log(err);
        alert("Une erreur est survenue");
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background.jpg")}
        style={styles.image}
      >
        <View style={styles.centeredView}>
          <Text style={styles.headerText}>S'enregistrer</Text>
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
            <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Icon
                name={isPasswordVisible ? "eye-slash" : "eye"}
                size={20}
                color="#000"
              />
            </Pressable>
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#000" />
            <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              placeholder="Confirmer mot de passe"
              secureTextEntry={!isConfirmPasswordVisible}
            />
            <Pressable
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              <Icon
                name={isConfirmPasswordVisible ? "eye-slash" : "eye"}
                size={20}
                color="#000"
              />
            </Pressable>
          </View>
          <View style={styles.inputRole}>
            <Icon name="user" size={20} color="#000" />
            <Picker
              selectedValue={selectedRole}
              style={{ height: 50, width: "100%" }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedRole(itemValue)
              }
            >
              <Picker.Item label="Choisissez un rôle" value="" />
              <Picker.Item label="Ouvrier" value="worker" />
              <Picker.Item label="Ingenieur" value="engineer" />
            </Picker>
          </View>
          <View style={styles.loginContainer}>
            <Pressable
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 25,
              }}
              onPress={handleValidation}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Créer compte
              </Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
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
  centeredView: {
    padding: 10,
    width: "95%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  modalView: {
    width: "100%",
    height: "70%",
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
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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
  inputRole: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#000",
    padding: 10,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
});
