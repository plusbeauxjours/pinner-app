import React from "react";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import { Platform } from "react-native";
import NavIcon from "../components/NavIcon";
import MatchNavigation from "./MatchNavigation";
import LocationNavigation from "./LocationNavigation";
import PhotoLink from "../components/PhotoLink";
import UserProfileNavigation from "./UserProfileNavigation";
import Search from "../components/Search";
import RequestNavigation from "./RequestNavigation";

const stackFactory = initialRoute =>
  createStackNavigator({
    InitialRoute: {
      screen: initialRoute,
      navigationOptions: {
        headerStyle: {
          backgroundColor: "#161616"
        },
        headerLeft: <Search />,
        headerRight: <PhotoLink />
      }
    }
  });

export default createBottomTabNavigator(
  {
    Match: {
      screen: stackFactory(MatchNavigation),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-home" : "md-home"}
          />
        )
      }
    },
    RequestCoffee: {
      screen: stackFactory(RequestNavigation),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-cafe" : "md-cafe"}
          />
        )
      }
    },
    Location: {
      screen: stackFactory(LocationNavigation),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-map" : "md-map"}
          />
        )
      }
    },
    Profile: {
      screen: stackFactory(UserProfileNavigation),
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
        backgroundColor: "#161616"
      },
      activeTintColor: "#000",
      inactiveTintColor: "#d1cece",
      upperCaseLabel: false,
      showLabel: false,
      showIcon: true
    }
  }
);
