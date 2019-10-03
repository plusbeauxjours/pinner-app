import React, { useState } from "react";
import moment from "moment";
import { RefreshControl, ScrollView, Image } from "react-native";
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
import { theme } from "../../../../styles/theme";

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
const Header = styled.View`
  flex: 1;
  height: 300;
  background-color: ${theme.lightGreyColor};
`;

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
  if (profileLoading || tripLoading) {
    return <Loader />;
  } else {
    const { userProfile: { user = null } = {} } = profileData;
    const { getTrips: { trip = null } = {} } = tripData;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header>
          <Image
            style={{
              height: 150,
              width: 150,
              borderRadius: 75,
              zIndex: 3
            }}
            source={
              user.profile.avatarUrl && {
                uri: user.profile.avatarUrl
              }
            }
          />
        </Header>
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
              <Text>
                continentCount:
                {user.profile.continentCount}
              </Text>
              <Text>isSelf:{user.profile.isSelf}</Text>
            </>
          )}
          {user.profile.isSelf && (
            <Item>
              <Touchable
                onPress={() =>
                  navigation.push("EditProfile", {
                    ...user,
                    profileRefetch
                  })
                }
              >
                <Bold>EditProfile</Bold>
              </Touchable>
            </Item>
          )}
          <Touchable onPress={() => navigation.push("Cities", { username })}>
            <Item>
              <Bold>Cities</Bold>
            </Item>
          </Touchable>
          <Touchable onPress={() => navigation.push("Countries", { username })}>
            <Item>
              <Bold>Countries</Bold>
            </Item>
          </Touchable>
          <Touchable
            onPress={() => navigation.push("Continents", { username })}
          >
            <Item>
              <Bold>Continents</Bold>
            </Item>
          </Touchable>
          <Touchable onPress={() => navigation.push("Coffees", { username })}>
            <Item>
              <Bold>Coffees</Bold>
            </Item>
          </Touchable>
          {trip && trip.length === 1 ? <Bold>Trip</Bold> : <Bold>Trips</Bold>}
          {trip.map((i, index) => (
            <Touchable
              key={index}
              onPress={() =>
                navigation.push("CityProfileTabs", {
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
      </ScrollView>
    );
  }
};
