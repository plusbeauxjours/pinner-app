import React from "react";
import { Header } from "react-native-elements";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
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
import { useTheme } from "../context/ThemeContext";
import LocationLeftHeader from "../components/Header/LocationLeftHeader";
import BackArrow from "../components/Header/BackArrow";
import LocationCenterHeader from "../components/Header/LocationCenterHeader";
import UserProfileLeftHeader from "../components/Header/UserProfileLeftHeader";
import BlockedUsers from "../screens/Tabs/UserProfileTab/BlockedUsers";
import constants from "../../constants";
import UsersNationality from "../screens/Tabs/LocationTab/UsersNationality";
import UsersResidence from "../screens/Tabs/LocationTab/UsersResidence";

export const CountryProfileTabs = createMaterialTopTabNavigator(
  {
    CountryProfile: {
      screen: CountryProfile
    },
    ContinentProfile: {
      screen: ContinentProfile
    }
  },
  {
    swipeEnabled: true,
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
      screen: CityProfile
    },
    CountryProfile: {
      screen: CountryProfile
    },
    ContinentProfile: {
      screen: ContinentProfile
    }
  },
  {
    swipeEnabled: true,
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
      placement="left"
      leftComponent={<LocationLeftHeader />}
      centerComponent={<LocationCenterHeader />}
      rightComponent={<Search />}
      backgroundColor={isDarkMode ? "#161616" : "#EFEFEF"}
      centerContainerStyle={{
        position: "absolute",
        bottom: 13,
        marginLeft: constants.width / 2 - 40
      }}
      containerStyle={{
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "#999",
        borderBottomWidth: 0.5
      }}
      barStyle={isDarkMode ? "light-content" : "dark-content"}
    />
  );
};
const UserProfileCustomHeader = () => {
  const isDarkMode = useTheme();
  return (
    <Header
      placement="left"
      leftComponent={<UserProfileLeftHeader />}
      rightComponent={<Search />}
      backgroundColor={isDarkMode ? "#161616" : "#EFEFEF"}
      containerStyle={{
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "#999",
        borderBottomWidth: 0.5
      }}
      barStyle={isDarkMode ? "light-content" : "dark-content"}
    />
  );
};
const BackCustomHeader = () => {
  const isDarkMode = useTheme();
  return (
    <Header
      placement="left"
      leftComponent={<BackArrow />}
      rightComponent={<Search />}
      backgroundColor={isDarkMode ? "#161616" : "#EFEFEF"}
      containerStyle={{
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "#999",
        borderBottomWidth: 0.5
      }}
      barStyle={isDarkMode ? "light-content" : "dark-content"}
    />
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
  UsersNationality: {
    screen: UsersNationality,
    navigationOptions: {
      header: props => <BackCustomHeader />
    }
  },
  UsersResidence: {
    screen: UsersResidence,
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
