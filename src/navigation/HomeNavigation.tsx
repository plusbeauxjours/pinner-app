import React from "react";
import { createStackNavigator } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation";
import Home from "../screens/Tabs/HomeTab/Home";
import { Platform } from "react-native";
import NavIcon from "../components/NavIcon";
import Chat from "../screens/Tabs/HomeTab/Chat";
import Match from "../screens/Tabs/HomeTab/Match";

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator({
    InitialRoute: {
      screen: initialRoute,
      navigationOptions: {
        ...customConfig,
        header: null,
        mode: "modal"
      }
    }
  });

export default createMaterialTopTabNavigator(
  {
    Home: {
      screen: stackFactory(Home, {}),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-home" : "md-home"}
          />
        )
      }
    },
    Match: {
      screen: stackFactory(Match, {
        title: "Match"
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-person" : "md-person"}
          />
        )
      }
    },
    Chat: {
      screen: stackFactory(Chat, {
        title: "Chat"
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-person" : "md-person"}
          />
        )
      }
    }
  },
  {
    animationEnabled: true,
    swipeEnabled: true,
    tabBarPosition: "bottom",
    tabBarOptions: {
      style: {
        backgroundColor: "white"
      },
      activeTintColor: "#000",
      inactiveTintColor: "#d1cece",
      upperCaseLabel: false,
      showLabel: false,
      showIcon: false
    }
  }
);
