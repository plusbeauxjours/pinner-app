import React from "react";
import {
  createBottomTabNavigator,
  createStackNavigator,
  BottomTabBar
} from "react-navigation";
import { Platform } from "react-native";
import NavIcon from "../components/NavIcon";
import MatchNavigation from "./MatchNavigation";
import LocationNavigation from "./LocationNavigation";
import UserProfileNavigation from "./UserProfileNavigation";
import RequestNavigation from "./RequestNavigation";
import { useTheme } from "../context/ThemeContext";

const stackFactory = initialRoute =>
  createStackNavigator({
    InitialRoute: {
      screen: initialRoute,
      navigationOptions: {
        header: null
      }
    }
  });

const TabBarComponent = props => <BottomTabBar {...props} />;

export default createBottomTabNavigator(
  {
    Match: {
      screen: stackFactory(MatchNavigation),
      navigationOptions: ({ navigation }) => {
        let tabBarVisible;
        if (navigation.state.routes.length > 0) {
          if (navigation.state.routes[0].routes.length > 1) {
            if (
              navigation.state.routes[0].index === 1 &&
              navigation.state.routes[0].routes[1].routeName === "Chat"
            ) {
              tabBarVisible = false;
            } else {
              tabBarVisible = true;
            }
          }
        }
        return {
          tabBarVisible,
          tabBarIcon: ({ focused }) => (
            <NavIcon
              focused={focused}
              name={Platform.OS === "ios" ? "ios-text" : "md-text"}
            />
          )
        };
      }
    },
    RequestCoffee: {
      screen: stackFactory(RequestNavigation),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon focused={focused} name={"map-pin"} />
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
    tabBarComponent: props => {
      const isDarkMode = useTheme();
      return (
        <TabBarComponent
          {...props}
          style={{ backgroundColor: isDarkMode ? "#161616" : "#EFEFEF" }}
          activeTintColor={"#000"}
          inactiveTintColor={"#d1cece"}
          upperCaseLabel={false}
          showLabel={false}
          showIcon={true}
        />
      );
    },
    defaultNavigationOptions: {
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        const isFocused = navigation.isFocused();
        defaultHandler();
        if (navigation.state.routes[0].index > 0 && isFocused) {
          navigation.popToTop();
        }
      }
    }
  }
);
