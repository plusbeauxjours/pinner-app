import { createStackNavigator, createAppContainer } from "react-navigation";
import DarkTabNavigation from "./DarkTabNavigation";

const DarkMainNavigation = createStackNavigator(
  { DarkTabNavigation },
  { headerMode: "none", mode: "modal" }
);

export default createAppContainer(DarkMainNavigation);
