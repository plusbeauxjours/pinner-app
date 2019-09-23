import { createStackNavigator } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation";
import Home from "../screens/Tabs/HomeTab/Home";
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
      screen: stackFactory(Home, {
        title: "Home"
      })
    },
    Match: {
      screen: stackFactory(Match, {
        title: "Match"
      })
    },
    Chat: {
      screen: stackFactory(Chat, {
        title: "Chat"
      })
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
