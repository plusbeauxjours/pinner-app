import { createStackNavigator } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation";
import UserProfile from "../screens/Tabs/UserProfileTab/UserProfile";
import AvatarList from "../screens/Tabs/UserProfileTab/AvatarList";
import EditProfile from "../screens/Tabs/UserProfileTab/EditProfile";
import Cities from "../screens/Tabs/UserProfileTab/Cities";
import Countries from "../screens/Tabs/UserProfileTab/Countries";
import Continents from "../screens/Tabs/UserProfileTab/Continents";
import Coffees from "../screens/Tabs/UserProfileTab/Coffees";
import CityProfile from "../screens/Tabs/LocationTab/CityProfile";
import CountryProfile from "../screens/Tabs/LocationTab/CountryProfile";
import ContinentProfile from "../screens/Tabs/LocationTab/ContinentProfile";
import AvatarDetail from "../screens/Tabs/UserProfileTab/AvatarDetail/index";

export const UserProfileTabs = createMaterialTopTabNavigator(
  {
    UserProfile: {
      screen: UserProfile,
      navigationOptions: {
        header: null,
        mode: "modal"
      }
    },
    AvatarList: {
      screen: AvatarList,
      navigationOptions: {
        header: null,
        mode: "modal"
      }
    }
  },
  {
    animationEnabled: true,
    swipeEnabled: true,
    tabBarPosition: "bottom",
    tabBarOptions: {
      style: {
        backgroundColor: "white"
      },
      activeTintColor: "#000",
      inactiveTintColor: "#d1cece",
      upperCaseLabel: false,
      showLabel: false,
      showIcon: false
    }
  }
);

export const CountryProfileTabs = createMaterialTopTabNavigator(
  {
    CountryProfile: {
      screen: CountryProfile,
      navigationOptions: {
        header: null,
        mode: "modal"
      }
    },
    ContinentProfile: {
      screen: ContinentProfile,
      navigationOptions: {
        header: null,
        mode: "modal"
      }
    }
  },
  {
    animationEnabled: true,
    swipeEnabled: true,
    tabBarPosition: "bottom",
    tabBarOptions: {
      style: {
        backgroundColor: "white"
      },
      activeTintColor: "#000",
      inactiveTintColor: "#d1cece",
      upperCaseLabel: false,
      showLabel: false,
      showIcon: false
    }
  }
);

export const CityProfileTabs = createMaterialTopTabNavigator(
  {
    CityProfile: {
      screen: CityProfile,
      navigationOptions: {
        header: null,
        mode: "modal"
      }
    },
    CountryProfile: {
      screen: CountryProfile,
      navigationOptions: {
        header: null,
        mode: "modal"
      }
    },
    ContinentProfile: {
      screen: ContinentProfile,
      navigationOptions: {
        header: null,
        mode: "modal"
      }
    }
  },
  {
    animationEnabled: true,
    swipeEnabled: true,
    tabBarPosition: "bottom",
    tabBarOptions: {
      style: {
        backgroundColor: "white"
      },
      activeTintColor: "#000",
      inactiveTintColor: "#d1cece",
      upperCaseLabel: false,
      showLabel: false,
      showIcon: false
    }
  }
);

export default createStackNavigator(
  {
    UserProfileTabs,
    AvatarDetail,
    ContinentProfile,
    CountryProfileTabs,
    CityProfileTabs,
    EditProfile,
    AvatarList,
    Cities,
    Countries,
    Continents,
    Coffees
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);
