import React, { useState } from "react";
import { RefreshControl, Platform, Alert, Linking } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as IntentLauncher from "expo-intent-launcher";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import {
  Me,
  CityProfile,
  CityProfileVariables,
  GetSamenameCities,
  GetSamenameCitiesVariables,
  SlackReportLocations,
  SlackReportLocationsVariables,
  ReportLocation,
  ReportLocationVariables,
  RequestCoffee,
  RequestCoffeeVariables,
  DeleteCoffee,
  DeleteCoffeeVariables,
  GetMyCoffee
} from "../../../../types/api";
import {
  CITY_PROFILE,
  GET_SAMENAME_CITIES,
  NEAR_CITIES,
  REQUEST_COFFEE,
  GET_MY_COFFEE
} from "./CityProfileQueries";
import Swiper from "react-native-swiper";
import {
  NearCities,
  NearCitiesVariables,
  GetCoffees,
  GetCoffeesVariables
} from "../../../../types/api";
import {
  SLACK_REPORT_LOCATIONS,
  GET_COFFEES,
  DELETE_COFFEE,
  REPORT_LOCATION,
  ME
} from "../../../../sharedQueries";
import CountryPicker, { DARK_THEME } from "react-native-country-picker-modal";
import CityLikeBtn from "../../../../components/CityLikeBtn";
import constants from "../../../../../constants";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import { countries } from "../../../../../countryData";
import Weather from "../../../../components/Weather";
import { useTheme } from "../../../../context/ThemeContext";
import Modal from "react-native-modal";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import CoffeeDetail from "../../../CoffeeDetail";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import { withNavigation } from "react-navigation";
import { useMe } from "../../../../context/MeContext";
import axios from "axios";
import { useReverseGeoCode } from "../../../../hooks/useReverseGeoCode";
import { useReversePlaceId } from "../../../../hooks/useReversePlaceId";

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  padding: 0 15px 0 15px;
`;

const MapContainer = styled.View``;

const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 34px;
  color: ${props => props.theme.color};
`;

const View = styled.View`
  justify-content: center;
  margin: 15px 0 15px 0;
`;

const UserContainer = styled.View``;

const UserColumn = styled.View``;

const Item = styled.View`
  flex: 1;
  margin-bottom: 25px;
`;
const Title = styled.Text`
  font-weight: 500;
  margin-left: 5px;
  font-size: 18px;
  margin-bottom: 5px;
  color: ${props => props.theme.color};
`;
const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const More = styled.Text`
  margin-left: 20px;
  color: ${props => props.theme.greyColor};
`;
const Touchable = styled.TouchableOpacity``;
const ScrollView = styled.ScrollView`
  background-color: ${props => props.theme.bgColor};
`;
const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;
const InfoRow = styled.View`
  width: ${constants.width - 40};
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;
const IconTouchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-left: 10px;
`;
const LocationNameContainer = styled.View`
  width: ${constants.width - 40};
  margin-left: 5px;
  align-self: flex-start;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
const LocationInfoContainer = styled.View`
  width: ${constants.width - 40};
  margin-left: 5px;
`;
const NoPhotoContainer = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.bgColor};
  height: ${constants.width - 30};
  width: ${constants.width - 30};
  border-radius: 3;
  border: 0.5px solid #999;
`;
const CoffeeText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.color};
`;
const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  background-color: ${props => props.theme.bgColor};
`;
const CoffeeSubmitContainer = styled.View`
  width: ${constants.width - 40};
  justify-content: center;
  align-items: center;
  height: 40px;
  border: 0.5px solid #999;
  border-radius: 5px;
`;
const CoffeeSubmitBtn = styled.TouchableOpacity`
  justify-content: center;
  padding: 0 5px 5px 5px;
`;

