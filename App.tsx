import React, { useState, useEffect } from "react";
import { AsyncStorage, StatusBar } from "react-native";
import {
  Ionicons,
  AntDesign,
  FontAwesome,
  SimpleLineIcons,
  Entypo
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
import NavController from "./src/components/NavController";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";

export default function App() {
  const [client, setClient] = useState<any>(null);
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDarkMode, setDarkMode] = useState<boolean>(true);

  const setSentry = () => {
    Sentry.init({
      dsn: "https://9ea37b5166e44d5fbbda4ee206f998a2@sentry.io/2113636",
      enableInExpoDevelopment: true,
      debug: true
    });
    Sentry.setRelease(
      Constants.manifest.revisionId ? Constants.manifest.revisionId : ""
    );
  };
  const setIsDarkMode = async () => {
    const isDarkMode = await AsyncStorage.getItem("isDarkMode");
    if (isDarkMode === "false" || isDarkMode === null) {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  };
  const setStatusBar = () => {
    try {
      if (isDarkMode) {
        StatusBar.setBarStyle("light-content", true);
      } else {
        StatusBar.setBarStyle("dark-content", true);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const makeClient = async () => {
    try {
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
            ...headers,
            authorization: token ? `JWT ${token}` : ""
          }
        };
      });
      const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache
      });
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn === null || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setClient(client);
    } catch (e) {
      console.log(e);
    }
  };
  const loadResourcesAsync = async () => {
    await Font.loadAsync({
      ...Ionicons.font,
      ...AntDesign.font,
      ...FontAwesome.font,
      ...SimpleLineIcons.font["arrow-up"],
      ...SimpleLineIcons.font["arrow-down"],
      ...Entypo.font["pin"]
    }),
      await Asset.loadAsync([
        require("./assets/splash.png"),
        require("./assets/logo.png"),
        require("./assets/phone_second.png"),
        require("./assets/email_second.png"),
        require("./assets/instagram.png"),
        require("./assets/phone.png"),
        require("./assets/email.png"),
        require("./assets/kakao.png"),
        require("./assets/facebook.png"),
        require("./assets/youtube.png"),
        require("./assets/twitter.png"),
        require("./assets/telegram.png"),
        require("./assets/snapchat.png"),
        require("./assets/line.png"),
        require("./assets/wechat.png"),
        require("./assets/kik.png"),
        require("./assets/vk.png"),
        require("./assets/whatsapp.png"),
        require("./assets/behance.png"),
        require("./assets/linkedin.png"),
        require("./assets/pinterest.png"),
        require("./assets/vine.png"),
        require("./assets/tumblr.png"),
        require("./assets/tumblr.png")
      ]);
  };
  const handleLoadingError = error => {
    console.warn(error);
  };
  const handleFinishLoading = () => {
    setLoadingComplete(true);
  };
  useEffect(() => {
    makeClient();
    setSentry();
    setStatusBar();
    setIsDarkMode();
  }, []);
  if (isLoadingComplete && client && isLoggedIn !== null) {
    return (
      <ApolloHooksProvider client={client}>
        <ApolloProvider client={client}>
          <ThemeProvider isDarkMode={isDarkMode}>
            <AuthProvider isLoggedIn={isLoggedIn} client={client}>
              <ActionSheetProvider>
                <NavController />
              </ActionSheetProvider>
            </AuthProvider>
          </ThemeProvider>
        </ApolloProvider>
      </ApolloHooksProvider>
    );
  } else {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading()}
      />
    );
  }
}
