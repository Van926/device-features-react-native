import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera } from 'react-native-image-picker';
import { useTheme } from '../styles/theme';
import { saveEntry } from '../services/storageService';
import usePermissions from '../hooks/usePermissions';
import useReverseGeocoding from '../hooks/useReverseGeocoding';
import { sendNotification } from '../services/notificationService';
import { getCurrentPosition } from 'react-native-geolocation-service';

const AddEntryScreen = ({ navigation }: { navigation: any }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const { theme } = useTheme();
  const { address, isLoading, error, getAddressFromCoords } = useReverseGeocoding();
  const {
    cameraPermission,
    locationPermission,
    notificationPermission,
    requestCameraPermission,
    requestLocationPermission,
    requestNotificationPermission,
  } = usePermissions();

  useEffect(() => {
    if (location) {
      getAddressFromCoords(location.latitude, location.longitude);
    }
  }, [location]);

  const takePicture = async () => {
    if (cameraPermission !== 'granted') {
      const status = await requestCameraPermission();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is needed to take pictures');
        return;
      }
    }

    if (locationPermission !== 'granted') {
      const status = await requestLocationPermission();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is needed to get your address');
        return;
      }
    }

    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to take picture');
        return;
      }

      if (result.assets && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);

        // Get current location
        getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            Alert.alert('Error', error.message || 'Failed to get location');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const handleSave = async () => {
    if (!imageUri || !location || !address) {
      Alert.alert('Error', 'Please take a picture first');
      return;
    }

    const newEntry = {
      imageUri,
      address,
      latitude: location.latitude,
      longitude: location.longitude,
      createdAt: new Date().toISOString(),
    };

    const saved = await saveEntry(newEntry);
    if (saved) {
      if (notificationPermission !== 'granted') {
        await requestNotificationPermission();
      }
      await sendNotification('New Travel Entry', 'Your travel entry has been saved successfully!');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save entry');
    }
  };

  const handleCancel = () => {
    setImageUri(null);
    setLocation(null);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.previewContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={[styles.emptyPreview, { backgroundColor: theme.card }]}>
            <Icon name="photo-camera" size={60} color={theme.text} style={{ opacity: 0.5 }} />
            <Text style={[styles.emptyPreviewText, { color: theme.text }]}>No picture taken</Text>
          </View>
        )}
      </View>

      <View style={[styles.infoContainer, { backgroundColor: theme.card }]}>
        {isLoading ? (
          <Text style={[styles.infoText, { color: theme.text }]}>Loading address...</Text>
        ) : error ? (
          <Text style={[styles.infoText, { color: theme.error }]}>{error}</Text>
        ) : address ? (
          <Text style={[styles.infoText, { color: theme.text }]}>{address}</Text>
        ) : (
          <Text style={[styles.infoText, { color: theme.text }]}>
            Take a picture to get your location
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.secondary }]}
          onPress={takePicture}
        >
          <Icon name="camera-alt" size={24} color="#fff" />
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={!imageUri || isLoading}
        >
          <Icon name="save" size={24} color="#fff" />
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.error }]}
          onPress={handleCancel}
        >
          <Icon name="cancel" size={24} color="#fff" />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  previewContainer: {
    flex: 1,
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  emptyPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  emptyPreviewText: {
    marginTop: 10,
    fontSize: 16,
    opacity: 0.7,
  },
  infoContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default AddEntryScreen;