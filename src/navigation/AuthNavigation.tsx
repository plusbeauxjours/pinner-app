import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from "../screens/Login/Home";

const AuthNavigation = createStackNavigator({ Home }, { headerMode: "none" });

export default createAppContainer(AuthNavigation);
