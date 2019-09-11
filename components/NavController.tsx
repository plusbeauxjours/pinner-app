import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useIsLoggedIn, useLogIn, useLogOut } from "../Context/AuthContext";

export default () => {
  const isLoggedIn = useIsLoggedIn();
  const logIn = useLogIn();
  const logOUt = useLogOut();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {isLoggedIn ? (
        <TouchableOpacity onPress={logOUt}>
          <Text>Log Out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={logIn}>
          <Text>Log in</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
