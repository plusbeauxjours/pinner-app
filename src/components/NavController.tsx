import React from "react";
import { useIsLoggedIn } from "../context/AuthContext";
import AuthNavigation from "../navigation/AuthNavigation";
import { useTheme } from "../context/ThemeContext";
import DarkMainNavigation from "../navigation/DarkMainNavigation";
import LightMainNavigation from "../navigation/LightMainNavigation";

export default () => {
  const isLoggedIn = useIsLoggedIn();
  const isDarkMode = useTheme();
  if (isDarkMode) {
    return isLoggedIn ? <DarkMainNavigation /> : <AuthNavigation />;
  } else {
    return isLoggedIn ? <LightMainNavigation /> : <AuthNavigation />;
  }
};
