import {
  createMaterialTopTabNavigator,
  createStackNavigator
} from "react-navigation";
import UploadPhoto from "../src/screens/Photo/UploadPhoto";
import SelectPhoto from "../src/screens/Photo/SelectPhoto";
import TakePhoto from "../src/screens/Photo/TakePhoto";

const PhotoTabs = createMaterialTopTabNavigator(
  {
    SelectPhoto,
    TakePhoto
  },
  { tabBarPosition: "bottom" }
);

export default createStackNavigator({
  PhotoTabs,
  UploadPhoto
});
