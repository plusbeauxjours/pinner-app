import React, { useState, useEffect } from "react";
import { RefreshControl, ScrollView } from "react-native";
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

const Container = styled.View``;

const Text = styled.Text``;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
`;

const View = styled.View``;

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
  useEffect(() => {
    setCityId(navigation.getParam("cityId") || location.currentCityId);
  }, [navigation]);
  if (profileLoading || nearCitiesLoading || samenameCitiesLoading) {
    return <Loader />;
  } else if (
    !profileLoading &&
    !nearCitiesLoading &&
    !samenameCitiesLoading &&
    profileData &&
    nearCitiesData &&
    samenameCitiesData
  ) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          <Bold>City Profile</Bold>
          {profileData.cityProfile.city && (
            <View>
              <Text>cityName:{profileData.cityProfile.city.cityName}</Text>
              <Text>cityPhoto:{profileData.cityProfile.city.cityPhoto}</Text>
              {profileData.cityProfile.city.likeCount !== 0 ? (
                <Text>
                  {profileData.cityProfile.city.likeCount}
                  {profileData.cityProfile.city.likeCount === 1
                    ? " like"
                    : " likes"}
                </Text>
              ) : null}
              {profileData.cityProfile.city.userCount !== 0 ? (
                <Text>userCount:{profileData.cityProfile.city.userCount}</Text>
              ) : null}
              {profileData.cityProfile.city.userLogCount == 0 ? (
                <Text>
                  userLogCount:{profileData.cityProfile.city.userLogCount}
                </Text>
              ) : null}
              {profileData.cityProfile.count !== 0 ? (
                <Text>
                  You've been {profileData.cityProfile.city.cityName}{" "}
                  {profileData.cityProfile.count}
                  {profileData.cityProfile.count === 1 ? " time" : " times"}
                </Text>
              ) : null}
            </View>
          )}
          <CityLikeBtn
            isLiked={profileData.cityProfile.city.isLiked}
            cityId={profileData.cityProfile.city.cityId}
            likeCount={profileData.cityProfile.city.likeCount}
          />
          {console.log(nearCitiesData)}
          {nearCitiesData.nearCities &&
            nearCitiesData.nearCities.cities.length !== 0 && (
              <Item>
                <Title>NEAR CITIES</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {nearCitiesData.nearCities.cities.map((city, index) => {
                      return (
                        <UserColumn key={index}>
                          <Touchable
                            onPress={() =>
                              navigation.navigate("CityProfileTabs", {
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
                              navigation.navigate("CityProfileTabs", {
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
                              navigation.navigate("CityProfileTabs", {
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
          {samenameCitiesData.getSamenameCities.cities &&
            samenameCitiesData.getSamenameCities.cities.length !== 0 && (
              <Item>
                <Title>SAMENAME CITIES</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {samenameCitiesData.getSamenameCities.cities.map(
                      (city, index) => {
                        return (
                          <UserColumn key={index}>
                            <Touchable
                              onPress={() =>
                                navigation.navigate("CityProfileTabs ", {
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
                                navigation.navigate("CityProfileTabs ", {
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
                                navigation.navigate("CityProfileTabs ", {
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
                      }
                    )}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
          {profileData.cityProfile.usersBefore &&
            profileData.cityProfile.usersBefore.length !== 0 && (
              <Item>
                <Title>USERS BEFORE</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {profileData.cityProfile.usersBefore.map((user, index) => {
                      return (
                        <UserColumn key={index}>
                          <Touchable
                            onPress={() =>
                              navigation.navigate("UserProfile", {
                                username: user.actor.profile.username
                              })
                            }
                          >
                            {console.log(user.actor.profile.username)}
                            <UserRow user={user.actor.profile} type={"user"} />
                          </Touchable>
                          <Touchable
                            onPress={() =>
                              navigation.navigate("UserProfile", {
                                username: user.actor.profile.username
                              })
                            }
                          >
                            <UserRow user={user.actor.profile} type={"user"} />
                          </Touchable>
                          <Touchable
                            onPress={() =>
                              navigation.navigate("UserProfile", {
                                username: user.actor.profile.username
                              })
                            }
                          >
                            <UserRow user={user.actor.profile} type={"user"} />
                          </Touchable>
                        </UserColumn>
                      );
                    })}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
          {profileData.cityProfile.usersNow &&
            profileData.cityProfile.usersNow.length !== 0 && (
              <Item>
                <Title>USERS NOW</Title>
                {profileData.cityProfile.usersNow.map((user, index) => (
                  <Touchable
                    key={index}
                    onPress={() =>
                      navigation.navigate("UserProfileTabs", {
                        username: user.username
                      })
                    }
                  >
                    {console.log(user.username)}
                    <UserRow user={user} type={"user"} />
                  </Touchable>
                ))}
              </Item>
            )}
        </Container>
      </ScrollView>
    );
  } else {
    return null;
  }
};
