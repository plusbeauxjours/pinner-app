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
  font-size: 12px;
`;
const Item = styled.View`
  flex-direction: row;
`;
const Header = styled.View`
  flex: 1;
  height: 300;
  background-color: ${theme.lightGreyColor};
`;
const UserNameContainer = styled.View`
  align-items: flex-start;
`;
const UserName = styled.Text`
  font-weight: 500;
  font-size: 34;
  margin-left: 15;
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
          <UserNameContainer>
            <UserName>
              {user.username.length > 24
                ? user.username.substring(0, 24) + "..."
                : user.username}
            </UserName>
          </UserNameContainer>
        </Header>
        <View>
          {user.profile.gender && (
            <Item>
              {(() => {
                switch (user.profile.gender) {
                  case "MALE":
                    return <UserName>M</UserName>;
                  case "FEMALE":
                    return <UserName>F</UserName>;
                  case "OTHER":
                    return <UserName>O</UserName>;
                  default:
                    return null;
                }
              })()}
              <Bold>GENDER</Bold>
            </Item>
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
          <Text>{user.profile.bio}</Text>
          {user.profile.distance !== 0 && (
            <Item>
              <UserName>{user.profile.distance}</UserName>
              <Bold>KM</Bold>
            </Item>
          )}
          {user.profile.isHideCoffees ? (
            <>
              {user.profile.coffeeCount === 1 ? (
                <Item>
                  <UserName>{user.profile.coffeeCount}</UserName>
                  <Bold>COFFEE🔒</Bold>
                </Item>
              ) : (
                <Item>
                  <UserName>{user.profile.coffeeCount}</UserName>
                  <Bold>COFFEES🔒</Bold>
                </Item>
              )}
            </>
          ) : (
            <>
              <Touchable
                onPress={() => navigation.push("Coffees", { username })}
              >
                {user.profile.coffeeCount === 1 ? (
                  <Item>
                    <UserName>{user.profile.coffeeCount}</UserName>
                    <Bold>COFFEE</Bold>
                  </Item>
                ) : (
                  <Item>
                    <UserName>{user.profile.coffeeCount}</UserName>
                    <Bold>COFFEES</Bold>
                  </Item>
                )}
              </Touchable>
            </>
          )}

          {user.profile.isHideCities ? (
            <>
              {user.profile.cityCount === 1 ? (
                <Item>
                  <UserName>{user.profile.cityCount}</UserName>
                  <Bold>CITY🔒</Bold>
                </Item>
              ) : (
                <Item>
                  <UserName>{user.profile.cityCount}</UserName>
                  <Bold>CITIES🔒</Bold>
                </Item>
              )}
            </>
          ) : (
            <>
              <Touchable
                onPress={() => navigation.push("Cities", { username })}
              >
                {user.profile.cityCount === 1 ? (
                  <Item>
                    <UserName>{user.profile.cityCount}</UserName>
                    <Bold>CITY</Bold>
                  </Item>
                ) : (
                  <Item>
                    <UserName>{user.profile.cityCount}</UserName>
                    <Bold>CITIES</Bold>
                  </Item>
                )}
              </Touchable>
            </>
          )}
          {user.profile.isHideCountries ? (
            <>
              {user.profile.countryCount === 1 ? (
                <Item>
                  <UserName>{user.profile.countryCount}</UserName>
                  <Bold>COUNTRY🔒</Bold>
                </Item>
              ) : (
                <Item>
                  <UserName>{user.profile.countryCount}</UserName>
                  <Bold>COUNTRIES🔒</Bold>
                </Item>
              )}
            </>
          ) : (
            <>
              <Touchable
                onPress={() => navigation.push("Countries", { username })}
              >
                {user.profile.countryCount === 1 ? (
                  <Item>
                    <UserName>{user.profile.countryCount}</UserName>
                    <Bold>COUNTRY</Bold>
                  </Item>
                ) : (
                  <Item>
                    <UserName>{user.profile.countryCount}</UserName>
                    <Bold>COUNTRIES</Bold>
                  </Item>
                )}
              </Touchable>
            </>
          )}
          {user.profile.isHideContinents ? (
            <>
              {user.profile.continentCount === 1 ? (
                <Item>
                  <UserName>{user.profile.continentCount}</UserName>
                  <Bold>CONTINENT🔒</Bold>
                </Item>
              ) : (
                <Item>
                  <UserName>{user.profile.continentCount}</UserName>
                  <Bold>CONTINENTS🔒</Bold>
                </Item>
              )}
            </>
          ) : (
            <>
              <Touchable
                onPress={() => navigation.push("Continents", { username })}
              >
                {user.profile.continentCount === 1 ? (
                  <Item>
                    <UserName>{user.profile.continentCount}</UserName>
                    <Bold>CONTINENT</Bold>
                  </Item>
                ) : (
                  <Item>
                    <UserName>{user.profile.continentCount}</UserName>
                    <Bold>CONTINENTS</Bold>
                  </Item>
                )}
              </Touchable>
            </>
          )}
          {user.profile.nationality && (
            <Touchable
              onPress={() =>
                navigation.push("CountryProfileTabs", {
                  countryCode: user.profile.nationality.countryCode,
                  continentCode:
                    user.profile.nationality.continent.continentCode
                })
              }
            >
              <Item>
                <UserName>{user.profile.nationality.countryEmoji}</UserName>
                <Bold>NATIONALITY </Bold>
              </Item>
            </Touchable>
          )}
          {user.profile.residence && (
            <Touchable
              onPress={() =>
                navigation.push("CountryProfileTabs", {
                  countryCode: user.profile.residence.countryCode,
                  continentCode: user.profile.residence.continent.continentCode
                })
              }
            >
              <Item>
                <UserName>{user.profile.residence.countryEmoji}</UserName>
                <Bold>RESIDENCE </Bold>
              </Item>
            </Touchable>
          )}

          {trip && trip.length === 1 ? (
            <Item>
              <UserName>{user.profile.tripCount}</UserName>
              <Bold>TRIP</Bold>
            </Item>
          ) : (
            <Item>
              <UserName>{user.profile.tripCount}</UserName>
              <Bold>TRIPS</Bold>
            </Item>
          )}
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
