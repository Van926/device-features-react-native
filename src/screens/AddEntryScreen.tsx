import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, Alert, StyleSheet, TouchableOpacity, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { reverseGeocodeAsync } from '../utils/geocode';
import { saveEntry } from '../services/storage';
import { useTheme } from '../context/ThemeContext';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';
import { sendLocalNotification } from '../services/notifications';
import 'react-native-get-random-values';

export default function AddEntryScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const themedStyles = getStyles(isDark);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        allowsEditing: true,
        aspect: [4, 3],
      });
      
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        
        const loc = await Location.getCurrentPositionAsync({});
        const addr = await reverseGeocodeAsync(loc.coords.latitude, loc.coords.longitude);
        setAddress(addr);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo or get location');
    }
  };

  const handleSave = async () => {
    if (!imageUri || !address) {
      Alert.alert('Error', 'Please take a photo first');
      return;
    }

    setIsLoading(true);
    
    try {
      const entry = {
        id: uuidv4(),
        imageUri,
        address
      };

      await saveEntry(entry);
      
    
      await sendLocalNotification(
        'New Travel Entry Saved!',
        `Location: ${address}`
      );

      Alert.alert(
        'Success',
        'Your travel entry has been saved!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        'Save Failed',
        error instanceof Error ? error.message : 'Failed to save entry'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? '#fff' : '#000'} 
          />
        </TouchableOpacity>
        <Text style={themedStyles.title}>New Travel Entry</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={themedStyles.content}>
        {imageUri ? (
          <View style={themedStyles.imageContainer}>
            <Image 
              source={{ uri: imageUri }} 
              style={themedStyles.image} 
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={themedStyles.placeholder}>
            <Ionicons 
              name="camera" 
              size={48} 
              color={isDark ? '#555' : '#ccc'} 
            />
            <Text style={themedStyles.placeholderText}>No photo taken yet</Text>
          </View>
        )}

        <View style={themedStyles.addressContainer}>
          <Ionicons 
            name="location" 
            size={20} 
            color={isDark ? '#aaa' : '#666'} 
          />
          <Text style={themedStyles.addressText}>
            {address || 'Address will appear here after taking photo'}
          </Text>
        </View>

        <TouchableOpacity 
          onPress={takePhoto} 
          style={themedStyles.primaryButton}
          disabled={isLoading}
        >
          <Ionicons 
            name="camera" 
            size={20} 
            color="#fff" 
            style={themedStyles.buttonIcon}
          />
          <Text style={themedStyles.primaryButtonText}>
            {imageUri ? 'Retake Photo' : 'Take Photo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleSave} 
          style={[
            themedStyles.secondaryButton, 
            (!imageUri || isLoading) && themedStyles.disabledButton
          ]}
          disabled={!imageUri || isLoading}
        >
          {isLoading ? (
            <Text style={themedStyles.secondaryButtonText}>Saving...</Text>
          ) : (
            <>
              <Ionicons 
                name="save" 
                size={20} 
                color={isDark ? '#fff' : '#6200ee'} 
                style={themedStyles.buttonIcon}
              />
              <Text style={themedStyles.secondaryButtonText}>Save Entry</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#f5f5f5',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingTop: Platform.OS === 'ios' ? 50 : 16,
      backgroundColor: isDark ? '#1e1e1e' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#e0e0e0',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    content: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
    },
    imageContainer: {
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 20,
      elevation: 2,
      shadowColor: isDark ? '#000' : '#aaa',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    image: {
      width: '100%',
      height: 300,
    },
    placeholder: {
      width: '100%',
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#1e1e1e' : '#f0f0f0',
      borderRadius: 12,
      marginBottom: 20,
    },
    placeholderText: {
      marginTop: 10,
      color: isDark ? '#777' : '#999',
      fontSize: 16,
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      padding: 16,
      backgroundColor: isDark ? '#1e1e1e' : '#fff',
      borderRadius: 8,
      marginBottom: 20,
    },
    addressText: {
      marginLeft: 10,
      color: isDark ? '#ddd' : '#333',
      fontSize: 14,
      flexShrink: 1,
    },
    primaryButton: {
      flexDirection: 'row',
      backgroundColor: '#6200ee',
      padding: 16,
      borderRadius: 8,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    primaryButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    secondaryButton: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#333' : '#e0e0e0',
      padding: 16,
      borderRadius: 8,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: isDark ? '#fff' : '#6200ee',
      fontWeight: '600',
      fontSize: 16,
    },
    disabledButton: {
      opacity: 0.6,
    },
    buttonIcon: {
      marginRight: 8,
    },
  });