import React, { useState, createContext } from "react";
import { ThemeProvider as BaseThemeProvider } from "styled-components";

import { lightTheme, darkTheme } from "../Styles/theme";

const ThemeContext = createContext(null);

const ThemeProvider = ({ isDarkMode: isDarkModeProp, children }) => {
  const [isDarkMode, setDarkMode] = useState<boolean>(isDarkModeProp);
  const themeObject = isDarkMode ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={{ isDarkMode, setDarkMode }}>
      <BaseThemeProvider theme={themeObject}>{children}</BaseThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
