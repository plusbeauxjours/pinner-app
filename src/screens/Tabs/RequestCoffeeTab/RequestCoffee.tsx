import React, { useState } from "react";
import styled from "styled-components";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";
import CountryPicker, { DARK_THEME } from "react-native-country-picker-modal";
import * as Location from "expo-location";
import {
  RefreshControl,
  Platform,
  TouchableOpacity,
  Alert,
  Linking
} from "react-native";
import Swiper from "react-native-swiper";
import Toast from "react-native-root-toast";
import { SimpleLineIcons } from "@expo/vector-icons";
import Loader from "../../../components/Loader";
import UserRow from "../../../components/UserRow";
import { useQuery, useMutation } from "react-apollo-hooks";
import {
  RECOMMEND_USERS,
  RECOMMEND_LOCATIONS,
  REQUEST_COFFEE
} from "./RequestCoffeeQueries";
import { ME, DELETE_COFFEE, REPORT_LOCATION } from "../../../sharedQueries";
import {
  Me,
  RecommendUsers,
  RecommendUsersVariables,
  RecommendLocations,
  RecommendLocationsVariables,
  RequestCoffee,
  RequestCoffeeVariables,
  DeleteCoffee,
  DeleteCoffeeVariables,
  GetTripCities,
  ReportLocation,
  ReportLocationVariables
} from "../../../types/api";
import Modal from "react-native-modal";
import { useTheme } from "../../../context/ThemeContext";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useMe } from "../../../context/MeContext";
import constants from "../../../../constants";
import Accordion from "react-native-collapsible/Accordion";
import CollapsibleAccordion from "../../../components/CollapsibleAccordion";
import { GET_TRIP_CITIES } from "./RequestCoffeeQueries";
import { countries as countryData } from "../../../../countryData";
import { useReverseGeoCode } from "../../../hooks/useReverseGeoCode";
import { useReversePlaceId } from "../../../hooks/useReversePlaceId";
import axios from "axios";

const AccordionTitleContainer = styled.View`
  flex-direction: row;
  height: 20px;
  align-items: center;
  width: ${constants.width - 40};
  margin: 0 5px 0 5px;
`;
const AccordionIcon = styled.View`
  width: 20;
  height: 20;
  position: absolute;
  top: 5;
  right: 0;
`;
const AccordionTitle = styled.Text`
  font-size: 8px;
  color: ${props => props.theme.color};
`;

const CoffeeContainer = styled.View``;

const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
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

export default ({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const isDarkMode = useTheme();
  const [nationalityModalOpen, setNationalityModalOpen] = useState<boolean>(
    false
  );
  const [currentCityId, setCurrentCityId] = useState<string>("");
  const [activeSections, setActiveSections] = useState<any>([0, 1, 2, 3, 4]);
  const [residenceModalOpen, setResidenceModalOpen] = useState<boolean>(false);
  const [nationalityCode, setNationalityCode] = useState<any>("");
  const [residenceCode, setResidenceCode] = useState<any>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { showActionSheetWithOptions } = useActionSheet();
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
                currentCityId:
                  currentCityId && currentCityId.length !== 0
                    ? currentCityId
                    : me.user.profile.currentCity.cityId
              }
            });
            if (requestCoffee.ok) {
              const usersNow = [];
              requestCoffee.profiles.map((profile: any) => {
                if (!profile.isSelf) {
                  usersNow.push(profile.pushToken);
                }
              });
              toast("Requested");
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
                  currentCityId:
                    currentCityId && currentCityId.length !== 0
                      ? currentCityId
                      : me.user.profile.currentCity.cityId,
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
                toast("Requested");
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
                  currentCityId:
                    currentCityId && currentCityId.length !== 0
                      ? currentCityId
                      : me.user.profile.currentCity.cityId,
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
                toast("Requested");
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
                  currentCityId:
                    currentCityId && currentCityId.length !== 0
                      ? currentCityId
                      : me.user.profile.currentCity.cityId,
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
                toast("Requested");
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
                currentCityId:
                  currentCityId && currentCityId.length !== 0
                    ? currentCityId
                    : me.user.profile.currentCity.cityId,
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
              toast("Requested");
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
                currentCityId:
                  currentCityId && currentCityId.length !== 0
                    ? currentCityId
                    : me.user.profile.currentCity.cityId,
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
              toast("Requested");
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
                currentCityId:
                  currentCityId && currentCityId.length !== 0
                    ? currentCityId
                    : me.user.profile.currentCity.cityId,
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
              toast("Requested");
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

  ///////// Mutation /////////
  const [reportLocationFn, { loading: reportLocationLoading }] = useMutation<
    ReportLocation,
    ReportLocationVariables
  >(REPORT_LOCATION);
  const [requestCoffeeFn, { loading: requestCoffeeLoading }] = useMutation<
    RequestCoffee,
    RequestCoffeeVariables
  >(REQUEST_COFFEE, {
    refetchQueries: [{ query: GET_TRIP_CITIES }],
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
  >(DELETE_COFFEE, { refetchQueries: [{ query: GET_TRIP_CITIES }] });
  ////////////////////////////
  const cancelCoffee = coffeeId => {
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
              variables: { coffeeId }
            });
            if (deleteCoffee.ok) {
              toast("Canceled");
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  };

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
          currentCityId:
            currentCityId && currentCityId.length !== 0
              ? currentCityId
              : me.user.profile.currentCity.cityId,
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
        toast("Requested");
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
          currentCityId:
            currentCityId && currentCityId.length !== 0
              ? currentCityId
              : me.user.profile.currentCity.cityId,
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
        toast("Requested");
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
        setCurrentCityId(address.storableLocation.cityId);
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
  if (meLoading) {
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

        <Footer>
          {coffeeId ? (
            <CoffeeSubmitBtn
              disabled={deleteCoffeeLoading}
              onPress={() => cancelCoffee(coffeeId)}
            >
              <CoffeeSubmitContainer>
                <CoffeeText>CANCEL PIN</CoffeeText>
              </CoffeeSubmitContainer>
            </CoffeeSubmitBtn>
          ) : (
            <CoffeeSubmitBtn
              disabled={requestCoffeeLoading}
              onPress={() => {
                askPermission(), requestCoffee();
              }}
            >
              <CoffeeSubmitContainer>
                <CoffeeText>PIN</CoffeeText>
              </CoffeeSubmitContainer>
            </CoffeeSubmitBtn>
          )}
        </Footer>
      </>
    );
  }
};
