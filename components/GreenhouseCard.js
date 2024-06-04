import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const PlantCard = ({ imageSource, title, location, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.card}>
        <Image source={{ uri: imageSource }} style={styles.cardImage} />
        <View style={styles.CardContentContainer}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription} numberOfLines={1}>{location}</Text>
            </View>
            <View style={styles.plantsContainer}>
            <Text style={{color:'green'}}>12 Plants</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '90%',
        alignItems: 'center',
    },
    cardImage: {
        width: "100%",
        height: 150,
        borderRadius: 10,

    },
    CardContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    cardDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: '#6e6e6e',
    },
    plantsContainer: {
        backgroundColor: '#ccf5cb',
        borderRadius: 45,
        padding: 10,
        marginTop: 25,
    },
});

export default PlantCard;