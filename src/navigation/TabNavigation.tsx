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
import { useTheme } from "../context/ThemeContext";

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
const Tab = createBottomTabNavigator();

export default () => {
  return (
    <Tab.Navigator
    initialRouteName="Feed"
    tabBarOptions={{
      activeTintColor: '#e91e63',
    }}
  >
    <Tab.Screen
      options={{
        tabBarIcon: ({ focused }) => (
          <>
            <NavIcon
              focused={focused}
              name={Platform.OS === "ios" ? "ios-home" : "md-home"}
            />
          </>
        )
      }}
    ></Tab.Screen>
  );
};

// export default createBottomTabNavigator(
//   {
//     Match: {
//       screen: stackFactory(MatchNavigation),
//       navigationOptions: {
//         tabBarIcon: ({ focused }) => (
//           <>
//             <NavIcon
//               focused={focused}
//               name={Platform.OS === "ios" ? "ios-home" : "md-home"}
//             />
//           </>
//         )
//       }
//     },
//     RequestCoffee: {
//       screen: stackFactory(RequestNavigation),
//       navigationOptions: {
//         tabBarIcon: ({ focused }) => (
//           <NavIcon
//             focused={focused}
//             name={Platform.OS === "ios" ? "ios-cafe" : "md-cafe"}
//           />
//         )
//       }
//     },
//     Location: {
//       screen: stackFactory(LocationNavigation),
//       navigationOptions: {
//         tabBarIcon: ({ focused }) => (
//           <NavIcon
//             focused={focused}
//             name={Platform.OS === "ios" ? "ios-map" : "md-map"}
//           />
//         )
//       }
//     },
//     Profile: {
//       screen: stackFactory(UserProfileNavigation),
//       navigationOptions: {
//         tabBarIcon: ({ focused }) => (
//           <NavIcon
//             focused={focused}
//             name={Platform.OS === "ios" ? "ios-person" : "md-person"}
//           />
//         )
//       }
//     }
//   },
//   {
//     animationEnabled: true,
//     swipeEnabled: true,
//     tabBarPosition: "bottom",
//     tabBarOptions: {
//       style: {
//         backgroundColor: isDarkMode ? "black" : "white"
//       },
//       activeTintColor: "#000",
//       inactiveTintColor: "#d1cece",
//       upperCaseLabel: false,
//       showLabel: false,
//       showIcon: true
//     }
//   }
// );
