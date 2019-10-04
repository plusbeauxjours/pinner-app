import React, { useState, useEffect } from "react";
import { RefreshControl, ScrollView, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useMe } from "../../../../context/MeContext";
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
import mapStyles from "../../../../styles/mapStyles";

const Container = styled.View``;

const Text = styled.Text``;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 34;
`;
const Flag = styled.Text`
  font-size: 24;
`;
const View = styled.View`
  justify-content: center;
  padding: 15px;
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
  font-size: 18px;
  padding-left: 15px;
  margin-bottom: 5px;
`;
const Touchable = styled.TouchableOpacity``;

export default ({ navigation }) => {
  const me = useMe();
  const location = useLocation();
  const [countryCode, setCountryCode] = useState<string>(
    navigation.getParam("countryCode") || location.currentCountryCode
  );
  // console.log("navigation=========", navigation.getParam("countryCode"));
  // console.log("state=========", countryCode);
  // console.log("location=========", location.currentCountryCode);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [payload, setPayload] = useState<string>();
  const [continentCountries, setContinentCountries] = useState([]);
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const [slackReportLocationsFn] = useMutation<
    SlackReportLocations,
    SlackReportLocationsVariables
  >(SLACK_REPORT_LOCATIONS, {
    variables: {
      targetLocationId: countryCode,
      targetLocationType: "country",
      payload
    }
  });
  const {
    data: profileData,
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<CountryProfile, CountryProfileVariables>(COUNTRY_PROFILE, {
    variables: { countryCode }
  });
  const {
    data: countriesData,
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
  useEffect(() => {
    if (countriesData.getCountries.countries.length !== 0) {
      setContinentCountries(chunk(countriesData.getCountries.countries));
    }
  }, [countryCode]);
  if (profileLoading || countriesLoading) {
    return <Loader />;
  } else {
    const {
      countryProfile: {
        count = null,
        hasNextPage = null,
        country = null,
        cities = null
      } = {}
    } = profileData;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          {country && (
            <View>
              {mapOpen ? (
                <Touchable onPress={() => setMapOpen(false)}>
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
                    customMapStyle={mapStyles}
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
                      country.countryPhoto && {
                        uri: country.countryPhoto
                      }
                    }
                  />
                </Touchable>
              )}

              <CountryNameContainer>
                <Bold>{country.countryName}</Bold>
                <Flag>{country.countryEmoji}</Flag>
              </CountryNameContainer>
              {count && count !== 0 ? (
                <Text>
                  You've been to {country.countryName} {count}
                  {count === 1 ? " time" : " times"}
                </Text>
              ) : null}
            </View>
          )}
          {continentCountries.length !== 0 && (
            <Item>
              {/* <Title>{country.continent.continentName}</Title> */}
              <UserContainer>
                <Swiper
                  style={{ height: 135 }}
                  paginationStyle={{ bottom: -15 }}
                  loop={false}
                >
                  {continentCountries.length !== 0 &&
                    continentCountries.map((countries, index) => {
                      return (
                        <UserColumn key={index}>
                          {countries.map((country: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() =>
                                  navigation.push("CountryProfileTabs", {
                                    countryCode: country.countryCode,
                                    continentCode:
                                      country.continent.continentCode
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
          {/* {cities.length !== 0 && (
              <Item>
                <Title>
                  {country.cityCount}
                  {country.cityCount === 1 ? " CITY" : " CITIES"}
                </Title>
                {cities.map((city, index) => (
                  <Touchable
                    onPress={() =>
                      navigation.push("CityProfileTabs", {
                        cityId: city.cityId,
                        countryCode: city.country.countryCode,
                        continentCode: city.country.continent.continentCode
                      })
                    }
                  >
                    <UserRow key={index} city={city} type={"city"} />
                  </Touchable>
                ))}
              </Item>
            )} */}
        </Container>
      </ScrollView>
    );
  }
};
