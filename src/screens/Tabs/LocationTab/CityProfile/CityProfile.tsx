import React, { useState } from "react";
import { RefreshControl, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useMe } from "../../../../context/MeContext";
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
import { NearCities, NearCitiesVariables } from "../../../../types/api";
import { SLACK_REPORT_LOCATIONS } from "../../../../sharedQueries";
import CityLikeBtn from "../../../../components/CityLikeBtn";
import constants from "../../../../../constants";
import mapStyles from "../../../../styles/mapStyles";
import { countries } from "../../../../../countryData";
import Weather from "../../../../components/Weather";

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
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
  padding: 15px;
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

export default ({ navigation }) => {
  const me = useMe();
  const location = useLocation();
  const [cityId, setCityId] = useState<string>(
    navigation.getParam("cityId") || location.currentCityId
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [payload, setPayload] = useState<string>();
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const [slackReportLocationsFn] = useMutation<
    SlackReportLocations,
    SlackReportLocationsVariables
  >(SLACK_REPORT_LOCATIONS, {
    variables: {
      targetLocationId: cityId,
      targetLocationType: "city",
      payload
    }
  });
  const {
    data: profileData,
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<CityProfile, CityProfileVariables>(CITY_PROFILE, {
    variables: { cityId }
  });
  const {
    data: nearCitiesData,
    loading: nearCitiesLoading,
    refetch: nearCitiesRefetch
  } = useQuery<NearCities, NearCitiesVariables>(NEAR_CITIES, {
    variables: { cityId },
    fetchPolicy: "network-only"
  });
  const {
    data: samenameCitiesData,
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
      await samenameCitiesRefetch();
      await nearCitiesRefetch();
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
  if (profileLoading || nearCitiesLoading || samenameCitiesLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    const {
      cityProfile: {
        count = null,
        hasNextPage = null,
        city = null,
        usersBefore = null,
        usersNow = null
      } = {}
    } = profileData;
    const {
      getSamenameCities: { cities: samenameCities = null } = {}
    } = samenameCitiesData;
    const { nearCities: { cities: nearCities = null } = {} } = nearCitiesData;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          {city && (
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
                      latitude: city.latitude,
                      longitude: city.longitude,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05
                    }}
                    loadingEnabled={true}
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
                      city.cityPhoto && {
                        uri: city.cityPhoto
                      }
                    }
                  />
                </Touchable>
              )}
              <Bold>{city.cityName}</Bold>
              <Text>
                {city.country.countryName} {city.country.countryEmoji}
              </Text>
              <Weather latitude={city.latitude} longitude={city.longitude} />
              {count && count !== 0 ? (
                <Text>
                  You've been to {city.cityName} {count}
                  {count === 1 ? " time" : " times"}
                </Text>
              ) : null}
              <CityLikeBtn
                isLiked={city.isLiked}
                cityId={city.cityId}
                likeCount={city.likeCount}
              />
            </View>
          )}
          {nearCities.length !== 0 && (
            <Item>
              <Title>NEAR CITIES</Title>
              <UserContainer>
                <Swiper
                  style={{ height: nearCities.length < 3 ? 90 : 135 }}
                  paginationStyle={{ bottom: -15 }}
                  loop={false}
                >
                  {chunk(nearCities).map((cities, index) => {
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
          {samenameCities.length !== 0 && (
            <Item>
              <Title>SAMENAME CITIES</Title>
              <UserContainer>
                <Swiper
                  style={{ height: samenameCities.length < 3 ? 90 : 135 }}
                  paginationStyle={{ bottom: -15 }}
                  loop={false}
                >
                  {chunk(samenameCities).map((cities, index) => {
                    return (
                      <UserColumn key={index}>
                        {cities.map((city: any, index: any) => {
                          return (
                            <Touchable
                              key={index}
                              onPress={() =>
                                navigation.push("CityProfileTabs ", {
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
          {usersBefore.length !== 0 && (
            <Item>
              <Title>USERS BEFORE</Title>
              <UserContainer>
                <Swiper
                  style={{ height: usersBefore.length < 3 ? 90 : 135 }}
                  paginationStyle={{ bottom: -15 }}
                  loop={false}
                >
                  {chunk(usersBefore).map((users, index) => {
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
              {usersNow.map((user, index) => (
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
    );
  }
};
