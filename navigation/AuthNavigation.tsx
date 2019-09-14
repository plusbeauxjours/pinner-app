import { createStackNavigator, createAppContainer } from "react-navigation";
import Signup from "../src/screens/Auth/Signup";
import Confirm from "../src/screens/Auth/Confirm";
import Login from "../src/screens/Auth/Login";
import AuthHome from "../src/screens/Auth/AuthHome";

const AuthNavigation = createStackNavigator(
  {
    AuthHome,
    Signup,
    Login,
    Confirm
  },
  {
    headerMode: "none"
  }
);

export default createAppContainer(AuthNavigation);
