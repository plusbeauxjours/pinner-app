import React, { useState } from "react";
import { RefreshControl, Image, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useLocation } from "../../../../context/LocationContext";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import {
  CityProfile,
  CityProfileVariables,
  GetSamenameCities,
  GetSamenameCitiesVariables,
  SlackReportLocations,
  SlackReportLocationsVariables
} from "../../../../types/api";
import {
  CITY_PROFILE,
  GET_SAMENAME_CITIES,
  NEAR_CITIES
} from "./CityProfileQueries";
import Swiper from "react-native-swiper";
import {
  NearCities,
  NearCitiesVariables,
  GetCoffees,
  GetCoffeesVariables
} from "../../../../types/api";
import { SLACK_REPORT_LOCATIONS, GET_COFFEES } from "../../../../sharedQueries";
import CityLikeBtn from "../../../../components/CityLikeBtn";
import constants from "../../../../../constants";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import { countries } from "../../../../../countryData";
import Weather from "../../../../components/Weather";
import { useTheme } from "../../../../context/ThemeContext";
import Modal from "react-native-modal";
import Toast from "react-native-root-toast";
import { Entypo } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import CoffeeDetail from "../../../CoffeeDetail";

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  padding: 0 15px 0 15px;
`;

const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 34;
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
const InfoRow = styled.View`
  width: ${constants.width - 30};
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;
const IconTouchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;
const LocationNameContainer = styled.View`
  width: ${constants.width - 30};
  align-self: flex-start;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export default ({ navigation }) => {
  const location = useLocation();
  const isDarkMode = useTheme();
  const [cityId, setCityId] = useState<string>(
    navigation.getParam("cityId") || location.currentCityId
  );
  const isStaying = cityId === location.currentCityId;
  const [coffeeId, setCoffeeId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const selectReportLocation = () => {
    showActionSheetWithOptions(
      {
        options: ["Inappropriate Photoes", "Wrong Location", "Other", "Cancel"],
        cancelButtonIndex: 3,
        title: `Choose a reason for reporting this city.`,
        showSeparators: true
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
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: `Are you sure to report this city?`
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
          toast("Reported");
        }
      }
    );
  };
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const [slackReportLocationsFn] = useMutation<
    SlackReportLocations,
    SlackReportLocationsVariables
  >(SLACK_REPORT_LOCATIONS);
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
    variables: { cityId, page: 1 }
  });
  const {
    data: { nearCities: { cities: nearCities = null } = {} } = {},
    loading: nearCitiesLoading,
    refetch: nearCitiesRefetch
  } = useQuery<NearCities, NearCitiesVariables>(NEAR_CITIES, {
    variables: { cityId },
    fetchPolicy: "network-only"
  });
  const {
    data: { getSamenameCities: { cities: samenameCities = null } = {} } = {},
    loading: samenameCitiesLoading,
    refetch: samenameCitiesRefetch
  } = useQuery<GetSamenameCities, GetSamenameCitiesVariables>(
    GET_SAMENAME_CITIES,
    { variables: { cityId } }
  );
  const {
    data: { getCoffees: { coffees = null } = {} } = {},
    loading: coffeeLoading,
    refetch: coffeeRefetch
  } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
    variables: { location: "city", cityId }
  });
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await profileRefetch();
      await samenameCitiesRefetch();
      await nearCitiesRefetch();
      await coffeeRefetch();
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
    coffeeLoading
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
          style={{ margin: 0, alignItems: "flex-start" }}
          isVisible={modalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() => setModalOpen(false)}
          onBackButtonPress={() =>
            Platform.OS !== "ios" && setModalOpen(isStaying)
          }
          onModalHide={() => setModalOpen(false)}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Container>
            {city && (
              <View>
                {mapOpen ? (
                  // <Touchable onPress={() => setMapOpen(false)}>
                  <Touchable>
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
                  </Touchable>
                ) : (
                  <Touchable onPress={() => setMapOpen(true)}>
                    <Image
                      style={{
                        height: constants.width - 30,
                        width: constants.width - 30,
                        borderRadius: 3
                      }}
                      source={
                        city.cityPhoto && {
                          uri: city.cityPhoto
                        }
                      }
                    />
                  </Touchable>
                )}
                <LocationNameContainer>
                  <Bold>{city.cityName}</Bold>
                  <IconTouchable onPress={() => selectReportLocation()}>
                    <Entypo
                      size={22}
                      color={"#999"}
                      name={"dots-three-horizontal"}
                    />
                  </IconTouchable>
                </LocationNameContainer>
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
              </View>
            )}
            {nearCities && nearCities.length !== 0 && (
              <Item>
                <Title>NEAR CITIES</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: nearCities.length < 3 ? 90 : 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
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
                <Title>SAMENAME CITIES</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: samenameCities.length < 3 ? 90 : 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
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
            {coffees && coffees.length !== 0 && (
              <Item>
                <Title>NEED SOME COFFEE NOW</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: coffees.length < 3 ? 90 : 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
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
            {usersBefore && usersBefore.length !== 0 && (
              <Item>
                <Title>USERS BEFORE</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: usersBefore.length < 3 ? 90 : 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
                  >
                    {chunk(usersBefore).map((users, index: any) => {
                      return (
                        <UserColumn key={index}>
                          {users.map((user: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() =>
                                  navigation.push("UserProfileTabs", {
                                    username: user.actor.profile.username,
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
                <Title>USERS NOW</Title>
                {usersNow.map((user: any, index: any) => (
                  <Touchable
                    key={index}
                    onPress={() =>
                      navigation.push("UserProfileTabs", {
                        username: user.username
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
      </>
    );
  }
};
