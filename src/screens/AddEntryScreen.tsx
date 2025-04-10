// src/screens/AddEntryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { reverseGeocodeAsync } from '../utils/geocode';
import { useTheme } from '../context/ThemeContext';
import { v4 as uuidv4 } from 'uuid';

interface Entry {
  id: string;
  imageUri: string;
  address: string;
}

export default function AddEntryScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const navigation = useNavigation();
  const { theme } = useTheme();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    await Location.requestForegroundPermissionsAsync();
    await Notifications.requestPermissionsAsync();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      const loc = await Location.getCurrentPositionAsync({});
      const addr = await reverseGeocodeAsync(loc.coords.latitude, loc.coords.longitude);
      setAddress(addr);
    }
  };

  const saveEntry = async () => {
    if (!imageUri || !address) {
      Alert.alert('Error', 'You need to take a photo first.');
      return;
    }

    const entry: Entry = { id: uuidv4(), imageUri, address };
    const existing = await AsyncStorage.getItem('entries');
    const updated = existing ? [...JSON.parse(existing), entry] : [entry];
    await AsyncStorage.setItem('entries', JSON.stringify(updated));

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
    <View style={[styles.container, theme === 'dark' && styles.dark]}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text style={styles.text}>No image selected</Text>
      )}
      <Text style={styles.text}>{address || 'Address will appear here'}</Text>
      <Button title="Take Photo" onPress={pickImage} />
      <Button title="Save Entry" onPress={saveEntry} disabled={!imageUri || !address} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center' },
  dark: { backgroundColor: '#121212' },
  text: { marginVertical: 10, color: '#888' },
  image: { width: '100%', height: 300, borderRadius: 10, marginBottom: 20 },
});
