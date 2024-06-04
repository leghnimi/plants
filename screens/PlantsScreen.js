import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, Pressable, ImageBackground, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import ModalUniversal from '../components/ModalUniversal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from '../components/ImageViewer';
import PlantCard from '../components/PlantCard';



export default function PlantsScreen() {
  const [visibility, setVisibility] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [plants, setPlants] = useState([]);

  console.log(process.env.REACT_APP_API_ENDPOINT);  


  useEffect(() => {
    return () => {
      setSelectedImage(null);
    };
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/plants`);
      const data = await response.json();
      setPlants(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleModal = () => {
    setVisibility(true);
  }

  const addPicture = async () => {
    // Request camera roll permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
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
      // Set the selected image URI in the state
      setSelectedImage(result.assets[0].uri);

    }
  };


  const uploadImage = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const imageFile = {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'image.jpg',
      };
      formData.append('image', imageFile);
      formData.append('plantName', plantName);
      formData.append('description', description);

      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Plant added successfully');
        // reset form fields
        setPlantName('');
        setDescription('');
        setSelectedImage(null);
        fetchPlants();
        setIsLoading(false);
      } else {
        console.error('Error uploading plant');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addPlant = () => {
    if (selectedImage) {
      uploadImage();
    } else {
      console.log('Please select an image first');
    }
  };


  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/plantsBackground.png')} style={{ width: '100%', height: '100%' }}>
        <ScrollView contentContainerStyle={{justifyContent:'center', alignItems:'center', gap:20}}>
          {plants.map((plant) => <PlantCard key={plant._id} imageSource={plant.plantPicture} title={plant.plantName} description={plant.description} />)}
        </ScrollView>

        <View style={styles.addPlantButton}>
          <Pressable style={styles.addPlant} onPress={handleModal}>
            <FontAwesome6 name="plus" size={30} color="#000" />
            <Text style={{ fontSize: 20 }}>Ajouter</Text>
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
            style={{ position: 'absolute', top: 10, right: 15 }}
          />
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Ajouter une plante</Text>
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
                placeholderImageSource={require('../assets/icon.png')}
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
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  addPlant: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  addPlantButton: {

    width: '45%',
    backgroundColor: 'orange',
    borderRadius: 45,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    padding: 10,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  pictureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectAnotherButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  selectAnotherButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

});