import React, { useState, useEffect } from "react";
import { Text, View, AsyncStorage } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { persistCache } from "apollo-cache-persist";
import ApolloClient from "apollo-boost";
import apolloClientOptions from "./apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { ApolloProvider } from "react-apollo";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
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
      setClient(client);
      setLoaded(true);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    preLoad();
  }, []);
  return loaded && client ? (
    <ApolloHooksProvider client={client}>
      <ApolloProvider client={client}>
        <View>
          <Text>Open up App.tsx to start working on your app!</Text>
        </View>
      </ApolloProvider>
    </ApolloHooksProvider>
  ) : (
    <AppLoading />
  );
}
