import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import { useTheme } from '../styles/theme';

export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Travel Diary' }} />
      <Stack.Screen name="AddEntry" component={AddEntryScreen} options={{ title: 'Add Entry' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;