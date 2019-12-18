import React, { useState, useEffect } from "react";
import { AsyncStorage, StatusBar } from "react-native";
import {
  Ionicons,
  AntDesign,
  FontAwesome,
  SimpleLineIcons
} from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { persistCache } from "apollo-cache-persist";
import { ApolloClient } from "apollo-boost";
import apolloClientOptions from "./apollo";
import { InMemoryCache } from "apollo-cache-inmemory";

import { AppLoading } from "expo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { ApolloProvider } from "react-apollo";
import { ThemeProvider } from "./src/context/ThemeContext";
import { AuthProvider } from "./src/context/AuthContext";
import { LocationProvider } from "./src/context/LocationContext";
import NavController from "./src/components/NavController";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { YellowBox } from "react-native";

YellowBox.ignoreWarnings([
  "AppRegistry.setWrapperComponentProvider has no effect in managed Expo apps"
]);

export default function App() {
  const [client, setClient] = useState<any>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(null);
  const [isDarkMode, setDarkMode] = useState<boolean>(null);
  const preLoad = async () => {
    if (isDarkMode) {
      StatusBar.setBarStyle("light-content", true);
    } else {
      StatusBar.setBarStyle("dark-content", true);
    }
    try {
      await Font.loadAsync({
        ...Ionicons.font,
        ...AntDesign.font,
        ...FontAwesome.font,
        ...SimpleLineIcons.font["location-pin"],
        ...SimpleLineIcons.font["arrow-up"],
        ...SimpleLineIcons.font["arrow-down"]
      });
      await Asset.loadAsync(require("./assets/logo.png"));
      await Asset.loadAsync(require("./assets/phone_second.png"));
      await Asset.loadAsync(require("./assets/email_second.png"));
      await Asset.loadAsync(require("./assets/instagram.png"));
      await Asset.loadAsync(require("./assets/phone.png"));
      await Asset.loadAsync(require("./assets/email.png"));
      await Asset.loadAsync(require("./assets/kakao.png"));
      await Asset.loadAsync(require("./assets/facebook.png"));
      await Asset.loadAsync(require("./assets/youtube.png"));
      await Asset.loadAsync(require("./assets/twitter.png"));
      await Asset.loadAsync(require("./assets/telegram.png"));
      await Asset.loadAsync(require("./assets/snapchat.png"));
      await Asset.loadAsync(require("./assets/line.png"));
      await Asset.loadAsync(require("./assets/wechat.png"));
      await Asset.loadAsync(require("./assets/kik.png"));
      await Asset.loadAsync(require("./assets/vk.png"));
      await Asset.loadAsync(require("./assets/whatsapp.png"));
      await Asset.loadAsync(require("./assets/behance.png"));
      await Asset.loadAsync(require("./assets/linkedin.png"));
      await Asset.loadAsync(require("./assets/pinterest.png"));
      await Asset.loadAsync(require("./assets/vine.png"));
      await Asset.loadAsync(require("./assets/tumblr.png"));

      const cache = new InMemoryCache();
      // await AsyncStorage.clear();
      await persistCache({
        cache,
        storage: AsyncStorage
      });
      const API_SERVER = "https://pinner-backend.herokuapp.com/graphql";
      // const API_SERVER = "http://localhost:8000/graphql";
      const httpLink = createUploadLink({
        uri: API_SERVER,
        fetch
      });
      const authLink = setContext(async (_, { headers }) => {
        const token = await AsyncStorage.getItem("jwt");
        return {
          headers: {
            authorization: `JWT ${token || ""}`
          }
        };
      });
      const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache,
        ...apolloClientOptions
      });
      const isDarkMode = (await AsyncStorage.getItem("isDarkMode"))
        ? (await AsyncStorage.getItem("isDarkMode")) === "true"
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
          <AuthProvider isLoggedIn={isLoggedIn} client={client}>
            <LocationProvider>
              <ActionSheetProvider>
                <NavController />
              </ActionSheetProvider>
            </LocationProvider>
          </AuthProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ApolloHooksProvider>
  ) : (
    <AppLoading />
  );
}
