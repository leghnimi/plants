import React from 'react';
import { Image, Pressable, StyleSheet, View, Text } from 'react-native';

const ImageViewer = ({ placeholderImageSource, selectedImage, setSelectedImage }) => {
    const imageSource = selectedImage ? { uri: selectedImage } : placeholderImageSource;

    const deleteSelectedImage = () => {
        setSelectedImage(null);
    }

    return (
        <View style={styles.container}>
            <Image
                source={imageSource}
                style={styles.image}
                resizeMode="contain"
            />
            <View style={styles.loginContainer}>
                <Pressable style={{ justifyContent: 'center', alignItems: 'center' }} onPress={deleteSelectedImage}>
                    <Text>Supprimer</Text>
                </Pressable>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap:8
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    loginContainer: {
        width: '90%',
        backgroundColor: 'orange',
        borderRadius: 45,
        padding: 10,
    },
});

export default ImageViewer;