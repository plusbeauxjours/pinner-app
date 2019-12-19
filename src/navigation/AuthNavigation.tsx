import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "../screens/Login/Home";

const AuthNavigation = createStackNavigator({ Home }, { headerMode: "none" });

export default createAppContainer(AuthNavigation);
