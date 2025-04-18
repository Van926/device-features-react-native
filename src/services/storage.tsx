
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Entry {
  id: string;
  imageUri: string;
  address: string;
}

const STORAGE_KEY = 'travel_entries'; 

export const getEntries = async (): Promise<Entry[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting entries:', error);
    return [];
  }
};

export const saveEntry = async (entry: Entry): Promise<void> => {
  try {
    const entries = await getEntries();
    const updated = [...entries, entry];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    throw error; 
  }
};

export const removeEntry = async (id: string): Promise<void> => {
  try {
    const entries = await getEntries();
    const updated = entries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to remove entry:', error);
  }
};

export const clearEntries = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear entries:', error);
  }
};
