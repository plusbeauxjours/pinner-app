import React from "react";
import { useIsLoggedIn } from "../context/AuthContext";
import AuthNavigation from "../navigation/AuthNavigation";
import { useTheme } from "../context/ThemeContext";
import MainNavigation from "../navigation/MainNavigation";
import { StatusBar } from "react-native";

export default () => {
  const isLoggedIn = useIsLoggedIn();
  const isDarkMode = useTheme();
  if (isDarkMode) {
    StatusBar.setBarStyle("light-content", true);
  } else {
    StatusBar.setBarStyle("dark-content", true);
  }
  return isLoggedIn ? <MainNavigation /> : <AuthNavigation />;
};
