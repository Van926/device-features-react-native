import React, { createContext, useContext, useState } from 'react';
import { DarkTheme, DefaultTheme } from './colors';

type ThemeContextType = {
  isDark: boolean;
  theme: typeof DefaultTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  theme: DefaultTheme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);