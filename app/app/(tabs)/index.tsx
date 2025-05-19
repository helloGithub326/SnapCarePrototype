import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, 
    StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
    const router = useRouter();

    const [file, setFile] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [blob, setBlob] = useState<Blob | null>(null);

    const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permission to upload images."
        );
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setFile(uri);
        setError(null);

        try {
        const b = await convertImageToBlob(uri);
            setBlob(b);
        } catch (e) {
        console.error(e);
            setError("Failed to process image.");
        }
    } else {
        setError("No image selected.");
    }
    };

    const convertImageToBlob = async (uri: string): Promise<Blob> => {
        const response = await fetch(uri);
        return response.blob();
    };

    const uploadImage = async () => {
        if (!blob) {
            setError("No image to upload.");
            return;
        }
        
        const formData = new FormData();
        formData.append("image", blob, "image.jpg");
        var apiUrl = "http://127.0.0.1:8000/skinImage/"
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed with status ${response.status}");
            }

            const result = await response.json();

            router.push({
              pathname: "/(tabs)/result",
              params: {data: JSON.stringify(result)}
            });
        } catch (error) {
            Alert.alert("Error uploading image.");
            return;
        }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.logo}
        />
      }
    >
      <View style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Snap Care</ThemedText>
        </ThemedView>

        <ThemedText style={styles.header}>Add Image:</ThemedText>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>

        {file ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: file }} style={styles.image} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={uploadImage}>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          error && <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 30,
    },
    header: {
        fontSize: 20,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    imageContainer: {
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonContainer: {
        borderRadius: 8,
        marginBottom: 16,
        paddingVertical: 20,
        paddingHorizontal: 30,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
    },
    errorText: {
        color: "red",
        marginTop: 16,
    },
    logo: {
        height: 89,
        width: 145,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});