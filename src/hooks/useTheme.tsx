import { useContext, useCallback } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AsyncStorage } from "react-native";

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  } else {
    const { isDarkMode, setDarkMode } = context;
    const toggleTheme = useCallback(async () => {
      if (isDarkMode === false) {
        setDarkMode(true);
        await AsyncStorage.setItem("isDarkMode", "true");
      } else if (isDarkMode === true) {
        setDarkMode(false);
        await AsyncStorage.setItem("isDarkMode", "false");
      }
    }, [isDarkMode]);
    return {
      theme: isDarkMode,
      toggleTheme
    };
  }
};

export { useTheme };
