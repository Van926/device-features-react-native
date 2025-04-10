// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

interface Entry {
  id: string;
  imageUri: string;
  address: string;
}

export default function HomeScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();

  const loadEntries = async () => {
    const data = await AsyncStorage.getItem('entries');
    if (data) {
      setEntries(JSON.parse(data));
    } else {
      setEntries([]);
    }
  };

  const removeEntry = async (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await AsyncStorage.setItem('entries', JSON.stringify(updated));
  };

  useEffect(() => {
    if (isFocused) loadEntries();
  }, [isFocused]);

  return (
    <View style={[styles.container, theme === 'dark' && styles.dark]}>
      <View style={styles.header}>
        <Button title="Add Entry" onPress={() => navigation.navigate('AddEntry' as never)} />
        <Button title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} onPress={toggleTheme} />
      </View>

      {entries.length === 0 ? (
        <Text style={styles.noEntryText}>No Entries yet</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.entry}>
              <Image source={{ uri: item.imageUri }} style={styles.image} />
              <Text style={styles.address}>{item.address}</Text>
              <TouchableOpacity onPress={() => removeEntry(item.id)} style={styles.removeBtn}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  dark: { backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  noEntryText: { textAlign: 'center', fontSize: 18, marginTop: 50 },
  entry: { marginBottom: 16 },
  image: { width: '100%', height: 200, borderRadius: 10 },
  address: { marginTop: 8 },
  removeBtn: { marginTop: 5, backgroundColor: '#ff5c5c', padding: 5, borderRadius: 5 },
  removeText: { color: '#fff', textAlign: 'center' }
});
