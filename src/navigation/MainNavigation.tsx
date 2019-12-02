import React from "react";
import { Linking } from "expo";
import { createStackNavigator, createAppContainer } from "react-navigation";
import TabNavigation from "./TabNavigation";

const MainNavigation = createStackNavigator(
  { TabNavigation },
  { headerMode: "none", mode: "modal" }
);

const AppContainer = createAppContainer(MainNavigation);

export default () => {
  const prefix = Linking.makeUrl("/");
  return <AppContainer uriPrefix={prefix} />;
};
