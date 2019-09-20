import { createStackNavigator } from "react-navigation";
import Messages from "../screens/Messages/Messages";
import Message from "../screens/Messages/Message";
import { stackStyles } from "./Config";

export default createStackNavigator(
  {
    Messages,
    Message
  },
  {
    defaultNavigationOptions: {
      headerStyle: { ...stackStyles }
    }
  }
);
