import React from "react";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import { Platform } from "react-native";
import NavIcon from "../components/NavIcon";
import HomeNavigation from "./HomeNavigation";
import LocationNavigation from "./LocationNavigation";
import PhotoLink from "../components/PhotoLink";
import RequestCoffees from "../screens/Tabs/CoffeeTab/RequestCoffees";
import UserProfileNavigation from "./UserProfileNavigation";
import Search from "../components/Search";

const stackFactory = initialRoute =>
  createStackNavigator({
    InitialRoute: {
      screen: initialRoute,
      navigationOptions: {
        headerLeft: <Search />,
        headerRight: <PhotoLink />
      }
    }
  });

export default createBottomTabNavigator(
  {
    Home: {
      screen: stackFactory(HomeNavigation),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <>
            <NavIcon
              focused={focused}
              name={Platform.OS === "ios" ? "ios-home" : "md-home"}
            />
          </>
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
    RequestCoffees: {
      screen: stackFactory(RequestCoffees),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-add" : "md-add"}
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
