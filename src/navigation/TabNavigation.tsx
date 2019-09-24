import React from "react";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
// import Notifications from "../screens/Tabs/Notifications";
import { Platform } from "react-native";
import NavIcon from "../components/NavIcon";
import HomeNavigation from "./HomeNavigation";
import LocationNavigation from "./LocationNavigation";
import Search from "../components/Search";
import PhotoLink from "../components/PhotoLink";
import RequestCoffee from "../screens/Tabs/RequestCoffeeTab/RequestCoffee";
import UserProfileNavigation from "./UserProfileNavigation";

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator({
    InitialRoute: {
      screen: initialRoute,
      navigationOptions: { ...customConfig }
    }
  });

export default createBottomTabNavigator(
  {
    Home: {
      screen: stackFactory(HomeNavigation, {
        headerLeft: (
          <Search
            name={Platform.OS === "ios" ? "ios-search" : "md-search"}
            size={36}
          />
        ),
        headerRight: <PhotoLink />
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-home" : "md-home"}
          />
        )
      }
    },
    Location: {
      screen: stackFactory(LocationNavigation, {
        headerLeft: (
          <Search
            name={Platform.OS === "ios" ? "ios-search" : "md-search"}
            size={36}
          />
        ),
        headerRight: <PhotoLink />
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-search" : "md-search"}
          />
        )
      }
    },
    Add: {
      screen: stackFactory(RequestCoffee, {
        headerLeft: (
          <Search
            name={Platform.OS === "ios" ? "ios-search" : "md-search"}
            size={36}
          />
        ),
        headerRight: <PhotoLink />
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-add" : "md-add"}
          />
        )
      }
    },
    // Notifications: {
    //   screen: stackFactory(Notifications, {
    //     title: "Notifications"
    //   }),
    //   navigationOptions: {
    //     tabBarIcon: ({ focused }) => (
    //       <NavIcon
    //         focused={focused}
    //         name={
    //           Platform.OS === "ios"
    //             ? focused
    //               ? "ios-heart"
    //               : "ios-heart-empty"
    //             : focused
    //             ? "md-heart"
    //             : "md-heart-empty"
    //         }
    //       />
    //     )
    //   }
    // },
    Profile: {
      screen: stackFactory(UserProfileNavigation, {
        headerLeft: (
          <Search
            name={Platform.OS === "ios" ? "ios-search" : "md-search"}
            size={36}
          />
        ),
        headerRight: <PhotoLink />
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
      showIcon: true
    }
  }
);
