import React from "react";
import { Linking } from "expo";
import { createStackNavigator, createAppContainer } from "react-navigation";
import DarkTabNavigation from "./DarkTabNavigation";

const DarkMainNavigation = createStackNavigator(
  { DarkTabNavigation },
  { headerMode: "none", mode: "modal" }
);

const AppContainer = createAppContainer(DarkMainNavigation);

export default () => {
  const prefix = Linking.makeUrl("/");
  console.log(prefix);

  return <AppContainer uriPrefix={prefix} />;
};
