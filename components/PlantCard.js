import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

const PlantCard = ({ imageSource, title, description, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    <Image source={{ uri: imageSource }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription} numberOfLines={4}>
        {description}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default PlantCard;
