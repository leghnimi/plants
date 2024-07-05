import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalComponent from "../components/ModalUniversal";
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AppContext } from "../AppContext";


export default function SignupScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isDeleteUserModalVisible, setIsDeleteUserModalVisible] = useState(false);
  const [isExportDataModalVisible, setIsExportDataModalVisible] = useState(false);
  const [isDeleteGreenhouseModalVisible, setIsDeleteGreenhouseModalVisible] = useState(false);
  const { logout, greenhouses, setGreenhouses } = useContext(AppContext);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
  const [selectedGreenhouseDetails, setSelectedGreenhouseDetails] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);




  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }


  useEffect(() => {
    const getUser = async () => {
      try {
        const value = await AsyncStorage.getItem("user");
        if (value !== null) {
          setUser(JSON.parse(value));
        }
      } catch (e) {
        console.error(e);
      }
    };
    getUser();
  }, [refreshTrigger]);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/get-users`
        );
        const data = await response.json();
        setAllUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };

  }, [refreshTrigger]);


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
          `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
              role: selectedRole,
              userName,
            }),
          }
        );

        if (response.ok) {
          alert("Utilisateur créé avec succès");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setSelectedRole("");
          setUserName("");
          setRefreshTrigger(prev => prev + 1); 
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
  const handleAddUserModal = () => {
    setIsAddUserModalVisible(!isAddUserModalVisible);
  }
  const closeModal = () => {
    setIsAddUserModalVisible(false);
  };

  const handleDeleteUserModal = () => {
    setIsDeleteUserModalVisible(!isDeleteUserModalVisible);
  }
  const closeDeleteUserModal = () => {
    setIsDeleteUserModalVisible(false);
  }
  const handleExportDataModal = () => {
    setIsExportDataModalVisible(!isExportDataModalVisible);
  }
  const closeExportDataModal = () => {
    setIsExportDataModalVisible(false);
  }
  const handleDeleteGreenhouseModal = () => {
    setIsDeleteGreenhouseModalVisible(!isDeleteGreenhouseModalVisible);
  }

  const deleteUser = (userName) => async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/delete-user?identifier=${userName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName,
          }),
        }
      );

      if (response.ok) {
        alert("Utilisateur supprimé avec succès");
        setRefreshTrigger(prev => prev + 1); 
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${JSON.stringify(errorData.message)}`);
      }
    } catch (err) {
      console.log(err);
      alert("Une erreur est survenue");
    }
  }
const deleteGreenhouseById = (id) => async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/greenhouse/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        }
      );

      if (response.ok) {
        alert("Serre supprimée avec succès");
        setRefreshTrigger(prev => prev + 1); 
        const updatedGreenhouses = greenhouses.filter(greenhouse => greenhouse._id !== id);
      setGreenhouses(updatedGreenhouses);
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${JSON.stringify(errorData.message)}`);
      }
    } catch (err) {
      console.log(err);
      alert("Une erreur est survenue");
    }
}

  const fetchGreenhouseDetails = async (greenhouseName) => {
    try {
      const encodedName = encodeURIComponent(greenhouseName.trim());
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/greenhouse/name/${encodedName}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedGreenhouseDetails(data);
      } else {
        console.error('Failed to fetch greenhouse details');
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching greenhouse details:', error);
    }
  };

  const handleGreenhouseChange = (itemValue) => {
    setSelectedGreenhouse(itemValue);
    if (itemValue) {
      fetchGreenhouseDetails(itemValue);
    } else {
      setSelectedGreenhouseDetails(null);
    }
  };





  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background.jpg")}
        style={styles.image}
      >
        <View style={styles.loginContainer}>
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 25,
            }}
            onPress={handleAddUserModal}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Ajouter utilisateur
            </Text>
          </Pressable>
        </View>

        <View style={styles.loginContainer}>
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 25,
            }}
            onPress={handleDeleteUserModal}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Supprimer utilisateurs
            </Text>
          </Pressable>
        </View>

        <View style={styles.loginContainer}>
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 25,
            }}
            onPress={handleDeleteGreenhouseModal}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Supprimer Serre
            </Text>
          </Pressable>
        </View>

        <View style={styles.loginContainer}>
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 25,
            }}
            onPress={handleExportDataModal}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Export de données
            </Text>
          </Pressable>
        </View>

        <ModalComponent
          isVisible={isAddUserModalVisible}
          height={"80%"}
        >
          <Pressable
            style={styles.closeButton}
            onPress={closeModal}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </Pressable>
          <View style={styles.centeredView}>
            <Text style={styles.headerText}>Ajouter utilisateur</Text>
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
              <Icon name="user" size={20} color="#000" />
              <TextInput
                style={styles.input}
                onChangeText={setUserName}
                value={userName}
                placeholder="Nom d'utilisateur"
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
        </ModalComponent>

        <ModalComponent
          isVisible={isDeleteUserModalVisible}
          height={"80%"}
        >
          <Pressable
            style={styles.closeButton}
            onPress={closeDeleteUserModal}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </Pressable>
          <View style={{ flex: 1, marginTop: 30 }}>
            {allUsers.map((user, index) => (
              <View key={index} style={{ marginBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 20, }}>
                <View>
                  <Text>Username: {user.userName}</Text>
                  <Text>Email: {user.email}</Text>
                </View>
                <View style={{ backgroundColor: "red", padding: 10, borderRadius: 24 }}>
                  <TouchableOpacity
                    onPress={deleteUser(user.userName)}
                  >

                    <Text style={{ color: "white" }}>
                      Supprimer
                    </Text>

                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>


        </ModalComponent>

        <ModalComponent
          isVisible={isExportDataModalVisible}
          height={"80%"}
        >
          <Pressable
            style={styles.closeButton}
            onPress={closeExportDataModal}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </Pressable>

          <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20, alignSelf: 'flex-start' }}>Export de données</Text>
          <ScrollView style={{ width: "100%" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sensorsText}>
                Veuillez choisir la serre ci-dessous
              </Text>
              <View style={styles.pickerContainer}>
                <MaterialCommunityIcons name="greenhouse" size={20} color="#000" />
                <Picker
                  selectedValue={selectedGreenhouse}
                  onValueChange={handleGreenhouseChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Sélectionnez une serre" value="" />
                  {greenhouses.map((greenhouse, index) => (
                    <Picker.Item
                      key={index}
                      label={greenhouse.greenhouseName}
                      value={greenhouse.greenhouseName.trim()}
                    />
                  ))}
                </Picker>
              </View>

              {selectedGreenhouseDetails && (
                <View style={styles.greenhouseDetails}>
                  <Text style={styles.detailsHeader}>Détails de la serre :</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.title}>Nom : </Text>
                    <Text>{selectedGreenhouseDetails.greenhouseName}</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.title}>Type de plante : </Text>
                    <Text>{selectedGreenhouseDetails.plantType}</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.title}>Ville : </Text>
                    <Text>{selectedGreenhouseDetails.city}</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.title}>Nombre de plantes : </Text>
                    <Text>{selectedGreenhouseDetails.numberOfPlants}</Text>
                  </View>

                  {selectedGreenhouseDetails.engineerActions.length > 0 && (
                    <View>
                      <Text style={styles.title}>Actions d'ingénieur:</Text>
                      {selectedGreenhouseDetails.engineerActions.map((action, index) => (
                        <View key={index} style={{ gap: 5, marginTop:8 }}>
                          <Text style={styles.title}>Date: </Text>
                          <Text>{formatDate(action.date)} </Text>
                          <Text style={styles.title}>Action: </Text>
                          <Text>{action.action} </Text>
                          <Text style={styles.title}>Details: </Text>
                          <Text>{action.details}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {selectedGreenhouseDetails.sensors.length > 0 && (
                    <View>
                      <Text style={styles.title}>Données des capteurs:</Text>
                      {selectedGreenhouseDetails.sensors.map((sensor, sensorIndex) => (
                        <View key={sensorIndex}>
                          <View style={{ flexDirection: "row", marginTop:8 }}>
                            <Text style={styles.title}>Date: </Text>
                            <Text>{formatDate(sensor.date)}</Text>
                          </View>
                          {sensor.data.map((data, dataIndex) => (
                            <View key={dataIndex} style={{marginBottom:25}}>
                              <Text style={styles.title}>Temps: </Text>
                              <Text>{formatDate(data.time)}</Text>
                              <Text style={styles.title}>Température: </Text>
                              <Text>{data.temperature} °C </Text>
                              <Text style={styles.title}>Humidité: </Text>
                              <Text>{data.humidity} % </Text>
                              <Text style={styles.title}>Eclairage: </Text>
                              <Text>{data.light} </Text>
                              <Text style={styles.title}>Humidité du sol: </Text>
                              <Text>{data.soilMoisture}</Text>
                              <Text style={styles.title}>Température du sol: </Text>
                              <Text>{data.soilTemp} °C </Text>
                              <Text style={styles.title}>Note: </Text>
                              <Text>{data.note}</Text>
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
            <View style={styles.loginContainer}>
                <Pressable
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 25,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Exporter
                  </Text>
                </Pressable>
              </View>
          </ScrollView>

        </ModalComponent>


        <ModalComponent
          isVisible={isDeleteGreenhouseModalVisible}
          height={"80%"}
        >
          <Pressable
            style={styles.closeButton}
            onPress={handleDeleteGreenhouseModal}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </Pressable>

          <View style={{ flex: 1, marginTop: 30 }}>
            {greenhouses.map((greenhouse, index) => (
              <View key={index} style={{ marginBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
                <Text>Nom Serre : {greenhouse.greenhouseName}</Text>
                <View style={{ backgroundColor: "red", padding: 10, borderRadius: 24 }}>
                  <TouchableOpacity
                    onPress={deleteGreenhouseById(greenhouse._id)}
                  >

                    <Text style={{ color: "white" }}>
                      Supprimer
                    </Text>

                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

        </ModalComponent>


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
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sensorsText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderBottomWidth: 1,
    width: "100%",
  },
  picker: {
    flex: 1,
  },
  greenhouseDetails: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    gap: 20
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    color:"green"
  },
  loginContainer: {
    width: "90%",
    backgroundColor: "green",
    borderRadius: 45,
    padding: 10,
    marginTop: 25,
  },
});
