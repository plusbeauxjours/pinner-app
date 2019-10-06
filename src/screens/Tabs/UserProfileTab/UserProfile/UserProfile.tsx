import React, { useState, useEffect } from "react";
import moment from "moment";
import { RefreshControl, ScrollView, Image, FlatList } from "react-native";
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
import constants, { BACKEND_URL } from "../../../../../constants";
import { GET_COFFEES } from "../Coffees/CoffeesQueries";
import { GetCoffees, GetCoffeesVariables } from "../../../../types/api";

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
  flex-direction: column;
  align-items: center;
  width: ${constants.width / 4 - 10};
  height: ${constants.width / 5 - 10};
`;
const DisptanceItem = styled(Item)`
  width: ${constants.width / 2 - 20};
`;
const ItemContainer = styled.View`
  padding: 15px 15px 0 15px;
  flex-wrap: wrap;
  flex-direction: row;
`;
const Header = styled.View`
  height: 250;
  justify-content: center;
  align-items: center;
  background-color: ${theme.lightGreyColor};
`;
const UserNameContainer = styled.View`
  position: absolute;
  bottom: 5;
  align-self: flex-start;
  margin-left: 10;
`;
const Touchable = styled.TouchableOpacity``;
const ImageTouchable = styled(Touchable)`
  margin-bottom: 30;
`;
const UserName = styled.Text`
  font-weight: 500;
  font-size: 34;
`;

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
  const {
    data: coffeeData,
    loading: coffeeLoading,
    refetch: coffeeRefetch
  } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
    variables: {
      userName: navigation.getParam("username") || me.user.username,
      location: "profile"
    }
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
      await coffeeRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(
    () => setUsername(navigation.getParam("username") || me.user.username),
    [navigation]
  );
  if (profileLoading || tripLoading || coffeeLoading) {
    return <Loader />;
  } else {
    const { userProfile: { user = null } = {} } = profileData;
    const { getTrips: { trip = null } = {} } = tripData;
    const { getCoffees: { coffees = null } = {} } = coffeeData;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header>
          <ImageTouchable
            onPress={() =>
              navigation.push("AvatarList", {
                username: user.username,
                isSelf: user.profile.isSelf
              })
            }
          >
            <Image
              resizeMode={"contain"}
              style={{
                height: 150,
                width: 150,
                borderRadius: 75
              }}
              source={
                user.profile.avatarUrl
                  ? { uri: `${BACKEND_URL}/media/${user.profile.avatarUrl}` }
                  : require(`../../../../Images/avatars/earth1.png`)
              }
            />
          </ImageTouchable>
          <UserNameContainer>
            <UserName>
              {user.username.length > 24
                ? user.username.substring(0, 24) + "..."
                : user.username}
            </UserName>
            {/* {user.profile.isSelf && (
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
            )} */}
          </UserNameContainer>
        </Header>
        <View>
          <Text>{user.profile.bio}</Text>
          <ItemContainer>
            {user.profile.distance !== 0 && (
              <DisptanceItem>
                <UserName>{user.profile.distance}</UserName>
                <Bold>KM</Bold>
              </DisptanceItem>
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
                    continentCode:
                      user.profile.residence.continent.continentCode
                  })
                }
              >
                <Item>
                  <UserName>{user.profile.residence.countryEmoji}</UserName>
                  <Bold>RESIDENCE </Bold>
                </Item>
              </Touchable>
            )}
            {user.profile.isSelf && coffees && coffees.length !== 0 && (
              <Touchable
                onPress={() =>
                  navigation.push("CoffeeDetail", {
                    ////
                    ////
                    ////
                    ////
                    //// COFFEEDETAIL
                    ////
                    ////
                    ////
                    ////
                  })
                }
              >
                <Item>
                  <UserName>☕️</UserName>
                  <Bold>COFFEE </Bold>
                </Item>
              </Touchable>
            )}
          </ItemContainer>
          {!user.profile.isSelf && user.profile.isHideTrips ? (
            <Bold>Trips are hideen by {user.username}</Bold>
          ) : (
            <>
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
            </>
          )}
        </View>
      </ScrollView>
    );
  }
};