export default withNavigation(({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const isDarkMode = useTheme();
  const [cityId, setCityId] = useState<string>(
    navigation.getParam("cityId") || me.user.profile.currentCity.cityId
  );
  const [coffeeId, setCoffeeId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const { showActionSheetWithOptions } = useActionSheet();

  // 2020/02/25
  // Footer from REQUEST screen
  const [nationalityModalOpen, setNationalityModalOpen] = useState<boolean>(
    false
  );
  const [nationalityCode, setNationalityCode] = useState<any>("");
  const [residenceModalOpen, setResidenceModalOpen] = useState<boolean>(false);
  const [residenceCode, setResidenceCode] = useState<any>("");
  const toast = (message: string) => {
    Toast.show(message, {
      duration: 1000,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const onSelectNationality = async (country: any) => {
    try {
      const {
        data: { requestCoffee }
      } = await requestCoffeeFn({
        variables: {
          target: "nationality",
          currentCityId: cityId,
          countryCode: country.cca2
        }
      });
      if (requestCoffee.ok) {
        const usersNow = [];
        requestCoffee.profiles.map((profile: any) => {
          if (!profile.isSelf) {
            usersNow.push(profile.pushToken);
          }
        });
        await coffeeRefetch();
        toast("PIN Requested");
        return axios.post("https://exp.host/--/api/v2/push/send", {
          to: usersNow,
          title: "New pin",
          body: `${me.user.username}: New pin from ${me.user.profile.currentCity.cityName}`
        });
      }
      setNationalityModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  };
  const onSelectrRsidence = async (country: any) => {
    try {
      const {
        data: { requestCoffee }
      } = await requestCoffeeFn({
        variables: {
          target: "residence",
          currentCityId: cityId,
          countryCode: country.cca2
        }
      });
      if (requestCoffee.ok) {
        const usersNow = [];
        requestCoffee.profiles.map((profile: any) => {
          if (!profile.isSelf) {
            usersNow.push(profile.pushToken);
          }
        });
        await coffeeRefetch();
        toast("PIN Requested");
        return axios.post("https://exp.host/--/api/v2/push/send", {
          to: usersNow,
          title: "New pin",
          body: `${me.user.username}: New pin from ${me.user.profile.currentCity.cityName}`
        });
      }
      setResidenceModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  };
  const requestCoffee = () => {
    showActionSheetWithOptions(
      {
        options: [
          "Everyone",
          me.user.profile.nationality
            ? `Nationality: ${me.user.profile.nationality.countryName} ${me.user.profile.nationality.countryEmoji}`
            : "Nationality",
          me.user.profile.residence
            ? `Residence: ${me.user.profile.residence.countryName} ${me.user.profile.residence.countryEmoji}`
            : "Residence",
          me.user.profile.gender
            ? (() => {
                switch (me.user.profile.gender) {
                  case "MALE":
                    return "Gender: Male";
                  case "FEMALE":
                    return "Gender: Female";
                  case "OTHER":
                    return "Gender: Other";
                  default:
                    return null;
                }
              })()
            : "Gender",
          "Cancel"
        ],
        cancelButtonIndex: 4,
        title: `Choose a target.`,
        showSeparators: true,
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400"
        },
        separatorStyle: { opacity: 0.5 }
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          try {
            const {
              data: { requestCoffee }
            } = await requestCoffeeFn({
              variables: {
                target: "everyone",
                currentCityId: cityId
              }
            });
            if (requestCoffee.ok) {
              const usersNow = [];
              requestCoffee.profiles.map((profile: any) => {
                if (!profile.isSelf) {
                  usersNow.push(profile.pushToken);
                }
              });
              await coffeeRefetch();
              toast("PIN Requested");
              return axios.post("https://exp.host/--/api/v2/push/send", {
                to: usersNow,
                title: "New pin",
                body: `${me.user.username}: New pin from ${me.user.profile.currentCity.cityName}`
              });
            }
          } catch (e) {
            console.log(e);
          }
        } else if (buttonIndex === 1) {
          if (me.user.profile.nationality) {
            try {
              const {
                data: { requestCoffee }
              } = await requestCoffeeFn({
                variables: {
                  target: "nationality",
                  currentCityId: cityId,
                  countryCode: me.user.profile.nationality.countryCode
                }
              });
              if (requestCoffee.ok) {
                const usersNow = [];
                requestCoffee.profiles.map((profile: any) => {
                  if (!profile.isSelf) {
                    usersNow.push(profile.pushToken);
                  }
                });
                await coffeeRefetch();
                toast("PIN Requested");
                return axios.post("https://exp.host/--/api/v2/push/send", {
                  to: usersNow,
                  title: "New pin",
                  body: `${me.user.username}: New pin from ${me.user.profile.currentCity.cityName}`
                });
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            setNationalityModalOpen(true);
          }
        } else if (buttonIndex === 2) {
          if (me.user.profile.residence) {
            try {
              const {
                data: { requestCoffee }
              } = await requestCoffeeFn({
                variables: {
                  target: "residence",
                  currentCityId: cityId,
                  countryCode: me.user.profile.residence.countryCode
                }
              });
              if (requestCoffee.ok) {
                const usersNow = [];
                requestCoffee.profiles.map((profile: any) => {
                  if (!profile.isSelf) {
                    usersNow.push(profile.pushToken);
                  }
                });
                await coffeeRefetch();
                toast("PIN Requested");
                return axios.post("https://exp.host/--/api/v2/push/send", {
                  to: usersNow,
                  title: "New pin",
                  body: `${me.user.username}: New pin from ${me.user.profile.currentCity.cityName}`
                });
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            setResidenceModalOpen(true);
          }
        } else if (buttonIndex === 3) {
          if (me.user.profile.gender) {
            try {
              const {
                data: { requestCoffee }
              } = await requestCoffeeFn({
                variables: {
                  target: "gender",
                  currentCityId: cityId,
                  gender: me.user.profile.gender
                }
              });
              if (requestCoffee.ok) {
                const usersNow = [];
                requestCoffee.profiles.map((profile: any) => {
                  if (!profile.isSelf) {
                    usersNow.push(profile.pushToken);
                  }
                });
                await coffeeRefetch();
                toast("PIN Requested");
                return axios.post("https://exp.host/--/api/v2/push/send", {
                  to: usersNow,
                  title: "New pin",
                  body: `${me.user.username}: New pin from ${me.user.profile.currentCity.cityName}`
                });
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            onOpenGenderActionSheet();
          }
        } else {
          null;
        }
      }
    );
  };
  const onOpenGenderActionSheet = () => {
    showActionSheetWithOptions(
      {
        options: ["Male", "Female", "Other", "Cancel"],
        cancelButtonIndex: 3,
        showSeparators: true,
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400"
        },
        separatorStyle: { opacity: 0.5 }
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          try {
            const {
              data: { requestCoffee }
            } = await requestCoffeeFn({
              variables: {
                target: "gender",
                currentCityId: cityId,
                gender: "MALE"
              }
            });
            if (requestCoffee.ok) {
              const usersNow = [];
              requestCoffee.profiles.map((profile: any) => {
                if (!profile.isSelf) {
                  usersNow.push(profile.pushToken);
                }
              });
              await coffeeRefetch();
              toast("PIN Requested");
              return axios.post("https://exp.host/--/api/v2/push/send", {
                to: usersNow,
                title: "New pin",
                body: `${me.user.username}: New pin from ${me.user.profile.currentCity.cityName}`
              });
            }
          } catch (e) {
            console.log(e);
          }
        } else if (buttonIndex === 1) {
          try {
            const {
              data: { requestCoffee }
            } = await requestCoffeeFn({
              variables: {
                target: "gender",
                currentCityId: cityId,
                gender: "FEMALE"
              }
            });
            if (requestCoffee.ok) {
              const usersNow = [];
              requestCoffee.profiles.map((profile: any) => {
                if (!profile.isSelf) {
                  usersNow.push(profile.pushToken);
                }
              });
              await coffeeRefetch();
              toast("PIN Requested");
              return axios.post("https://exp.host/--/api/v2/push/send", {
                to: usersNow,
                title: "New pin",
                body: `${me.user.username}: New pin from ${me.user.profile.currentCity.cityName}`
              });
            }
          } catch (e) {
            console.log(e);
          }
        } else if (buttonIndex === 2) {
          try {
            const {
              data: { requestCoffee }
            } = await requestCoffeeFn({
              variables: {
                target: "gender",
                currentCityId: cityId,
                gender: "OTHER"
              }
            });
            if (requestCoffee.ok) {
              const usersNow = [];
              requestCoffee.profiles.map((profile: any) => {
                if (!profile.isSelf) {
                  usersNow.push(profile.pushToken);
                }
              });
              await coffeeRefetch();
              toast("PIN Requested");
              return axios.post("https://exp.host/--/api/v2/push/send", {
                to: usersNow,
                title: "New pin",
                body: `${me.user.username}: New pin from ${me.user.profile.currentCity.cityName}`
              });
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          null;
        }
      }
    );
  };
  const cancelCoffee = myCoffeeId => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        showSeparators: true,
        title: "Are you sure to cancel?",
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400"
        },
        separatorStyle: { opacity: 0.5 }
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          try {
            const {
              data: { deleteCoffee }
            } = await deleteCoffeeFn({
              variables: { coffeeId: myCoffeeId }
            });
            if (deleteCoffee.ok) {
              await coffeeRefetch();
              toast("PIN Canceled");
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  };
  const askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    const { locationServicesEnabled } = await Location.getProviderStatusAsync();
    if (locationServicesEnabled) {
      if (Platform.OS === "ios" && status === "denied") {
        Alert.alert(
          "Permission Denied",
          "To enable location, tap Open Settings, then tap on Location, and finally tap on While Using the App.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openURL("app-settings:");
              }
            }
          ]
        );
      } else if (Platform.OS === "android" && status === "denied") {
        Alert.alert(
          "Permission Denied",
          "To enable location, tap Open Settings, then tap on Permissions, then tap on Location, and finally tap on Allow only while using the app.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                const pkg = Constants.manifest.releaseChannel
                  ? Constants.manifest.android.package
                  : "host.exp.exponent";
                IntentLauncher.startActivityAsync(
                  IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                  { data: "package:" + pkg }
                );
              }
            }
          ]
        );
      } else if (status === "granted") {
        const position = await Location.getCurrentPositionAsync({
          timeout: 5000
        });
        handleGeoSuccess(position);
      } else {
        return;
      }
    } else {
      Alert.alert("Location permission required.");
    }
  };
  const handleGeoSuccess = position => {
    const {
      coords: { latitude, longitude }
    } = position;
    getAddress(latitude, longitude);
  };
  const getAddress = async (latitude: number, longitude: number) => {
    try {
      const address = await useReverseGeoCode(latitude, longitude);
      if (address) {
        const cityInfo = await useReversePlaceId(
          address.storableLocation.cityId
        );
        setCityId(address.storableLocation.cityId);
        await reportLocationFn({
          variables: {
            currentLat: cityInfo.storableLocation.latitude,
            currentLng: cityInfo.storableLocation.longitude,
            currentCityId: address.storableLocation.cityId,
            currentCityName: address.storableLocation.cityName,
            currentCountryCode: address.storableLocation.countryCode
          }
        });
        // await AsyncStorage.setItem("cityId", address.storableLocation.cityId);
        // await AsyncStorage.setItem(
        //   "countryCode",
        //   address.storableLocation.countryCode
        // );
      }
    } catch (e) {
      console.log(e);
    }
  };
  const selectReportLocation = () => {
    showActionSheetWithOptions(
      {
        options: ["Inappropriate Photoes", "Wrong Location", "Other", "Cancel"],
        cancelButtonIndex: 3,
        title: `Choose a reason for reporting this city.`,
        showSeparators: true,
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400"
        },
        separatorStyle: { opacity: 0.5 }
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          reportLocation("PHOTO");
        } else if (buttonIndex === 1) {
          reportLocation("LOCATION");
        } else if (buttonIndex === 2) {
          reportLocation("OTHER");
        } else {
          null;
        }
      }
    );
  };
  const reportLocation = (payload: string) => {
    const toast = (message: string) => {
      Toast.show(message, {
        duration: 1000,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0
      });
    };
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        showSeparators: true,
        title: `Are you sure to report this city?`,
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400"
        },
        separatorStyle: { opacity: 0.5 }
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          slackReportLocationsFn({
            variables: {
              targetLocationId: cityId,
              targetLocationType: "city",
              payload
            }
          });
          toast("PIN Reported");
        }
      }
    );
  };
  // 2020/02/25
  // Footer from REQUEST screen
  const {
    data: { nearCities: { cities: nearCities = null } = {} } = {},
    loading: nearCitiesLoading,
    refetch: nearCitiesRefetch
  } = useQuery<NearCities, NearCitiesVariables>(NEAR_CITIES, {
    variables: { cityId }
  });
  const [reportLocationFn, { loading: reportLocationLoading }] = useMutation<
    ReportLocation,
    ReportLocationVariables
  >(REPORT_LOCATION);
  const [requestCoffeeFn, { loading: requestCoffeeLoading }] = useMutation<
    RequestCoffee,
    RequestCoffeeVariables
  >(REQUEST_COFFEE, {
    refetchQueries: [
      {
        query: GET_COFFEES,
        variables: { location: "city", cityId }
      },
      { query: GET_MY_COFFEE }
    ],
    update(cache, { data: { requestCoffee } }) {
      try {
        const meData = cache.readQuery<Me>({
          query: ME
        });
        if (meData) {
          if (
            !meData.me.user.profile.nationality &&
            requestCoffee.coffee.host.profile.nationality
          ) {
            meData.me.user.profile.nationality =
              requestCoffee.coffee.host.profile.nationality;
          }
          if (
            !meData.me.user.profile.residence &&
            requestCoffee.coffee.host.profile.residence
          ) {
            meData.me.user.profile.residence =
              requestCoffee.coffee.host.profile.residence;
          }
          if (
            !meData.me.user.profile.gender &&
            requestCoffee.coffee.host.profile.gender
          ) {
            meData.me.user.profile.gender =
              requestCoffee.coffee.host.profile.gender;
          }
          cache.writeQuery({
            query: ME,
            data: meData
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const [deleteCoffeeFn, { loading: deleteCoffeeLoading }] = useMutation<
    DeleteCoffee,
    DeleteCoffeeVariables
  >(DELETE_COFFEE, {
    refetchQueries: [
      {
        query: GET_COFFEES,
        variables: { location: "city", cityId }
      },
      { query: GET_MY_COFFEE }
    ]
  });
  const [
    slackReportLocationsFn,
    { loading: slackReportLocationsLoading }
  ] = useMutation<SlackReportLocations, SlackReportLocationsVariables>(
    SLACK_REPORT_LOCATIONS
  );
  const {
    data: {
      cityProfile: {
        count = null,
        city = null,
        usersBefore = null,
        usersNow = null
      } = {}
    } = {},
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<CityProfile, CityProfileVariables>(CITY_PROFILE, {
    variables: { cityId, page: 1, payload: "BOX" }
  });
  const {
    data: { getCoffees: { coffees = null } = {} } = {},
    loading: coffeeLoading,
    refetch: coffeeRefetch
  } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
    variables: { location: "city", cityId },
    fetchPolicy: "no-cache"
  });
  const {
    data: { getMyCoffee: { coffeeId: myCoffeeId = null } = {} } = {},
    loading: getMyCoffeeLoading,
    refetch: getMyCoffeeRefetch
  } = useQuery<GetMyCoffee>(GET_MY_COFFEE, {
    variables: { cityId }
  });
  const {
    data: { getSamenameCities: { cities: samenameCities = null } = {} } = {},
    loading: samenameCitiesLoading,
    refetch: samenameCitiesRefetch
  } = useQuery<GetSamenameCities, GetSamenameCitiesVariables>(
    GET_SAMENAME_CITIES,
    { variables: { cityId } }
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await profileRefetch();
      await nearCitiesRefetch();
      await samenameCitiesRefetch();
      await coffeeRefetch();
      await getMyCoffeeRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  const onPress = coffeeId => {
    setModalOpen(true);
    setCoffeeId(coffeeId);
  };
  const chunk = arr => {
    let chunks = [],
      i = 0,
      n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, (i += 3)));
    }
    return chunks;
  };
  if (
    profileLoading ||
    nearCitiesLoading ||
    samenameCitiesLoading ||
    coffeeLoading ||
    meLoading
  ) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <>
        <Modal
          style={{
            margin: 0,
            alignItems: "flex-start"
          }}
          isVisible={nationalityModalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() => setNationalityModalOpen(false)}
          onBackButtonPress={() =>
            Platform.OS === "android" && setNationalityModalOpen(false)
          }
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          <CountryPicker
            theme={isDarkMode && DARK_THEME}
            countryCode={nationalityCode}
            withFilter={true}
            withFlag={true}
            withAlphaFilter={true}
            withEmoji={true}
            onSelect={onSelectNationality}
            withModal={false}
            onClose={() => {
              setNationalityCode(""), setNationalityModalOpen(false);
            }}
          />
        </Modal>
        <Modal
          style={{
            margin: 0,
            alignItems: "flex-start"
          }}
          isVisible={residenceModalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() => setResidenceModalOpen(false)}
          onBackButtonPress={() =>
            Platform.OS === "android" && setResidenceModalOpen(false)
          }
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          <CountryPicker
            theme={isDarkMode && DARK_THEME}
            countryCode={residenceCode}
            withFilter={true}
            withFlag={true}
            withAlphaFilter={true}
            withEmoji={true}
            onSelect={onSelectrRsidence}
            withModal={false}
            onClose={() => {
              setResidenceCode(""), setResidenceModalOpen(false);
            }}
          />
        </Modal>
        <Modal
          style={{ margin: 0, alignItems: "flex-start" }}
          isVisible={modalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() => setModalOpen(false)}
          onBackButtonPress={() =>
            Platform.OS === "android" && setModalOpen(false)
          }
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          <CoffeeDetail
            coffeeId={coffeeId}
            setModalOpen={setModalOpen}
            isStaying={true}
          />
        </Modal>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={"#999"}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <Container>
            {city && (
              <View>
                {mapOpen ? (
                  <MapContainer>
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      style={{
                        height: constants.width - 30,
                        width: constants.width - 30,
                        borderRadius: 3
                      }}
                      initialRegion={{
                        latitude: city.latitude,
                        longitude: city.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05
                      }}
                      loadingEnabled={true}
                      rotateEnabled={false}
                      customMapStyle={
                        isDarkMode && isDarkMode === true ? darkMode : lightMode
                      }
                    />
                  </MapContainer>
                ) : (
                  <Touchable onPress={() => setMapOpen(true)}>
                    {city.cityPhoto ? (
                      <ProgressiveImage
                        tint={isDarkMode ? "dark" : "light"}
                        style={{
                          height: constants.width - 30,
                          width: constants.width - 30,
                          borderRadius: 3
                        }}
                        preview={{
                          uri: city.cityPhoto
                        }}
                        uri={city.cityPhoto}
                      />
                    ) : (
                      <NoPhotoContainer>
                        <Text>NO</Text>
                        <Text>PHOTO</Text>
                      </NoPhotoContainer>
                    )}
                  </Touchable>
                )}
                <LocationNameContainer>
                  <Bold>{city.cityName}</Bold>
                  <IconTouchable onPress={() => selectReportLocation()}>
                    <Ionicons
                      name={Platform.OS === "ios" ? "ios-list" : "md-list"}
                      size={25}
                      color={"#999"}
                    />
                  </IconTouchable>
                </LocationNameContainer>
                <LocationInfoContainer>
                  <Text>
                    {city.country.countryName} {city.country.countryEmoji}
                  </Text>
                  {count && count !== 0 ? (
                    <Text>
                      You've been to {city.cityName} {count}
                      {count === 1 ? " time" : " times"}
                    </Text>
                  ) : null}
                  <InfoRow>
                    <Weather
                      latitude={city.latitude}
                      longitude={city.longitude}
                    />
                    <CityLikeBtn
                      height={"15px"}
                      isLiked={city.isLiked}
                      cityId={city.cityId}
                      likeCount={city.likeCount}
                    />
                  </InfoRow>
                </LocationInfoContainer>
              </View>
            )}
            {coffees && coffees.length !== 0 && (
              <Item>
                {coffees.length === 1 ? (
                  <Title>PIN NOW</Title>
                ) : (
                  <Title>PINS NOW</Title>
                )}
                <UserContainer>
                  <Swiper
                    style={{ height: coffees.length < 3 ? 90 : 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
                    index={0}
                    dotColor={isDarkMode ? "#424242" : "#DADADA"}
                    activeDotStyle={{
                      backgroundColor: isDarkMode ? "#EFEFEF" : "#161616",
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3
                    }}
                  >
                    {chunk(coffees).map((coffeeColumn, index: any) => {
                      return (
                        <UserColumn key={index}>
                          {coffeeColumn.map((coffee: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() => onPress(coffee.uuid)}
                              >
                                <UserRow
                                  key={coffee.id}
                                  coffee={coffee}
                                  type={"coffee"}
                                />
                              </Touchable>
                            );
                          })}
                        </UserColumn>
                      );
                    })}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
            {nearCities && nearCities.length !== 0 && (
              <Item>
                <Title>NEAR CITIES</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: nearCities.length < 3 ? 90 : 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
                    dotColor={isDarkMode ? "#424242" : "#DADADA"}
                    activeDotStyle={{
                      backgroundColor: isDarkMode ? "#EFEFEF" : "#161616",
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3
                    }}
                  >
                    {chunk(nearCities).map((cities, index: any) => {
                      return (
                        <UserColumn key={index}>
                          {cities.map((city: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() =>
                                  navigation.push("CityProfileTabs", {
                                    cityId: city.cityId,
                                    countryCode: city.country.countryCode,
                                    continentCode: countries.find(
                                      i => i.code === city.country.countryCode
                                    ).continent
                                  })
                                }
                              >
                                <UserRow city={city} type={"nearCity"} />
                              </Touchable>
                            );
                          })}
                        </UserColumn>
                      );
                    })}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
            {samenameCities && samenameCities.length !== 0 && (
              <Item>
                {samenameCities.length === 1 ? (
                  <Title>SAMENAME CITY</Title>
                ) : (
                  <Title>SAMENAME CITIES</Title>
                )}
                <UserContainer>
                  <Swiper
                    style={{ height: samenameCities.length < 3 ? 90 : 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
                    index={0}
                    dotColor={isDarkMode ? "#424242" : "#DADADA"}
                    activeDotStyle={{
                      backgroundColor: isDarkMode ? "#EFEFEF" : "#161616",
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3
                    }}
                  >
                    {chunk(samenameCities).map((cities, index: any) => {
                      return (
                        <UserColumn key={index}>
                          {cities.map((city: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() => {
                                  navigation.push("CityProfileTabs", {
                                    cityId: city.cityId,
                                    countryCode: city.country.countryCode,
                                    continentCode: countries.find(
                                      i => i.code === city.country.countryCode
                                    ).continent
                                  });
                                }}
                              >
                                <UserRow city={city} type={"nearCity"} />
                              </Touchable>
                            );
                          })}
                        </UserColumn>
                      );
                    })}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
            {usersBefore && usersBefore.length !== 0 && (
              <Item>
                {usersBefore.length === 1 ? (
                  <TitleContainer>
                    <Title>USER who is in {city.cityName}, BEFORE</Title>
                  </TitleContainer>
                ) : (
                  <TitleContainer>
                    <Title>USERS who are in {city.cityName}, BEFORE</Title>
                    {usersBefore.length > 15 && (
                      <Touchable
                        onPress={() =>
                          navigation.push("UsersBefore", {
                            cityId: city.cityId,
                            payload: "APP"
                          })
                        }
                      >
                        <More>More</More>
                      </Touchable>
                    )}
                  </TitleContainer>
                )}
                <UserContainer>
                  <Swiper
                    style={{ height: usersBefore.length < 3 ? 90 : 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
                    index={0}
                    dotColor={isDarkMode ? "#424242" : "#DADADA"}
                    activeDotStyle={{
                      backgroundColor: isDarkMode ? "#EFEFEF" : "#161616",
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3
                    }}
                  >
                    {chunk(usersBefore).map((users, index: any) => {
                      return (
                        <UserColumn key={index}>
                          {users.map((user: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() =>
                                  navigation.push("UserProfile", {
                                    uuid: user.actor.profile.uuid,
                                    isSelf: user.actor.profile.isSelf
                                  })
                                }
                              >
                                <UserRow
                                  user={user.actor.profile}
                                  naturalTime={user.naturalTime}
                                  type={"userBefore"}
                                />
                              </Touchable>
                            );
                          })}
                        </UserColumn>
                      );
                    })}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
            {usersNow && usersNow.length !== 0 && (
              <Item>
                {usersNow.length === 1 ? (
                  <Title>USER who is in {city.cityName}, NOW</Title>
                ) : (
                  <Title>USERS who are in {city.cityName}, NOW</Title>
                )}
                {usersNow.map((user: any, index: any) => (
                  <Touchable
                    key={index}
                    onPress={() =>
                      navigation.push("UserProfile", {
                        uuid: user.uuid,
                        isSelf: user.isSelf
                      })
                    }
                  >
                    <UserRow user={user} type={"user"} />
                  </Touchable>
                ))}
              </Item>
            )}
          </Container>
        </ScrollView>
        {cityId === me.user.profile.currentCity.cityId && (
          <Footer>
            {myCoffeeId ? (
              <CoffeeSubmitBtn
                disabled={deleteCoffeeLoading}
                onPress={() => cancelCoffee(myCoffeeId)}
              >
                <CoffeeSubmitContainer>
                  <CoffeeText>CANCEL PIN</CoffeeText>
                </CoffeeSubmitContainer>
              </CoffeeSubmitBtn>
            ) : (
              <CoffeeSubmitBtn
                disabled={requestCoffeeLoading}
                onPress={async () => {
                  await getMyCoffeeRefetch(),
                    await askPermission(),
                    await requestCoffee();
                }}
              >
                <CoffeeSubmitContainer>
                  <CoffeeText>PIN</CoffeeText>
                </CoffeeSubmitContainer>
              </CoffeeSubmitBtn>
            )}
          </Footer>
        )}
      </>
    );
  }
});
