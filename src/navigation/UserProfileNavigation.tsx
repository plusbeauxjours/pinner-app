import React from "react";
import { createStackNavigator } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation";
import UserProfile from "../screens/Tabs/UserProfileTab/UserProfile";
import AvatarList from "../screens/Tabs/UserProfileTab/AvatarList";
import EditProfile from "../screens/Tabs/UserProfileTab/EditProfile";
import Cities from "../screens/Tabs/UserProfileTab/Cities";
import Countries from "../screens/Tabs/UserProfileTab/Countries";
import Continents from "../screens/Tabs/UserProfileTab/Continents";
import CityProfile from "../screens/Tabs/LocationTab/CityProfile";
import CountryProfile from "../screens/Tabs/LocationTab/CountryProfile";
import ContinentProfile from "../screens/Tabs/LocationTab/ContinentProfile";
import Home from "../screens/Login/Home/index";
import Search from "../components/Search/index";
import { Header } from "native-base";
import { useTheme } from "../context/ThemeContext";
import LocationLeftHeader from "../components/Header/LocationLeftHeader";
import BackArrow from "../components/Header/BackArrow";
import LocationCenterHeader from "../components/Header/LocationCenterHeader";
import constants from "../../constants";
import UserProfileLeftHeader from "../components/Header/UserProfileLeftHeader";
import UserProfileCenterHeader from "../components/Header/UserProfileCenterHeader";
import BlockedUsers from "../screens/Tabs/UserProfileTab/BlockedUsers";

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
        display: "none"
      },
      activeTintColor: "#000",
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
        display: "none"
      },
      activeTintColor: "#000",
      upperCaseLabel: false,
      showLabel: false,
      showIcon: false
    }
  }
);

const LocationCustomHeader = () => {
  const isDarkMode = useTheme();
  return (
    <Header
      style={{
        backgroundColor: isDarkMode ? "#161616" : "#EFEFEF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: constants.width
      }}
    >
      <LocationLeftHeader />
      <LocationCenterHeader />
      <Search />
    </Header>
  );
};
const UserProfileCustomHeader = () => {
  const isDarkMode = useTheme();
  return (
    <Header
      style={{
        backgroundColor: isDarkMode ? "#161616" : "#EFEFEF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: constants.width
      }}
    >
      <UserProfileLeftHeader />
      <UserProfileCenterHeader />
      <Search />
    </Header>
  );
};
const BackCustomHeader = () => {
  const isDarkMode = useTheme();
  return (
    <Header
      style={{
        backgroundColor: isDarkMode ? "#161616" : "#EFEFEF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: constants.width
      }}
    >
      <BackArrow />
      <Search />
    </Header>
  );
};

export default createStackNavigator({
  UserProfile: {
    screen: UserProfile,
    navigationOptions: {
      header: props => <UserProfileCustomHeader />
    }
  },
  AvatarList: {
    screen: AvatarList,
    navigationOptions: {
      header: props => <UserProfileCustomHeader />
    }
  },
  CityProfileTabs: {
    screen: CityProfileTabs,
    navigationOptions: {
      header: props => <LocationCustomHeader />
    }
  },
  ContinentProfile: {
    screen: ContinentProfile,
    navigationOptions: {
      header: props => <LocationCustomHeader />
    }
  },
  CountryProfileTabs: {
    screen: CountryProfileTabs,
    navigationOptions: {
      header: props => <LocationCustomHeader />
    }
  },
  EditProfile: {
    screen: EditProfile,
    navigationOptions: {
      header: props => <BackCustomHeader />
    }
  },
  Cities: {
    screen: Cities,
    navigationOptions: {
      header: props => <BackCustomHeader />
    }
  },
  Countries: {
    screen: Countries,
    navigationOptions: {
      header: props => <BackCustomHeader />
    }
  },
  Continents: {
    screen: Continents,
    navigationOptions: {
      header: props => <BackCustomHeader />
    }
  },
  BlockedUsers: {
    screen: BlockedUsers,
    navigationOptions: {
      header: props => <BackCustomHeader />
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      header: props => <BackCustomHeader />
    }
  }
});
