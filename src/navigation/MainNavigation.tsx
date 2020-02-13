import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import TabNavigation from "./TabNavigation";
// import Test from "../screens/Tabs/UserProfileTab/Test";

const MainNavigation = createStackNavigator(
  { TabNavigation },
  { headerMode: "none" }
);
// const MainNavigation = createStackNavigator({ Test }, { headerMode: "none" });
// To test if it's working without meProvider
// simple screen (TEST) and MeProvider

export default createAppContainer(MainNavigation);
