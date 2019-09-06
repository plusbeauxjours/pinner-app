import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { Asset } from "expo-asset";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const preLoad = async () => {
    try {
      await Font.loadAsync;
      ({ ...Ionicons.font });
      setLoaded(true);
      await Asset.loadAsync(require("./assets/logo.png"));
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    preLoad();
  }, []);
  return loaded ? (
    <View>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  ) : (
    <AppLoading />
  );
}
