import { createStackNavigator, createAppContainer } from "react-navigation";
import LightTabNavigation from "./LightTabNavigation";

const LightMainNavigation = createStackNavigator(
  { LightTabNavigation },
  { headerMode: "none", mode: "modal" }
);

export default createAppContainer(LightMainNavigation);
