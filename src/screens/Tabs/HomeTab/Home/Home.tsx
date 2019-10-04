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
  const cityId = location.currentCityId;
  const [recommendUsers, setRecommendUsers] = useState([]);
  const [recommendLocations, setRecommendLocations] = useState([]);
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
    if (recommendUserData.recommendUsers.users.length !== 0) {
      setRecommendUsers(chunk(recommendUserData.recommendUsers.users));
    }
    if (recommendLocationData.recommendLocations.cities.length !== 0) {
      setRecommendLocations(
        chunk(recommendLocationData.recommendLocations.cities)
      );
    }
  }, []);
  if (recommendUserLoading || recommendLocationLoading || coffeeLoading) {
    return <Loader />;
  } else {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          <Item>
            <Title>RECOMMEND USERS</Title>
            <UserContainer>
              <Swiper
                style={{ height: 135 }}
                paginationStyle={{ bottom: -15 }}
                loop={false}
              >
                {recommendUsers.length !== 0 &&
                  recommendUsers.map((users, index) => {
                    return (
                      <UserColumn key={index}>
                        {users.map((user: any, index: any) => {
                          return (
                            <Touchable
                              key={index}
                              onPress={() =>
                                navigation.push("UserProfileTabs", {
                                  username: user.username,
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
          {recommendLocationData.recommendLocations &&
            recommendLocationData.recommendLocations.cities.length !== 0 && (
              <Item>
                <Title>RECOMMEND LOCATIONS</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
                  >
                    {recommendLocations.map((locations, index) => {
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
                                    continentCode:
                                      city.country.continent.continentCode
                                  })
                                }
                              >
                                <UserRow city={city} type={"city"} />
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
      </ScrollView>
    );
  }
};
