import React, { useState } from "react";
import moment from "moment";
import { RefreshControl, ScrollView } from "react-native";
import { useQuery } from "react-apollo-hooks";
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
  SLACK_REPORT_USERS,
  EDIT_TRIP,
  DELETE_TRIP,
  CALCULATE_DISTANCE
} from "./UserProfileQueries";
import Loader from "../../../../components/Loader";
import { useMutation } from "react-apollo";
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

export default () => {
  const me = useMe();
  const location = useLocation();
  const [cityId, setCityId] = useState<string>(location.currentCityId);
  const [moveNotificationId, setMoveNotificationId] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [payload, setPayload] = useState<string>();
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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {
    data: profileData,
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<UserProfile, UserProfileVariables>(GET_USER, {
    variables: { username: "devilishPlusbeauxjours" }
  });
  const {
    data: tripData,
    loading: tripLoading,
    refetch: tripRefetch
  } = useQuery<GetTrips, GetTripsVariables>(GET_TRIPS, {
    variables: { username: "devilishPlusbeauxjours" }
  });
  const [addTripFn] = useMutation<AddTrip, AddTripVariables>(ADD_TRIP, {
    variables: {
      cityId,
      startDate: date.startDate,
      endDate: date.endDate
    }
  });
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
  const {
    userProfile: { user }
  } = profileData;
  const {
    getTrips: { trip }
  } = tripData;
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
          {user && (
            <>
              <Text>username:{user.username}</Text>
              <Text>bio:{user.profile.bio}</Text>
              <Text>gender:{user.profile.gender}</Text>
              <Text>distance:{user.profile.distance}</Text>
              <Text>postCount:{user.profile.postCount}</Text>
              <Text>tripCount:{user.profile.tripCount}</Text>
              <Text>coffeeCount:{user.profile.coffeeCount}</Text>
              <Text>cityCount:{user.profile.cityCount}</Text>
              <Text>countryCount:{user.profile.countryCount}</Text>
              <Text>continentCount:{user.profile.continentCount}</Text>
              <Text>isSelf:{user.profile.isSelf}</Text>
            </>
          )}
          <Bold>EditProfile</Bold>
          <Bold>ToggleSettings</Bold>
          <Bold>Cities</Bold>
          <Bold>Countries</Bold>
          <Bold>Continents</Bold>
          <Bold>Coffees</Bold>
          {trip.length === 1 ? <Bold>Trip</Bold> : <Bold>Trips</Bold>}
          {trip &&
            trip.map((i, index) => (
              <UserRow key={index} trip={i} type={"trip"} />
            ))}
        </View>
      )}
    </ScrollView>
  );
};
