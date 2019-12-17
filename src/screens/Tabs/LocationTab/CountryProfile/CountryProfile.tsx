import React, { useState } from "react";
import { RefreshControl, Image, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useLocation } from "../../../../context/LocationContext";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import Swiper from "react-native-swiper";
import { SLACK_REPORT_LOCATIONS } from "../../../../sharedQueries";
import {
  CountryProfile,
  CountryProfileVariables,
  GetCountries,
  GetCountriesVariables,
  SlackReportLocations,
  SlackReportLocationsVariables
} from "../../../../types/api";
import { COUNTRY_PROFILE, GET_COUNTRIES } from "./CountryProfileQueries";
import constants from "../../../../../constants";
import { countries as countryData } from "../../../../../countryData";
import { useTheme } from "../../../../context/ThemeContext";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import { useActionSheet } from "@expo/react-native-action-sheet";

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  padding: 0 15px 0 15px;
`;

const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 34px;
  color: ${props => props.theme.color};
`;
const Flag = styled.Text`
  font-size: 24px;
  color: ${props => props.theme.color};
`;
const View = styled.View`
  justify-content: center;
  margin: 15px 0 15px 0;
`;
const CountryNameContainer = styled.View`
  align-items: center;
  flex-direction: row;
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
  text-transform: uppercase;
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
const NoPhotoContainer = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.bgColor};
`;
export default ({ navigation }) => {
  const location = useLocation();
  const isDarkMode = useTheme();
  const [countryCode, setCountryCode] = useState<string>(
    navigation.getParam("countryCode") || location.currentCountryCode
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const selectReportLocation = () => {
    showActionSheetWithOptions(
      {
        options: ["Inappropriate Photoes", "Wrong Location", "Other", "Cancel"],
        cancelButtonIndex: 3,
        title: `Choose a reason for reporting this country.`,
        showSeparators: true
      },
      async buttonIndex => {
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
        duration: Toast.durations.LONG,
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
        title: `Are you sure to report this country?`
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          slackReportLocationsFn({
            variables: {
              targetLocationId: countryCode,
              targetLocationType: "country",
              payload
            }
          });
          toast("Reported");
        }
      }
    );
  };
  const [
    slackReportLocationsFn,
    { loading: slackReportLocationsLoading }
  ] = useMutation<SlackReportLocations, SlackReportLocationsVariables>(
    SLACK_REPORT_LOCATIONS
  );
  const {
    data: {
      countryProfile: { count = null, country = null, cities = null } = {}
    } = {},
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<CountryProfile, CountryProfileVariables>(COUNTRY_PROFILE, {
    variables: { countryCode, page: 1 }
  });
  const {
    data: { getCountries: { countries = null } = {} } = {},
    loading: countriesLoading,
    refetch: countriesRefetch
  } = useQuery<GetCountries, GetCountriesVariables>(GET_COUNTRIES, {
    variables: { countryCode }
  });
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await profileRefetch();
      await countriesRefetch();
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
  if (profileLoading || countriesLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Container>
          {country && (
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
                      latitude: country.latitude,
                      longitude: country.longitude,
                      latitudeDelta: 10,
                      longitudeDelta: 10
                    }}
                    rotateEnabled={false}
                    customMapStyle={
                      isDarkMode && isDarkMode === true ? darkMode : lightMode
                    }
                  />
                </Touchable>
              ) : (
                <Touchable onPress={() => setMapOpen(true)}>
                  {country.countryPhoto ? (
                    <ProgressiveImage
                      tint={isDarkMode ? "dark" : "light"}
                      style={{
                        height: constants.width - 30,
                        width: constants.width - 30,
                        borderRadius: 3
                      }}
                      preview={{
                        uri: country.countryPhoto
                      }}
                      uri={country.countryPhoto}
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
                <CountryNameContainer>
                  <Bold>{country.countryName}</Bold>
                  <Flag>{country.countryEmoji}</Flag>
                </CountryNameContainer>
                <IconTouchable onPress={() => selectReportLocation()}>
                  <Ionicons
                    name={Platform.OS === "ios" ? "ios-list" : "md-list"}
                    size={25}
                    color={"#999"}
                  />
                </IconTouchable>
              </LocationNameContainer>
              {count && count !== 0 ? (
                <Text>
                  You've been to {country.countryName} {count}
                  {count === 1 ? " time" : " times"}
                </Text>
              ) : null}
            </View>
          )}
          {countries && countries.length !== 0 && (
            <Item>
              <Title>{country.continent.continentName}</Title>
              <UserContainer>
                <Swiper
                  style={{ height: 135 }}
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
                  {chunk(countries).map((countryItem, index) => {
                    return (
                      <UserColumn key={index}>
                        {countryItem.map((country: any, index: any) => {
                          return (
                            <Touchable
                              key={index}
                              onPress={() =>
                                navigation.push("CountryProfileTabs", {
                                  countryCode: country.countryCode,
                                  continentCode: country.continentCode
                                })
                              }
                            >
                              <UserRow country={country} type={"country"} />
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
          {cities && cities.length !== 0 && (
            <Item>
              <Title>
                {country.cityCount}
                {country.cityCount === 1 ? " CITY" : " CITIES"}
              </Title>
              {cities.map((city, index) => (
                <Touchable
                  key={index}
                  onPress={() =>
                    navigation.push("CityProfileTabs", {
                      cityId: city.cityId,
                      countryCode: city.country.countryCode,
                      continentCode: countryData.find(
                        i => i.code === city.country.countryCode
                      ).continent
                    })
                  }
                >
                  <UserRow city={city} type={"city"} />
                </Touchable>
              ))}
            </Item>
          )}
        </Container>
      </ScrollView>
    );
  }
};
