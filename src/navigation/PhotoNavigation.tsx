import React from "react";
import {
  createMaterialTopTabNavigator,
  createStackNavigator
} from "react-navigation";
import UploadPhoto from "../screens/Photo/UploadPhoto";
import SelectPhoto from "../screens/Photo/SelectPhoto";
import TakePhoto from "../screens/Photo/TakePhoto";
import { stackStyles } from "./Config";
import NavIcon from "../components/NavIcon";
import { Platform } from "react-native";

const PhotoTabs = createMaterialTopTabNavigator(
  {
    Select: {
      screen: SelectPhoto,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-grid" : "md-grid"}
          />
        )
      }
    },
    TakePhoto: {
      screen: TakePhoto,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-camera" : "md-camera"}
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
      indicatorStyle: {
        display: "none"
      },
      style: {
        height: 82,
        ...stackStyles
      },
      showLabel: false,
      showIcon: true
    }
  }
);

export default createStackNavigator(
  {
    PhotoTabs,
    UploadPhoto
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      }
    }
  }
);
