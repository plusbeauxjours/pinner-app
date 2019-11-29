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
import UserProfileHeader from "../components/Header/UserProfileHeader";
import LocationLeftHeader from "../components/Header/LocationLeftHeader";
import BackArrow from "../components/Header/BackArrow";
import LocationRightHeader from "../components/Header/LocationRightHeader";

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
      inactiveTintColor: "#d1cece",
      upperCaseLabel: false,
      showLabel: false,
      showIcon: false
    }
  }
);

export default createStackNavigator({
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
      headerRight: (
        <>
          <LocationRightHeader />
          <Search />
        </>
      )
    }
  },
  ContinentProfile: {
    screen: ContinentProfile,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <LocationLeftHeader />,
      headerRight: (
        <>
          <LocationRightHeader />
          <Search />
        </>
      )
    }
  },
  CountryProfileTabs: {
    screen: CountryProfileTabs,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <LocationLeftHeader />,
      headerRight: (
        <>
          <LocationRightHeader />
          <Search />
        </>
      )
    }
  },
  EditProfile: {
    screen: EditProfile,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#161616"
      },
      headerLeft: <BackArrow />,
      headerRight: (
        <>
          <LocationRightHeader />
          <Search />
        </>
      )
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
  Home
});
