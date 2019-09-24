import React from "react";
import { createStackNavigator } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation";
import { Platform } from "react-native";
import NavIcon from "../components/NavIcon";
import UserProfile from "../screens/Tabs/UserProfileTab/UserProfile";
import AvatarList from "../screens/Tabs/UserProfileTab/AvatarList";

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
    UserProfile: {
      screen: stackFactory(UserProfile, { title: "UserProfile" }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-home" : "md-home"}
          />
        )
      }
    },
    AvatarList: {
      screen: stackFactory(AvatarList, { title: "AvatarList" }),
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
