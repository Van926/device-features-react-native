import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './styles/theme';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'react-native';

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;