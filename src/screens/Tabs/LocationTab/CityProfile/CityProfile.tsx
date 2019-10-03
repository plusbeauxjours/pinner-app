import React, { useState } from "react";
import { RefreshControl, ScrollView, Image } from "react-native";
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
  // console.log("navigation", navigation.getParam("cityId"));
  // console.log("state", cityId);
  // console.log("location", location.currentCityId);
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
  if (profileLoading || nearCitiesLoading || samenameCitiesLoading) {
    return <Loader />;
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
              <Bold>{city.cityName}</Bold>
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
                >
                  {nearCities.map((city, index) => {
                    return (
                      <UserColumn key={index}>
                        <Touchable
                          onPress={() =>
                            navigation.push("CityProfileTabs", {
                              cityId: city.cityId,
                              countryCode: city.country.countryCode,
                              continentCode:
                                city.country.continent.continentCode
                            })
                          }
                        >
                          <UserRow city={city} type={"city"} />
                        </Touchable>
                        <Touchable
                          onPress={() =>
                            navigation.push("CityProfileTabs", {
                              cityId: city.cityId,
                              countryCode: city.country.countryCode,
                              continentCode:
                                city.country.continent.continentCode
                            })
                          }
                        >
                          <UserRow city={city} type={"city"} />
                        </Touchable>
                        <Touchable
                          onPress={() =>
                            navigation.push("CityProfileTabs", {
                              cityId: city.cityId,
                              countryCode: city.country.countryCode,
                              continentCode:
                                city.country.continent.continentCode
                            })
                          }
                        >
                          <UserRow city={city} type={"city"} />
                        </Touchable>
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
                >
                  {samenameCities.map((city, index) => {
                    return (
                      <UserColumn key={index}>
                        <Touchable
                          onPress={() =>
                            navigation.push("CityProfileTabs ", {
                              cityId: city.cityId,
                              countryCode: city.country.countryCode,
                              continentCode:
                                city.country.continent.continentCode
                            })
                          }
                        >
                          <UserRow city={city} type={"city"} />
                        </Touchable>
                        <Touchable
                          onPress={() =>
                            navigation.push("CityProfileTabs ", {
                              cityId: city.cityId,
                              countryCode: city.country.countryCode,
                              continentCode:
                                city.country.continent.continentCode
                            })
                          }
                        >
                          <UserRow city={city} type={"city"} />
                        </Touchable>
                        <Touchable
                          onPress={() =>
                            navigation.push("CityProfileTabs ", {
                              cityId: city.cityId,
                              countryCode: city.country.countryCode,
                              continentCode:
                                city.country.continent.continentCode
                            })
                          }
                        >
                          <UserRow city={city} type={"city"} />
                        </Touchable>
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
                  style={{ height: 135 }}
                  paginationStyle={{ bottom: -15 }}
                >
                  {usersBefore.map((user, index) => {
                    return (
                      <UserColumn key={index}>
                        <Touchable
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
                        <Touchable
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
                        <Touchable
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
