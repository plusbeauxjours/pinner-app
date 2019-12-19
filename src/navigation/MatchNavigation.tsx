import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import Chat from "../screens/Tabs/MatchTab/Chat";
import SendLocationScreen from "../screens/Tabs/MatchTab/Chat/SendLocationScreen";
import Match from "../screens/Tabs/MatchTab/Match";
import CityProfile from "../screens/Tabs/LocationTab/CityProfile";
import CountryProfile from "../screens/Tabs/LocationTab/CountryProfile";
import ContinentProfile from "../screens/Tabs/LocationTab/ContinentProfile";
import Cities from "../screens/Tabs/UserProfileTab/Cities";
import Countries from "../screens/Tabs/UserProfileTab/Countries";
import Continents from "../screens/Tabs/UserProfileTab/Continents";
import UserProfile from "../screens/Tabs/UserProfileTab/UserProfile";
import EditProfile from "../screens/Tabs/UserProfileTab/EditProfile";
import AvatarList from "../screens/Tabs/UserProfileTab/AvatarList";
import Search from "../components/Search/index";
import MatchHeader from "../components/Header/MatchHeader";
import LocationLeftHeader from "../components/Header/LocationLeftHeader";
import BackArrow from "../components/Header/BackArrow";
import LocationCenterHeader from "../components/Header/LocationCenterHeader";
import { useTheme } from "../context/ThemeContext";
import constants from "../../constants";
import UserProfileLeftHeader from "../components/Header/UserProfileLeftHeader";
import UserProfileCenterHeader from "../components/Header/UserProfileCenterHeader";
import BlockedUsers from "../screens/Tabs/UserProfileTab/BlockedUsers";
import { View } from "react-native";

const CountryProfileTabs = createMaterialTopTabNavigator(
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

const CityProfileTabs = createMaterialTopTabNavigator(
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

const MatchCustomHeader = () => {
  const isDarkMode = useTheme();
  return (
    <View
      style={{
        backgroundColor: isDarkMode ? "#161616" : "#EFEFEF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: constants.width,
        height: 60,
        borderBottomWidth: 0.5,
        borderBottomColor: "#999"
      }}
    >
      <MatchHeader />
      <Search />
    </View>
  );
};
const LocationCustomHeader = () => {
  const isDarkMode = useTheme();
  return (
    <View
      style={{
        backgroundColor: isDarkMode ? "#161616" : "#EFEFEF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: constants.width,
        height: 60,
        borderBottomWidth: 0.5,
        borderBottomColor: "#999"
      }}
    >
      <LocationLeftHeader />
      <LocationCenterHeader />
      <Search />
    </View>
  );
};
const UserProfileCustomHeader = () => {
  const isDarkMode = useTheme();
  return (
    <View
      style={{
        backgroundColor: isDarkMode ? "#161616" : "#EFEFEF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: constants.width,
        height: 60,
        borderBottomWidth: 0.5,
        borderBottomColor: "#999"
      }}
    >
      <UserProfileLeftHeader />
      <UserProfileCenterHeader />
      <Search />
    </View>
  );
};
const BackCustomHeader = () => {
  const isDarkMode = useTheme();
  return (
    <View
      style={{
        backgroundColor: isDarkMode ? "#161616" : "#EFEFEF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: constants.width,
        height: 60,
        borderBottomWidth: 0.5,
        borderBottomColor: "#999"
      }}
    >
      <BackArrow />
      <Search />
    </View>
  );
};

export default createStackNavigator({
  Match: {
    screen: Match,
    navigationOptions: {
      header: props => <MatchCustomHeader />
    }
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: {
      header: props => <UserProfileCustomHeader />
    }
  },
  AvatarList: {
    screen: AvatarList,
    navigationOptions: {
      header: props => <BackCustomHeader />
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
  Chat: {
    screen: Chat,
    navigationOptions: {
      header: props => <BackCustomHeader />
    }
  },
  SendLocationScreen: {
    screen: SendLocationScreen,
    navigationOptions: {
      header: props => <BackCustomHeader />
    }
  }
});
