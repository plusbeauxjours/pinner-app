import {
  createMaterialTopTabNavigator,
  createStackNavigator
} from "react-navigation";
import UploadPhoto from "../screens/Photo/UploadPhoto";
import SelectPhoto from "../screens/Photo/SelectPhoto";
import TakePhoto from "../screens/Photo/TakePhoto";
import { stackStyles } from "./Config";

const PhotoTabs = createMaterialTopTabNavigator(
  {
    TakePhoto,
    SelectPhoto
  },
  { tabBarPosition: "bottom" }
);

export default createStackNavigator(
  {
    PhotoTabs,
    UploadPhoto
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      }
    }
  }
);
