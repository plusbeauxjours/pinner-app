import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import { useQuery } from "react-apollo-hooks";
import { RECOMMEND_USERS, RECOMMEND_LOCATIONS } from "./HomeQueries";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import { ScrollView, RefreshControl } from "react-native";
import Swiper from "react-native-swiper";
import { GET_COFFEES } from "../../../../sharedQueries";
import {
  GetCoffees,
  GetCoffeesVariables,
  RecommendUsers,
  RecommendUsersVariables,
  RecommendLocations,
  RecommendLocationsVariables
} from "../../../../types/api";

const Container = styled.View``;

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
  const [refreshing, setRefreshing] = useState(false);
  const [cityId, setCityId] = useState(location.currentCityId);
  const {
    data: recommendUserData,
    loading: recommendUserLoading,
    refetch: recommendUserRefetch
  } = useQuery<RecommendUsers, RecommendUsersVariables>(RECOMMEND_USERS);
  const {
    data: recommendLocationData,
    loading: recommendLocationLoading,
    refetch: recommendLocationRefetch
  } = useQuery<RecommendLocations, RecommendLocationsVariables>(
    RECOMMEND_LOCATIONS
  );
  const {
    data: coffeeData,
    loading: coffeeLoading,
    refetch: coffeeRefetch
  } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
    variables: { location: "city", cityId }
  });
  useEffect(() => {
    setCityId(location.currentCityId);
  }, [location]);
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await coffeeRefetch();
      await recommendUserRefetch();
      await recommendLocationRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {recommendUserLoading || recommendLocationLoading || coffeeLoading ? (
        <Loader />
      ) : (
        <Container>
          {recommendUserData.recommendUsers.users &&
            recommendUserData.recommendUsers.users.length !== 0 && (
              <Item>
                <Title>RECOMMEND USERS</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {recommendUserData.recommendUsers.users.map(
                      (user, index) => {
                        return (
                          <UserColumn key={index}>
                            <Touchable
                              onPress={() =>
                                navigation.navigate("UserProfileTabs", {
                                  username: user.username
                                })
                              }
                            >
                              <UserRow user={user} type={"user"} />
                            </Touchable>
                            <Touchable
                              onPress={() =>
                                navigation.navigate("UserProfileTabs", {
                                  username: user.username
                                })
                              }
                            >
                              <UserRow user={user} type={"user"} />
                            </Touchable>
                            <Touchable
                              onPress={() =>
                                navigation.navigate("UserProfileTabs", {
                                  ...user
                                })
                              }
                            >
                              <UserRow user={user} type={"user"} />
                            </Touchable>
                          </UserColumn>
                        );
                      }
                    )}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
          {recommendLocationData.recommendLocations.cities &&
            recommendLocationData.recommendLocations.cities.length !== 0 && (
              <Item>
                <Title>RECOMMEND LOCATIONS</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {recommendLocationData.recommendLocations.cities.map(
                      (city, index) => (
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
                      )
                    )}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
          {coffeeData.getCoffees.coffees &&
            coffeeData.getCoffees.coffees.length !== 0 && (
              <Item>
                <Title>NEED SOME COFFEE NOW</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {coffeeData.getCoffees.coffees.map(coffee => (
                      <UserRow
                        key={coffee.id}
                        coffee={coffee}
                        type={"coffee"}
                      />
                    ))}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
        </Container>
      )}
    </ScrollView>
  );
};
