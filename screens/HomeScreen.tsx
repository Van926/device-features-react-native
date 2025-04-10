import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../styles/theme';
import { getEntries, deleteEntry } from '../services/storageService';
import { TravelEntry } from '../types';
import EntryItem from '../components/EntryItem';
import ThemeToggle from '../components/ThemeToggle';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadEntries();
    });
    return unsubscribe;
  }, [navigation]);

  const loadEntries = async () => {
    const loadedEntries = await getEntries();
    setEntries(loadedEntries);
  };

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
    loadEntries();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Travel Diary</Text>
        <ThemeToggle />
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="photo-album" size={60} color={theme.text} style={styles.emptyIcon} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No entries yet</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EntryItem entry={item} onDelete={handleDelete} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AddEntry')}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    opacity: 0.7,
  },
  listContent: {
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default HomeScreen;