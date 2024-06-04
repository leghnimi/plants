import React, {useEffect, useState} from 'react';
import { View, ScrollView, StyleSheet } from "react-native";
import GreenhouseCard from "../components/GreenhouseCard";


export default function GreenhouseScreen() {
    const [plants, setPlants] = useState([]);



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
 


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{justifyContent:'center', alignItems:'center', gap:20}}>
                {plants.map((plant, index) => (
                    <GreenhouseCard
                        key={index}
                        imageSource={plant.plantPicture}
                        title={plant.plantName}
                        location={plant.description}
                        numberOfPlants={12}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginBottom: 50,
    },

})