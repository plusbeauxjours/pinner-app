import React, { useContext, useCallback } from "react";
import { ThemeContext } from "../context/ThemeContext";

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  } else {
    const { isDarkMode, setDarkMode } = context;
    const toggleTheme = useCallback(() => {
      if (isDarkMode === false) {
        setDarkMode(true);
        localStorage.setItem("isDarkMode", "true");
      } else if (isDarkMode === true) {
        setDarkMode(false);
        localStorage.setItem("isDarkMode", "false");
      }
    }, [isDarkMode]);
    return {
      theme: isDarkMode,
      toggleTheme
    };
  }
};

export default { useTheme };
