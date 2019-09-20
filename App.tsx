import React, { useState, useEffect } from "react";
import { Text, View, AsyncStorage, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";

import { persistCache } from "apollo-cache-persist";
import ApolloClient from "apollo-boost";
import apolloClientOptions from "./apollo";
import { InMemoryCache } from "apollo-cache-inmemory";

import { AppLoading } from "expo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { ApolloProvider } from "react-apollo";
import { ThemeProvider } from "./src/context/ThemeContext";
import { AuthProvider } from "./src/context/AuthContext";
import NavController from "./src/components/NavController";

export default function App() {
  const [client, setClient] = useState<any>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(null);
  const [isDarkMode, setDarkMode] = useState<boolean>(null);
  const preLoad = async () => {
    try {
      await Font.loadAsync({ ...Ionicons.font });
      await Asset.loadAsync(require("./assets/logo.png"));
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage
      });
      const request = async operation => {
        const token = await AsyncStorage.getItem("jwt");
        console.log(token);
        return operation.setContext({
          headers: { Authorization: `JWT ${token}` || "" }
        });
      };
      const client = new ApolloClient({
        cache,
        request,
        ...apolloClientOptions
      });
      const isDarkMode = (await AsyncStorage.getItem("isDarkMode"))
        ? localStorage.getItem("isDarkMode") === "true"
        : true;
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn === null || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setClient(client);
      setLoaded(true);
      setDarkMode(isDarkMode);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    preLoad();
  }, []);
  return loaded && client && isLoggedIn !== null && isDarkMode !== null ? (
    <ApolloHooksProvider client={client}>
      <ApolloProvider client={client}>
        <ThemeProvider isDarkMode={isDarkMode}>
          <AuthProvider isLoggedIn={isLoggedIn}>
            <NavController />
          </AuthProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ApolloHooksProvider>
  ) : (
    <AppLoading />
  );
}
