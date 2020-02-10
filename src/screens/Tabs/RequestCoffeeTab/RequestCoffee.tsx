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
import { countries } from "../../../../countryData";
import { AsyncStorage } from "react-native";
import { useReverseGeoCode } from "../../../hooks/useReverseGeoCode";
import { useReversePlaceId } from "../../../hooks/useReversePlaceId";

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
const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  padding: 0 15px 0 15px;
`;
const CoffeeContainer = styled.View``;
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
const EmptyContainer = styled.View`
  margin-bottom: 30px;
`;
const SmallEmptyContainer = styled.View`
  margin-bottom: 15px;
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
              toast("Requested");
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
                toast("Requested");
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
                toast("Requested");
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
                toast("Requested");
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
              toast("Requested");
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
              toast("Requested");
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
              toast("Requested");
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

  ///////// Query /////////
  const {
    data: { getTripCities: { coffeeId = null, trip = null } = {} } = {},
    loading: tripLoading,
    refetch: tripRefetch
  } = useQuery<GetTripCities>(GET_TRIP_CITIES);
  const {
    data: { recommendUsers: { users: recommendUsers = null } = {} } = {},
    loading: recommendUserLoading,
    refetch: recommendUserRefetch
  } = useQuery<RecommendUsers, RecommendUsersVariables>(RECOMMEND_USERS, {
    fetchPolicy: "no-cache"
  });
  const {
    data: {
      recommendLocations: { cities: recommendLocations = null } = {}
    } = {},
    loading: recommendLocationLoading,
    refetch: recommendLocationRefetch
  } = useQuery<RecommendLocations, RecommendLocationsVariables>(
    RECOMMEND_LOCATIONS,
    { fetchPolicy: "no-cache" }
  );
  ////////////////////////////
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
  const sortByDate = (a, b) => {
    let date1 = new Date(a.startDate);
    let date2 = new Date(b.startDate);
    return date1 < date2 ? 1 : date2 < date1 ? -1 : 0;
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await recommendUserRefetch();
      await recommendLocationRefetch();
      await tripRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
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
        toast("Requested");
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
        toast("Requested");
      }
      setResidenceModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  };
  const renderHeader = (section, _, isActive) => {
    if (section.city.hasCoffee) {
      return (
        <AccordionTitleContainer>
          <AccordionTitle>
            {section.city.cityName}
            {section.city.country.countryEmoji}
          </AccordionTitle>
          <AccordionIcon>
            <SimpleLineIcons
              size={10}
              color={"#999"}
              name={isActive ? "arrow-up" : "arrow-down"}
            />
          </AccordionIcon>
        </AccordionTitleContainer>
      );
    }
  };
  const renderContent = section => (
    <CoffeeContainer>
      <CollapsibleAccordion
        cityId={section.city.cityId}
        refreshing={refreshing}
      />
    </CoffeeContainer>
  );
  const onChange = (activeSections: any) => {
    setActiveSections(activeSections.includes(undefined) ? [] : activeSections);
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
  if (
    recommendUserLoading ||
    recommendLocationLoading ||
    meLoading ||
    tripLoading
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
            {trip.filter(r => r.city.hasCoffee).length !== 0 ? (
              <>
                <Accordion
                  sections={trip.filter(r => r.city.hasCoffee).sort(sortByDate)}
                  expandMultiple={true}
                  activeSections={activeSections}
                  renderHeader={renderHeader}
                  renderContent={renderContent}
                  onChange={onChange}
                  touchableComponent={TouchableOpacity}
                />
                <EmptyContainer />
              </>
            ) : (
              <SmallEmptyContainer />
            )}
            {recommendUsers && recommendUsers.length !== 0 && (
              <Item>
                <Title>RECOMMEND USERS</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: recommendUsers.length < 3 ? 90 : 135 }}
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
                    {chunk(recommendUsers).map((users, index) => {
                      return (
                        <UserColumn key={index}>
                          {users.map((user: any, index: any) => {
                            return (
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
                            );
                          })}
                        </UserColumn>
                      );
                    })}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
            {recommendLocations && recommendLocations.length !== 0 && (
              <Item>
                <Title>RECOMMEND LOCATIONS</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: recommendLocations.length < 3 ? 90 : 135 }}
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
                    {chunk(recommendLocations).map((locations, index) => {
                      return (
                        <UserColumn key={index}>
                          {locations.map((city: any, index: any) => {
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
          </Container>
        </ScrollView>
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
