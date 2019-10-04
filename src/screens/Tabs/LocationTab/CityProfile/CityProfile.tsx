import React, { useState, useEffect } from "react";
import { RefreshControl, ScrollView, Image } from "react-native";
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

const Container = styled.View``;

const Text = styled.Text``;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 34;
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
`;
const Touchable = styled.TouchableOpacity``;

export default ({ navigation }) => {
  const me = useMe();
  const location = useLocation();
  const [cityId, setCityId] = useState<string>(
    navigation.getParam("cityId") || location.currentCityId
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [payload, setPayload] = useState<string>();
  const [nearCities, setNearCities] = useState<any>([]);
  const [samenameCities, setSamenameCities] = useState<any>([]);
  const [usersBefore, setsersBefore] = useState<any>([]);
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
    variables: { cityId }
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
  useEffect(() => {
    if (nearCitiesData && nearCitiesData.nearCities.cities.length !== 0) {
      setNearCities(chunk(nearCitiesData.nearCities.cities));
    }
    if (
      samenameCitiesData &&
      samenameCitiesData.getSamenameCities.cities.length !== 0
    ) {
      setSamenameCities(chunk(samenameCitiesData.getSamenameCities.cities));
    }
    if (profileData && profileData.cityProfile.usersBefore.length !== 0) {
      setsersBefore(chunk(profileData.cityProfile.usersBefore));
    }
  }, [cityId]);
  if (profileLoading || nearCitiesLoading || samenameCitiesLoading) {
    return <Loader />;
  } else {
    const {
      cityProfile: {
        count = null,
        hasNextPage = null,
        city = null,
        usersNow = null
      } = {}
    } = profileData;
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
          {nearCities && nearCities.length !== 0 && (
            <Item>
              <Title>NEAR CITIES</Title>
              <UserContainer>
                <Swiper
                  style={{ height: 135 }}
                  paginationStyle={{ bottom: -15 }}
                  loop={false}
                >
                  {nearCities &&
                    nearCities.length !== 0 &&
                    nearCities.map((cities, index) => {
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
                                    continentCode:
                                      city.country.continent.continentCode
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
                  style={{ height: 135 }}
                  paginationStyle={{ bottom: -15 }}
                  loop={false}
                >
                  {samenameCities.length !== 0 &&
                    samenameCities.map((cities, index) => {
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
                                    continentCode:
                                      city.country.continent.continentCode
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
          {console.log(usersBefore)}
          {usersBefore && usersBefore.length !== 0 && (
            <Item>
              <Title>USERS BEFORE</Title>
              <UserContainer>
                <Swiper
                  style={{ height: 135 }}
                  paginationStyle={{ bottom: -15 }}
                  loop={false}
                >
                  {usersBefore.length !== 0 &&
                    usersBefore.map((users, index) => {
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
