import React, { useState, useEffect } from "react";
import moment from "moment";
import { RefreshControl, ScrollView } from "react-native";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import {
  UserProfile,
  UserProfileVariables,
  GetTrips,
  GetTripsVariables,
  EditTrip,
  AddTrip,
  AddTripVariables,
  EditTripVariables,
  DeleteTrip,
  DeleteTripVariables,
  CalculateDistance,
  SlackReportUsers,
  SlackReportUsersVariables
} from "../../../../types/api";
import {
  GET_USER,
  GET_TRIPS,
  ADD_TRIP,
  EDIT_TRIP,
  DELETE_TRIP,
  CALCULATE_DISTANCE,
  SLACK_REPORT_USERS
} from "./UserProfileQueries";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
`;
const Item = styled.View``;

const Touchable = styled.TouchableOpacity``;

export default ({ navigation }) => {
  const me = useMe();
  const location = useLocation();
  const isSelf = navigation.getParam("isSelf");
  const [cityId, setCityId] = useState<string>(location.currentCityId);
  const [moveNotificationId, setMoveNotificationId] = useState<string>();
  const [username, setUsername] = useState<string>(
    navigation.getParam("username") || me.user.username
  );
  const [payload, setPayload] = useState<string>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [date, setDate] = useState<{
    startDate: moment.Moment;
    endDate: moment.Moment;
  }>({
    startDate: null,
    endDate: null
  });
  const [tripDate, setTripDate] = useState<{
    tripStartDate: moment.Moment;
    tripEndDate: moment.Moment;
  }>({
    tripStartDate: null,
    tripEndDate: null
  });

  const {
    data: profileData,
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<UserProfile, UserProfileVariables>(GET_USER, {
    variables: { username: navigation.getParam("username") || me.user.username }
  });
  const {
    data: tripData,
    loading: tripLoading,
    refetch: tripRefetch
  } = useQuery<GetTrips, GetTripsVariables>(GET_TRIPS, {
    variables: { username: navigation.getParam("username") || me.user.username }
  });
  const [addTripFn] = useMutation<AddTrip, AddTripVariables>(ADD_TRIP, {
    variables: {
      cityId,
      startDate: date.startDate,
      endDate: date.endDate
    }
  });
  console.log("navigation from userprofile", navigation);
  const [editTripFn] = useMutation<EditTrip, EditTripVariables>(EDIT_TRIP, {
    variables: {
      moveNotificationId: parseInt(moveNotificationId, 10),
      cityId,
      startDate: date.startDate,
      endDate: date.endDate
    }
  });
  const [deleteTripFn] = useMutation<DeleteTrip, DeleteTripVariables>(
    DELETE_TRIP,
    {
      variables: {
        moveNotificationId: parseInt(moveNotificationId, 10)
      }
    }
  );
  const [calculateDistanceFn] = useMutation<CalculateDistance>(
    CALCULATE_DISTANCE
  );
  const [slackReportUsersFn] = useMutation<
    SlackReportUsers,
    SlackReportUsersVariables
  >(SLACK_REPORT_USERS, {
    variables: { targetUsername: username, payload }
  });

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await profileRefetch();
      await tripRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    console.log("navigation", navigation.getParam("username"));
    console.log("state", username);
    console.log("location", me.user.username);
    setUsername(navigation.getParam("username") || me.user.username);
  }, [navigation.state.params]);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {profileLoading || tripLoading ? (
        <Loader />
      ) : (
        <View>
          <Bold>UserProfile</Bold>
          {profileData.userProfile.user && (
            <>
              <Text>username:{profileData.userProfile.user.username}</Text>
              <Text>bio:{profileData.userProfile.user.profile.bio}</Text>
              <Text>gender:{profileData.userProfile.user.profile.gender}</Text>
              <Text>
                distance:{profileData.userProfile.user.profile.distance}
              </Text>
              <Text>
                postCount:{profileData.userProfile.user.profile.postCount}
              </Text>
              <Text>
                tripCount:{profileData.userProfile.user.profile.tripCount}
              </Text>
              <Text>
                coffeeCount:{profileData.userProfile.user.profile.coffeeCount}
              </Text>
              <Text>
                cityCount:{profileData.userProfile.user.profile.cityCount}
              </Text>
              <Text>
                countryCount:{profileData.userProfile.user.profile.countryCount}
              </Text>
              <Text>
                continentCount:
                {profileData.userProfile.user.profile.continentCount}
              </Text>
              <Text>isSelf:{profileData.userProfile.user.profile.isSelf}</Text>
            </>
          )}
          {isSelf && (
            <Item>
              <Touchable
                onPress={() =>
                  navigation.navigate("EditProfile", {
                    ...profileData.userProfile.user,
                    profileRefetch
                  })
                }
              >
                <Bold>EditProfile</Bold>
              </Touchable>
            </Item>
          )}
          <Touchable
            onPress={() => navigation.navigate("Cities", { username })}
          >
            <Item>
              <Bold>Cities</Bold>
            </Item>
          </Touchable>
          <Touchable
            onPress={() => navigation.navigate("Countries", { username })}
          >
            <Item>
              <Bold>Countries</Bold>
            </Item>
          </Touchable>
          <Touchable
            onPress={() => navigation.navigate("Continents", { username })}
          >
            <Item>
              <Bold>Continents</Bold>
            </Item>
          </Touchable>
          <Touchable
            onPress={() => navigation.navigate("Coffees", { username })}
          >
            <Item>
              <Bold>Coffees</Bold>
            </Item>
          </Touchable>
          {tripData.getTrips && tripData.getTrips.trip.length === 1 ? (
            <Bold>Trip</Bold>
          ) : (
            <Bold>Trips</Bold>
          )}
          {tripData.getTrips &&
            tripData.getTrips.trip.map((i, index) => (
              <Touchable
                key={index}
                onPress={() =>
                  navigation.navigate("CityProfileTabs", {
                    cityId: i.city.cityId,
                    countryCode: i.city.country.countryCode,
                    continentCode: i.city.country.continent.continentCode
                  })
                }
              >
                <UserRow trip={i} type={"trip"} />
              </Touchable>
            ))}
        </View>
      )}
    </ScrollView>
  );
};
