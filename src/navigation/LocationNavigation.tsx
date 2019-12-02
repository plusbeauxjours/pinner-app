import React from "react";
import {
  createStackNavigator,
  createMaterialTopTabNavigator
} from "react-navigation";
import { Header } from "native-base";
import { useTheme } from "../context/ThemeContext";
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
import LocationLeftHeader from "../components/Header/LocationLeftHeader";
import UserProfileHeader from "../components/Header/UserProfileHeader";
import BackArrow from "../components/Header/BackArrow";
import LocationCenterHeader from "../components/Header/LocationCenterHeader";

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
        display: "none"
      },
      activeTintColor: "#000",
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

const MatchHeader = props => {
  const isDarkMOde = useTheme();
};
const LocationHeader = props => {
  const isDarkMode = useTheme();
  return (
    <Header
      {...props}
      style={{
        backgroundColor: isDarkMode ? "#161616" : "#EFEFEF",
        flexDirection: "row",
        justifyContents: "space-between",
        alignItems: "center"
      }}
    >
      <LocationLeftHeader />
      <LocationCenterHeader />
      <Search />
    </Header>
  );
};

export default createStackNavigator({
  CityProfileTabs: {
    screen: CityProfileTabs,
    navigationOptions: {
      header: props => <LocationHeader />
    }
  },
  ContinentProfile: {
    screen: ContinentProfile,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <LocationLeftHeader />,
      headerTitle: <LocationCenterHeader />,
      headerRight: <Search />
    }
  },
  CountryProfileTabs: {
    screen: CountryProfileTabs,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <LocationLeftHeader />,
      headerTitle: <LocationCenterHeader />,
      headerRight: <Search />
    }
  },
  UserProfileTabs: {
    screen: UserProfileTabs,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <UserProfileHeader />,
      headerRight: <Search />
    }
  },
  EditProfile: {
    screen: EditProfile,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <BackArrow />,
      headerRight: <Search />
    }
  },
  Cities: {
    screen: Cities,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <BackArrow />,
      headerRight: <Search />
    }
  },
  Countries: {
    screen: Countries,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <BackArrow />,
      headerRight: <Search />
    }
  },
  Continents: {
    screen: Continents,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <BackArrow />,
      headerRight: <Search />
    }
  },
  AvatarList
});
