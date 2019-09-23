import React, { useState } from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import UserRow from "../../../components/UserRow";
import { useQuery } from "react-apollo-hooks";
import {
  GET_MATCHES,
  RECOMMEND_USERS,
  RECOMMEND_LOCATIONS
} from "./HomeQueries";
// import { useMe } from "../../../context/MeContext";
import { useLocation } from "../../../context/LocationContext";
import { ScrollView, RefreshControl } from "react-native";
import Swiper from "react-native-swiper";
import { GET_COFFEES, REQUEST_COFFEE } from "../../../sharedQueries";
import { useMutation } from "react-apollo";
import { MARK_AS_READ_MATCH } from "./HomeQueries";
import constants from "../../../../constants";
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

const UserContainer = styled.View`
  height: 100%;
  flex: 1;
`;

const Text = styled.Text``;
const Item = styled.View`
  flex: 1;
  height: 100%;
  margin-bottom: 5px;
`;
const Title = styled.Text`
  font-weight: 500;
  font-size: 16px;
  padding-left: 15px;
  margin-bottom: 5px;
`;

export default () => {
  // const me = useMe();
  const location = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [matchId, setMarkAsReadMatch] = useState("");
  const [requestCoffeeVariables, setRequestCoffeeVariables] = useState({
    countryCode: location.currentCountryCode,
    gender: "",
    currentCityId: location.currentCityId,
    target: ""
  });
  const [getCoffeesVariables, setGetCoffeesVariables] = useState({
    cityId: location.currentCountryCode,
    location: "city"
  });
  console.log(getCoffeesVariables);
  const {
    loading: recommendUserLoading,
    data: recommendUserData,
    refetch: recommendUserRefetch
  } = useQuery<RecommendUsers, RecommendUsersVariables>(RECOMMEND_USERS);
  const {
    loading: recommendLocationLoading,
    data: recommendLocationData,
    refetch: recommendLocationRefetch
  } = useQuery<RecommendLocations, RecommendLocationsVariables>(
    RECOMMEND_LOCATIONS
  );
  const [requestCoffeeFn] = useMutation<RequestCoffee, RequestCoffeeVariables>(
    REQUEST_COFFEE,
    { variables: { ...requestCoffeeVariables } }
  );
  const {
    loading: coffeeLoading,
    data: coffeeData,
    refetch: coffeeRefetch
  } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
    variables: { ...getCoffeesVariables }
  });
  const [MarkAsReadMatchFn] = useMutation<
    MarkAsReadMatch,
    MarkAsReadMatchVariables
  >(MARK_AS_READ_MATCH, { variables: { matchId } });
  const {
    loading: matchLoading,
    data: matchData,
    refetch: matchRefetch
  } = useQuery<GetMatches>(GET_MATCHES);

  console.log(location);
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
          <Item>
            <Title>RECOMMEND USERS</Title>
            <Swiper style={{ height: 135 }}>
              <UserContainer>
                {recommendUserData.recommendUsers.users &&
                  recommendUserData.recommendUsers.users.length !== 0 &&
                  recommendUserData.recommendUsers.users.map(user => (
                    <UserRow key={user.id} user={user} type={"user"} />
                  ))}
              </UserContainer>
            </Swiper>
          </Item>
          <Item>
            <Title>RECOMMEND LOCATIONS</Title>
            <Swiper style={{ height: 135 }}>
              <UserContainer>
                {recommendLocationData.recommendLocations.cities &&
                  recommendLocationData.recommendLocations.cities.length !==
                    0 &&
                  recommendLocationData.recommendLocations.cities.map(city => (
                    <UserRow key={city.id} city={city} type={"city"} />
                  ))}
              </UserContainer>
            </Swiper>
          </Item>
          <Item>
            <Title>NEED SOME COFFEE NOW</Title>
            <Swiper style={{ height: 135 }}>
              <UserContainer>
                {console.log(coffeeData)}
                {console.log(coffeeData.getCoffees.coffees)}
                {coffeeData.getCoffees.coffees &&
                  coffeeData.getCoffees.coffees.length !== 0 &&
                  coffeeData.getCoffees.coffees.map(coffee => (
                    <UserRow key={coffee.id} coffee={coffee} type={"coffee"} />
                  ))}
              </UserContainer>
            </Swiper>
          </Item>
        </Container>
      )}
    </ScrollView>
  );
};
