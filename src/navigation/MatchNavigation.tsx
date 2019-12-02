import React from "react";
import {
  createStackNavigator,
  createMaterialTopTabNavigator
} from "react-navigation";
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
import UserProfileHeader from "../components/Header/UserProfileHeader";
import BackArrow from "../components/Header/BackArrow";
import LocationCenterHeader from "../components/Header/LocationCenterHeader";
import { Header } from "native-base";
import { useTheme } from "../context/ThemeContext";
import constants from "../../constants";

const UserProfileTabs = createMaterialTopTabNavigator(
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
        display: "none"
      },
      activeTintColor: "#000",
      upperCaseLabel: false,
      showLabel: false,
      showIcon: false
    }
  }
);

const CountryProfileTabs = createMaterialTopTabNavigator(
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

const CityProfileTabs = createMaterialTopTabNavigator(
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

const MatchCustomHeader = () => {
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
      <MatchHeader />
      <Search />
    </Header>
  );
};
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
      <UserProfileHeader />
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
  Match: {
    screen: Match,
    navigationOptions: {
      header: <MatchCustomHeader />
    }
  },
  UserProfileTabs: {
    screen: UserProfileTabs,
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
  AvatarList: {
    screen: AvatarList,
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
