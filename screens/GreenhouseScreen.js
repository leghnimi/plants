import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from "react-native";
import GreenhouseCard from "../components/GreenhouseCard";
import { useNavigation } from '@react-navigation/native';


export default function GreenhouseScreen() {
    const [greenhouses, setGreenhouses] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchGreenhouses = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/greenhouses`);
                const data = await response.json();
                setGreenhouses(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchGreenhouses();
    }, []);


    const handleGreenhousePress = (id) => {
        navigation.navigate('GreenhouseDetails', { id });
    };
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{justifyContent:'center', alignItems:'center', gap:20}}>
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
        marginTop: 10,
        marginBottom: 50,
    },

})