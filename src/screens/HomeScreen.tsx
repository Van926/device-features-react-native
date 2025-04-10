// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { getEntries, removeEntry } from '../services/storage';

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
  };

  useEffect(() => {
    if (isFocused) loadEntries();
  }, [isFocused]);

  const isDark = theme === 'dark';
  const themedStyles = getStyles(isDark);

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <TouchableOpacity style={themedStyles.button} onPress={() => navigation.navigate('AddEntry' as never)}>
          <Text style={themedStyles.buttonText}>Add Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={themedStyles.button} onPress={toggleTheme}>
          <Text style={themedStyles.buttonText}>{isDark ? 'Light Mode' : 'Dark Mode'}</Text>
        </TouchableOpacity>
      </View>

      {entries.length === 0 ? (
        <Text style={themedStyles.noEntryText}>No Entries yet</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={themedStyles.entry}>
              <Image source={{ uri: item.imageUri }} style={themedStyles.image} />
              <Text style={themedStyles.text}>{item.address}</Text>
              <TouchableOpacity onPress={() => handleRemove(item.id)} style={themedStyles.removeButton}>
                <Text style={themedStyles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: isDark ? '#121212' : '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    button: {
      backgroundColor: isDark ? '#333' : '#ddd',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 5,
    },
    buttonText: { color: isDark ? '#fff' : '#000', fontWeight: 'bold' },
    noEntryText: { textAlign: 'center', fontSize: 18, color: isDark ? '#ccc' : '#444' },
    entry: { marginBottom: 16 },
    image: { width: '100%', height: 200, borderRadius: 10 },
    text: { marginTop: 8, color: isDark ? '#ccc' : '#222' },
    removeButton: {
      marginTop: 5,
      backgroundColor: isDark ? '#ff6b6b' : '#ff5c5c',
      padding: 5,
      borderRadius: 5,
    },
    removeText: { color: '#fff', textAlign: 'center' },
  });
