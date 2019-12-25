import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import TabNavigation from "./TabNavigation";

const MainNavigation = createStackNavigator(
  { TabNavigation },
  { headerMode: "none", mode: "modal" }
);

const AppContainer = createAppContainer(MainNavigation);

export default () => {
  return <AppContainer />;
};
