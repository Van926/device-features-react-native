// src/screens/AddEntryScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, Button, Image, Alert, StyleSheet, TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { reverseGeocodeAsync } from '../utils/geocode';
import { saveEntry } from '../services/storage';
import { useTheme } from '../context/ThemeContext';
import { v4 as uuidv4 } from 'uuid';

export default function AddEntryScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const themedStyles = getStyles(isDark);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    await Location.requestForegroundPermissionsAsync();
    await Notifications.requestPermissionsAsync();
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      const loc = await Location.getCurrentPositionAsync({});
      const addr = await reverseGeocodeAsync(loc.coords.latitude, loc.coords.longitude);
      setAddress(addr);
    }
  };

  const handleSave = async () => {
    if (!imageUri || !address) {
      Alert.alert('Error', 'You need to take a photo first.');
      return;
    }

    const entry = { id: uuidv4(), imageUri, address };
    await saveEntry(entry);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'New Travel Entry Saved!',
        body: address,
      },
      trigger: null,
    });

    navigation.goBack();
  };

  return (
    <View style={themedStyles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={themedStyles.image} />
      ) : (
        <Text style={themedStyles.text}>No image selected</Text>
      )}
      <Text style={themedStyles.text}>{address || 'Address will appear here'}</Text>

      <TouchableOpacity onPress={takePhoto} style={themedStyles.button}>
        <Text style={themedStyles.buttonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSave} style={[themedStyles.button, !imageUri && themedStyles.disabled]}>
        <Text style={themedStyles.buttonText}>Save Entry</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      alignItems: 'center',
      backgroundColor: isDark ? '#121212' : '#fff',
    },
    text: {
      marginVertical: 10,
      color: isDark ? '#ccc' : '#333',
    },
    image: {
      width: '100%',
      height: 300,
      borderRadius: 10,
      marginBottom: 20,
    },
    button: {
      backgroundColor: isDark ? '#444' : '#ccc',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 10,
    },
    buttonText: {
      color: isDark ? '#fff' : '#000',
      fontWeight: 'bold',
    },
    disabled: {
      opacity: 0.6,
    },
  });
