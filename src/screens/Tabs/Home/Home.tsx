import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import UserRow from "../../../components/UserRow";
import { useQuery } from "react-apollo-hooks";
import {
  GET_MATCHES,
  RECOMMEND_USERS,
  RECOMMEND_LOCATIONS
} from "./HomeQueries";
import { useMe } from "../../../context/MeContext";
import { useLocation } from "../../../context/LocationContext";
import { ScrollView, RefreshControl } from "react-native";
import Swiper from "react-native-swiper";
import { GET_COFFEES, REQUEST_COFFEE } from "../../../sharedQueries";
import { useMutation } from "react-apollo";
import { MARK_AS_READ_MATCH } from "./HomeQueries";
import {
  GetMatches,
  GetCoffees,
  GetCoffeesVariables,
  RequestCoffee,
  MarkAsReadMatch,
  RecommendUsers,
  RecommendUsersVariables,
  RecommendLocations,
  RecommendLocationsVariables,
  RequestCoffeeVariables,
  MarkAsReadMatchVariables
} from "../../../types/api";

const Container = styled.View``;

const UserContainer = styled.View``;

const UserColumn = styled.View``;

const Item = styled.View`
  flex: 1;
`;
const Title = styled.Text`
  font-weight: 500;
  font-size: 18px;
  padding-left: 15px;
  margin-bottom: 5px;
`;

export default () => {
  const me = useMe();
  const location = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [cityId, setCityId] = useState("");
  const [matchId, setMarkAsReadMatch] = useState("");
  const [requestCoffeeVariables, setRequestCoffeeVariables] = useState({
    countryCode: location.currentCountryCode,
    gender: "",
    currentCityId: location.currentCityId,
    target: ""
  });
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
  const [requestCoffeeFn] = useMutation<RequestCoffee, RequestCoffeeVariables>(
    REQUEST_COFFEE,
    { variables: { ...requestCoffeeVariables } }
  );
  const {
    data: coffeeData,
    loading: coffeeLoading,
    refetch: coffeeRefetch
  } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
    variables: { location: "city", cityId: "ChIJuQhD6D7sfDURB6J0Dx5TGW8" }
  });
  const [MarkAsReadMatchFn] = useMutation<
    MarkAsReadMatch,
    MarkAsReadMatchVariables
  >(MARK_AS_READ_MATCH, { variables: { matchId } });
  const {
    data: matchData,
    loading: matchLoading,
    refetch: matchRefetch
  } = useQuery<GetMatches>(GET_MATCHES);
  console.log(me);
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
      {recommendUserLoading ||
      recommendLocationLoading ||
      coffeeLoading ||
      matchLoading ? (
        <Loader />
      ) : (
        <Container>
          {recommendUserData.recommendUsers.users &&
            recommendUserData.recommendUsers.users.length !== 0 && (
              <Item>
                <Title>RECOMMEND USERS</Title>
                <UserContainer>
                  <Swiper style={{ height: 180 }}>
                    {recommendUserData.recommendUsers.users.map(
                      (user, index) => {
                        return (
                          <UserColumn key={index}>
                            <UserRow user={user} type={"user"} />
                            <UserRow user={user} type={"user"} />
                            <UserRow user={user} type={"user"} />
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
                  <Swiper style={{ height: 180 }}>
                    {recommendLocationData.recommendLocations.cities.map(
                      (city, index) => (
                        <UserColumn key={index}>
                          <UserRow city={city} type={"city"} />
                          <UserRow city={city} type={"city"} />
                          <UserRow city={city} type={"city"} />
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
                  <Swiper style={{ height: 180 }}>
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

          {matchData.getMatches.matches &&
            matchData.getMatches.matches.length !== 0 && (
              <Item>
                <Title>MATCHES</Title>
                <UserContainer>
                  <Swiper style={{ height: 180 }}>
                    {matchData.getMatches.matches.map(match => (
                      <UserRow key={match.id} match={match} type={"match"} />
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
