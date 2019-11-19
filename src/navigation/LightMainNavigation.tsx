import React from "react";
import { Linking } from "expo";
import { createStackNavigator, createAppContainer } from "react-navigation";
import LightTabNavigation from "./LightTabNavigation";

const LightMainNavigation = createStackNavigator(
  { LightTabNavigation },
  { headerMode: "none", mode: "modal" }
);

const AppContainer = createAppContainer(LightMainNavigation);

export default () => {
  const prefix = Linking.makeUrl("/");
  console.log(prefix);

  return <AppContainer uriPrefix={prefix} />;
};
