import React, { createContext, useContext, useState } from "react";
import { AsyncStorage } from "react-native";

export const AuthContext = createContext(null);

export const AuthProvider = ({
  isLoggedIn: isLoggedInProp,
  children,
  client
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isLoggedInProp);
  const logUserIn = async (token: any) => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("jwt", token.token);
      await setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
    }
  };

  const logUserOut = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);
      await AsyncStorage.clear();
      client.cache.reset();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logUserIn, logUserOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useIsLoggedIn = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn;
};
export const useLogIn = () => {
  const { logUserIn, isLoggedIn } = useContext(AuthContext);
  return logUserIn;
};
export const useLogOut = () => {
  const { logUserOut } = useContext(AuthContext);
  return logUserOut;
};
