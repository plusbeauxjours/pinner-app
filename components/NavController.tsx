import React from "react";
import { View } from "react-native";
import { useIsLoggedIn } from "../src/context/AuthContext";
import AuthNavigation from "../src/navigation/AuthNavigation";
import MainNavigation from "../src/navigation/MainNavigation";

export default () => {
  const isLoggedIn = useIsLoggedIn();
  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? <MainNavigation /> : <AuthNavigation />}
    </View>
  );
};
