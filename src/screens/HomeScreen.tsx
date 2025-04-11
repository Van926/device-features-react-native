import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image,Alert, TouchableOpacity, StyleSheet, Platform
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { getEntries, removeEntry } from '../services/storage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [entries, setEntries] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();

  const loadEntries = async () => {
    const data = await getEntries();
    setEntries(data);
  };

  const handleRemove = async (id: string) => {
    await removeEntry(id);
    loadEntries();
    
    Alert.alert('Entry removed successfuly')
  };

  useEffect(() => {
    if (isFocused) loadEntries();
  }, [isFocused]);

  const isDark = theme === 'dark';
  const themedStyles = getStyles(isDark);

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.title}>My Travel Journal</Text>
        <View style={themedStyles.headerActions}>
          <TouchableOpacity 
            style={themedStyles.iconButton} 
            onPress={() => navigation.navigate('AddEntry' as never)}
          >
            <Ionicons 
              name="add" 
              size={24} 
              color={isDark ? '#fff' : '#6200ee'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={themedStyles.iconButton} 
            onPress={toggleTheme}
          >
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={20} 
              color={isDark ? '#fff' : '#6200ee'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {entries.length === 0 ? (
        <View style={themedStyles.emptyState}>
          <Ionicons 
            name="images" 
            size={48} 
            color={isDark ? '#555' : '#ccc'} 
            style={themedStyles.emptyIcon}
          />
          <Text style={themedStyles.noEntryText}>No entries yet</Text>
          <Text style={themedStyles.noEntrySubtext}>Tap the + button to add your first entry</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          contentContainerStyle={themedStyles.listContent}
          renderItem={({ item }) => (
            <View style={themedStyles.entryCard}>
              <Image 
                source={{ uri: item.imageUri }} 
                style={themedStyles.image} 
                resizeMode="cover"
              />
              <View style={themedStyles.entryContent}>
                <Text style={themedStyles.text}>{item.address}</Text>
                <TouchableOpacity 
                  onPress={() => handleRemove(item.id)} 
                  style={themedStyles.removeButton}
                >
                  <Ionicons 
                    name="trash" 
                    size={18} 
                    color="#fff" 
                  />
                  <Text style={themedStyles.removeText}> Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: isDark ? '#121212' : '#f5f5f5' 
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
      elevation: 2,
      shadowColor: isDark ? '#000' : '#aaa',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#fff' : '#333',
    },
    headerActions: {
      flexDirection: 'row',
      gap: 16,
    },
    iconButton: {
      padding: 8,
    },
    listContent: {
      padding: 16,
      paddingBottom: 32,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyIcon: {
      marginBottom: 16,
      opacity: 0.5,
    },
    noEntryText: { 
      fontSize: 18, 
      fontWeight: '500',
      color: isDark ? '#aaa' : '#666', 
      marginBottom: 8,
    },
    noEntrySubtext: {
      fontSize: 14,
      color: isDark ? '#666' : '#999',
      textAlign: 'center',
    },
    entryCard: {
      backgroundColor: isDark ? '#1e1e1e' : '#fff',
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: isDark ? '#000' : '#aaa',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    image: { 
      width: '100%', 
      height: 200,
    },
    entryContent: {
      padding: 16,
    },
    text: { 
      fontSize: 16,
      color: isDark ? '#eee' : '#333',
      marginBottom: 12,
    },
    removeButton: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#d32f2f' : '#f44336',
      padding: 10,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeText: { 
      color: '#fff', 
      fontWeight: '500',
    },
  });