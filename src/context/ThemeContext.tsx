import React, { useState, useContext, createContext } from "react";
import { ThemeProvider as BaseThemeProvider } from "styled-components";

import { lightTheme, darkTheme } from "../styles/theme";

const ThemeContext = createContext(null);

const ThemeProvider = ({ isDarkMode: isDarkModeProp, children }) => {
  const [isDarkMode, setDarkMode] = useState<boolean>(isDarkModeProp);
  const themeObject = isDarkMode ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={{ isDarkMode, setDarkMode }}>
      <BaseThemeProvider theme={themeObject} isDarkMode={isDarkMode}>
        {children}
      </BaseThemeProvider>
    </ThemeContext.Provider>
  );
};
export { ThemeContext, ThemeProvider };

export const useTheme = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return isDarkMode;
};
