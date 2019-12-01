import React from "react";
import { createStackNavigator } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation";
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
      inactiveTintColor: "#d1cece",
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
      inactiveTintColor: "#d1cece",
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
      inactiveTintColor: "#d1cece",
      upperCaseLabel: false,
      showLabel: false,
      showIcon: false
    }
  }
);

export default createStackNavigator({
  Match: {
    screen: Match,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <MatchHeader />,
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
  CityProfileTabs: {
    screen: CityProfileTabs,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <LocationLeftHeader />,
      headerTitle: <LocationCenterHeader />,
      headerRight: <Search />
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
  AvatarList,
  Chat: {
    screen: Chat,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <BackArrow />,
      headerRight: <Search />
    }
  },
  SendLocationScreen
});
