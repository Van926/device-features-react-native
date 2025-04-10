
// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Entry {
  id: string;
  imageUri: string;
  address: string;
}

const STORAGE_KEY = 'entries';

export const getEntries = async (): Promise<Entry[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// In src/services/storage.ts
export const saveEntry = async (entry: Entry): Promise<void> => {
  try {
    const entries = await getEntries();
    console.log('Current entries before save:', entries); // Debug log
    const updated = [...entries, entry];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    console.log('Entry saved successfully:', entry); // Debug log
  } catch (error) {
    console.error('Error saving entry:', error);
    throw error; // Re-throw to handle in calling function
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
