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
import { ThemeProvider } from "styled-components";
import { theme } from "./Styles/theme";
import { AuthProvider } from "./AuthContext";
import NavController from "./components/NavController";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const preLoad = async () => {
    try {
      await Font.loadAsync({ ...Ionicons.font });
      await Asset.loadAsync(require("./assets/logo.png"));
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage
      });
      const client = new ApolloClient({
        cache,
        ...apolloClientOptions
      });
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn === null || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setClient(client);
      setLoaded(true);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    preLoad();
  }, []);
  const logUserIn = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
    }
  };
  const logUserOut = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);
    } catch (e) {
      console.log(e);
    }
  };
  return loaded && client && isLoggedIn !== null ? (
    <ApolloHooksProvider client={client}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
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
