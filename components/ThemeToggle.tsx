import React from 'react';
import { Switch, View, StyleSheet } from 'react-native';
import { useTheme } from '../styles/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ThemeToggle = () => {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <View style={styles.container}>
      <Icon
        name={isDark ? 'nights-stay' : 'wb-sunny'}
        size={24}
        color={theme.text}
        style={styles.icon}
      />
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        thumbColor={theme.primary}
        trackColor={{ false: theme.border, true: theme.border }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
});

export default ThemeToggle;