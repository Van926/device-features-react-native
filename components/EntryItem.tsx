import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../styles/theme';
import { TravelEntry } from '../types';

interface EntryItemProps {
  entry: TravelEntry;
  onDelete: (id: string) => void;
}

const EntryItem: React.FC<EntryItemProps> = ({ entry, onDelete }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image source={{ uri: entry.imageUri }} style={styles.image} />
      <View style={styles.details}>
        <Text style={[styles.address, { color: theme.text }]}>{entry.address}</Text>
        <Text style={[styles.date, { color: theme.text }]}>
          {new Date(entry.createdAt).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(entry.id)} style={styles.deleteButton}>
        <Icon name="delete" size={24} color={theme.error} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  address: {
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
});

export default EntryItem;