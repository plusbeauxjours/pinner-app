import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useIsLoggedIn, useLogIn, useLogOut } from "../context/AuthContext";
import AuthNavigation from "../navigation/AuthNavigation";

export default () => {
  const isLoggedIn = useIsLoggedIn();
  const logIn = useLogIn();
  const logOUt = useLogOut();
  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? <AuthNavigation /> : <AuthNavigation />}
    </View>
  );
};
