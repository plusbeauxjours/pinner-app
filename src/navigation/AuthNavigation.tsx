import { createStackNavigator, createAppContainer } from "react-navigation";
import Signup from "../screens/Login/Signup";
import EmailApproach from "../screens/Login/Approach/EmailApproach";
import PhoneApproach from "../screens/Login/Approach/PhoneApproach";
import EmailVerification from "../screens/Login/Verification/EmailVerification";
import PhoneVerification from "../screens/Login/Verification/PhoneVerification";
import Home from "../screens/Login/Home";

const AuthNavigation = createStackNavigator(
  {
    Home,
    Signup,
    EmailApproach,
    PhoneApproach,
    EmailVerification,
    PhoneVerification
  },
  {
    headerMode: "none"
  }
);

export default createAppContainer(AuthNavigation);
