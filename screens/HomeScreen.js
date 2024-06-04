import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      navigation.navigate('LoginScreen');
      setHasNavigated(true);
    }, 2000);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Plant Monitor</Text>
      <Text style={styles.slogan}>Prenez soin de vos plantes</Text>
      <Text style={styles.sloganBottom}>en toute sérénité</Text>
      <Animated.Image source={require('../assets/green-house.png')} style={styles.image} />
      {hasNavigated && isFocused && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 50,
    color: 'green',
    position: 'absolute',
    top: '16%',
  },
  slogan: {
    fontSize: 18,
    color: 'green',
    position: 'absolute',
    top: '30%',
  },
  sloganBottom: {
    fontSize: 18,
    color: 'green',
    position: 'absolute',
    top: '33%',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  button: {
    flex: 1,
    position: 'absolute',
    bottom: 10,
    alignSelf: 'baseline',
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    width:'35%'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});