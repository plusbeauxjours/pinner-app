import React, { useState, useEffect } from "react";
import moment from "moment";
import { RefreshControl, Image, Platform } from "react-native";
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
  SlackReportUsersVariables,
  GetCoffees,
  GetCoffeesVariables,
  GetSameTrips,
  GetSameTripsVariables
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
import constants, { BACKEND_URL } from "../../../../../constants";
import { GET_COFFEES } from "../Coffees/CoffeesQueries";
import { GET_SAME_TRIPS } from "./UserProfileQueries";
import Modal from "react-native-modal";
import CoffeeDetail from "../../CoffeeTab/CoffeeDetail";
import { useTheme } from "../../../../context/ThemeContext";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  color: ${props => props.theme.color};
`;

const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const Bold = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.color};
`;
const Item = styled.View`
  flex-direction: column;
  align-items: center;
  width: ${constants.width / 4};
  height: ${constants.width / 5 - 10};
`;
const DisptanceItem = styled(Item)`
  width: ${constants.width / 2 - 20};
`;
const ItemContainer = styled.View`
  /* padding: 15px 15px 0 15px; */
  flex-wrap: wrap;
  flex-direction: row;
`;
const Header = styled.View`
  height: 250;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.headerColor};
`;
const UserNameContainer = styled.View`
  align-self: flex-start;
  margin-left: 10;
`;
const Touchable = styled.TouchableOpacity``;
const ImageTouchable = styled(Touchable)`
  margin-bottom: 15;
`;
const UserName = styled.Text`
  font-weight: 500;
  font-size: 30;
  color: ${props => props.theme.color};
`;
const ScrollView = styled.ScrollView`
  background-color: ${props => props.theme.bgColor};
`;
const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;
const TextContainer = styled.View`
  flex-wrap: wrap;
  width: ${constants.width - 30};
`;
const EditText = styled.Text`
  color: ${props => props.theme.color};
  font-size: 12px;
  font-weight: 100;
  bottom: 3px;
`;

export default ({ navigation }) => {
  const me = useMe();
  const location = useLocation();
  const isSelf = navigation.getParam("isSelf");
  const isDarkMode = useTheme();
  const [coffeeId, setCoffeeId] = useState<string>("");
  const [cityId, setCityId] = useState<string>(location.currentCityId);
  const [moveNotificationId, setMoveNotificationId] = useState<string>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
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
    data: getSameTripsData,
    loading: getSameTripsLoading,
    refetch: getSameTripsRefetch
  } = useQuery<GetSameTrips, GetSameTripsVariables>(GET_SAME_TRIPS, {
    variables: {
      username: navigation.getParam("username")
    },
    skip: !navigation.getParam("username")
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
      await getSameTripsRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  const onPress = coffeeId => {
    setModalOpen(true);
    setCoffeeId(coffeeId);
  };

  useEffect(
    () => setUsername(navigation.getParam("username") || me.user.username),
    [navigation]
  );
  if (profileLoading || tripLoading || coffeeLoading || getSameTripsLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    const { userProfile: { user = null } = {} } = profileData;
    const { getTrips: { trip = null } = {} } = tripData;
    const { getCoffees: { coffees = null } = {} } = coffeeData;
    return (
      <>
        <Modal
          style={{ margin: 0, alignItems: "flex-start" }}
          isVisible={modalOpen}
          backdropColor={isDarkMode && isDarkMode === true ? "black" : "white"}
          onBackdropPress={() => setModalOpen(false)}
          onBackButtonPress={() => Platform.OS !== "ios" && setModalOpen(false)}
          onModalHide={() => setModalOpen(false)}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
        >
          <CoffeeDetail coffeeId={coffeeId} setModalOpen={setModalOpen} />
        </Modal>
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
              {user.profile.isSelf ? (
                <Touchable
                  onPress={() =>
                    navigation.push("EditProfile", {
                      ...user,
                      profileRefetch
                    })
                  }
                >
                  <EditText>EDIT PROFILE</EditText>
                </Touchable>
              ) : (
                <>
                  {getSameTripsData && (
                    <EditText>
                      You guys have been to
                      {getSameTripsData.getSameTrips.cities.length !== 0 &&
                        getSameTripsData.getSameTrips.cities.map(city => (
                          <EditText key={city.id}>
                            &nbsp;
                            {city.cityName}
                            {city.country.countryEmoji}
                          </EditText>
                        ))}
                      .
                    </EditText>
                  )}
                </>
              )}
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
              {trip && (
                <Item>
                  <UserName>{user.profile.tripCount}</UserName>
                  {user.profile.tripCount === 1 ? (
                    <Text>TRIP</Text>
                  ) : (
                    <Text>TRIPS</Text>
                  )}
                </Item>
              )}
              {/* {user.profile.coffeeCount !== 0 && (
              <>
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
              </>
            )} */}
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
              {user.profile.isSelf &&
                coffees &&
                coffees.length !== 0 &&
                coffees.map(coffee => (
                  <Touchable onPress={() => onPress(coffee.uuid)}>
                    <Item>
                      <UserName>☕️</UserName>
                      <Bold>COFFEE </Bold>
                    </Item>
                  </Touchable>
                ))}
            </ItemContainer>
            {!user.profile.isSelf && user.profile.isHideTrips ? (
              <Bold>Trips are hideen by {user.username}</Bold>
            ) : (
              <>
                {trip.map((i: any, index: any) => (
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
      </>
    );
  }
};
