import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  RefreshControl,
  Platform,
  Image,
  KeyboardAvoidingView
} from "react-native";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { SwipeListView } from "react-native-swipe-list-view";
import Toast from "react-native-root-toast";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
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
  GetSameTripsVariables,
  CreateCity,
  CreateCityVariables
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
import { CalendarList } from "react-native-calendars";
import { Alert } from "react-native";
import { CREATE_CITY } from "../../../../components/Search/SearchQueries";
import { TextInput } from "react-native-gesture-handler";
import useGoogleAutocomplete from "../../../../hooks/useGoogleAutocomplete";
import keys from "../../../../../keys";
import SearchCityPhoto from "../../../../components/SearchCityPhoto";

const Header = styled.View`
  height: 250;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.headerColor};
`;
const Body = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  color: ${props => props.theme.color};
  padding: 15px;
`;

const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const BioText = styled(Text)`
  margin-bottom: 15px;
`;
const Bold = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.color};
`;
const Item = styled.View`
  flex-direction: column;
  align-items: center;
  width: ${constants.width / 4 - 7.5};
  height: ${constants.width / 5 - 10};
`;
const DisptanceItem = styled(Item)`
  width: ${constants.width / 2 - 15};
`;
const ItemContainer = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 10px;
`;

const UserNameContainer = styled.View`
  align-self: flex-start;
  flex-direction: row;
  margin-left: 10;
`;
const Touchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;
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

`;
const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
`;
const TouchableRow = styled.TouchableOpacity`
  background-color: ${props => props.theme.bgColor};
`;
const TouchableBackRow = styled.View`
  background-color: ${props => props.theme.bgColor};
`;
const SmallText = styled.Text`
  color: ${props => props.theme.color};
  font-size: 9px;
`;
const RowBack = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  margin-left: 5px;
  max-width: 85px;
  width: 100%;
  justify-content: space-between;
`;
const BackLeftBtn = styled.TouchableOpacity`
  justify-content: center;
`;
const AddTripBtn = styled.TouchableOpacity`
  justify-content: center;
  padding: 5px;
`;
const AddTripContainer = styled.View`
  width: ${constants.width - 40};
  height: 40px;
  justify-content: center;
  align-items: center;
  border: 0.5px solid ${props => props.theme.borderColor};
  border-radius: 5px;
`;
const CalendarContainer = styled.View`
  height: ${constants.height - 125};
`;
const CalendarCityContainer = styled.View`
flex-direction: row;
justify-content: center;
  margin-top: 45px;
  height: 45px;
`;
const TripSubmitBtn = styled.TouchableOpacity``;
const TripSubmitContainer = styled.View`
  height: 60px;
  justify-content: center;
  align-items: center;
`;
const TripBtnContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${constants.width};
  height: 60;
`;
const TripText = styled.Text`
  font-size: 16;
  font-weight: 400;
  color: ${props => props.theme.color};
`;
const SearchCityContainer = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  width: ${constants.width};
`;
const SearchHeader = styled.View`
  flex: 2;
  flex-direction: row;
  align-items: center;
`;
const SearchHeaderUserContainer = styled.View`
  margin-left: 10px;
`;
const Location = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.color};
`;
const TripSmallText = styled(SmallText)`
  margin-left: 15px;
`;
export default ({ navigation }) => {
  const me = useMe();
  const location = useLocation();
  const isSelf = navigation.getParam("isSelf");
  const isDarkMode = useTheme();
  const [search, setSearch] = useState<string>("");
  const [coffeeId, setCoffeeId] = useState<string>("");
  const [cityId, setCityId] = useState<string>(location.currentCityId);
  const [moveNotificationId, setMoveNotificationId] = useState<string>();
  const [coffeeModalOpen, setCoffeeModalOpen] = useState<boolean>(false);
  const [tripModalOpen, setTripModalOpen] = useState<boolean>(false);
  const [isCalendarMode, setIsCalendarMode] = useState<boolean>(false);
  const [searchCityId, setSearchCityId] = useState<string>("");
  const [searchCityName, setSearchCityName] = useState<string>("");
  const [searchCountryCode, setSearchCountryCode] = useState<string>("");
  const [searchCountryName, setSearchCountryName] = useState<string>("");
  const [searchContinentCode, setSearchContinentCode] = useState<string>("");
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
  const { showActionSheetWithOptions } = useActionSheet();
  const options = ["Yes", "No"];
  const destructiveButtonIndex = 0;
  const cancelButtonIndex = 1;
  const deleteTrip = id => {
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          deleteTripFn({
            variables: {
              moveNotificationId: parseInt(id, 10)
            }
          });
          toast("Trip Deleted");
        }
      }
    );
  };
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const {
    data: profileData,
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<UserProfile, UserProfileVariables>(GET_USER, {
    variables: { username },
    fetchPolicy: "network-only"
  });
  const {
    data: getSameTripsData,
    loading: getSameTripsLoading,
    refetch: getSameTripsRefetch
  } = useQuery<GetSameTrips, GetSameTripsVariables>(GET_SAME_TRIPS, {
    variables: {
      username
    },
    skip: !navigation.getParam("username")
  });
  const {
    data: tripData,
    loading: tripLoading,
    refetch: tripRefetch
  } = useQuery<GetTrips, GetTripsVariables>(GET_TRIPS, {
    variables: { username }
  });
  const {
    data: coffeeData,
    loading: coffeeLoading,
    refetch: coffeeRefetch
  } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
    variables: {
      userName: username,
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
    DELETE_TRIP
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
  const [createCityFn, { loading: createCityLoading }] = useMutation<
    CreateCity,
    CreateCityVariables
  >(CREATE_CITY);
  const onSearchPress = async (cityId,cityName, countryName) => {
    let result;
    try {
      result = await createCityFn({
        variables: { cityId }
      });
      setSearch("");
      setIsCalendarMode(true);
      setSearchCityId(result.data.createCity.cityId);
      setSearchCountryCode(result.data.createCity.countryCode);
      setSearchContinentCode(result.data.createCity.continentCode);
      setSearchCityName(cityName)
      setSearchCountryName(countryName)
    } catch (e) {
      setSearch("");
      console.log(e);
    }
  };
  const onChange = (text: string) => {
    setSearch(text);
  };
  const { results, isLoading } = useGoogleAutocomplete({
    apiKey: `${keys.REACT_APP_GOOGLE_PLACE_KEY}`,
    query: search,
    options: {
      types: "(cities)",
      language: "en"
    }
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
    setCoffeeModalOpen(true);
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
          isVisible={tripModalOpen}
          backdropColor={isDarkMode && isDarkMode === true ? "black" : "white"}
          onBackdropPress={() => {
            setTripModalOpen(false), setSearch(""), setIsCalendarMode(false);
          }}
          onBackButtonPress={() => {
            Platform.OS !== "ios" && setTripModalOpen(false),
              setSearch(""),
              setIsCalendarMode(false);
          }}
          onModalHide={() => {
            setTripModalOpen(false), setSearch(""), setIsCalendarMode(false);
          }}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          {isCalendarMode ? (
            <>
                <Touchable
                  onPress={() =>
                   { navigation.push("CityProfileTabs", {
                      cityId: searchCityId,
                      countryCode: searchCountryCode,
                      continentCode: searchContinentCode
                    }), setTripModalOpen(false), setSearch(""), setIsCalendarMode(false)}
                  }
                >
              <CalendarCityContainer>
                  <SearchCityContainer>
                    <SearchHeader>
                      <SearchCityPhoto cityId={searchCityId} />
                      <SearchHeaderUserContainer>
                        <Bold>{searchCityName}</Bold>
                        <Location>
                          {searchCountryName
                            ? searchCountryName
                            : searchCityName}
                        </Location>
                      </SearchHeaderUserContainer>
                    </SearchHeader>
                  </SearchCityContainer>
              </CalendarCityContainer>
                </Touchable>
              <CalendarContainer>
                <CalendarList
                  current={"2018-05-16"}
                  pastScrollRange={24}
                  futureScrollRange={24}
                  pagingEnabled={true}
                  onDayPress={day =>
                    Alert.alert("you've pressed " + day.dateString)
                  }
                  theme={{
                    backgroundColor: "transparent",
                    calendarBackground: "transparent",
                    dayTextColor: "#999",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: "#999",
                    monthTextColor: "#00adf5",
                    textMonthFontWeight: "bold",
                    selectedDayBackgroundColor: "#00adf5"
                  }}
                />
              </CalendarContainer>
              <TripBtnContainer>
                <TripSubmitBtn
                  onPress={() => {
                    setIsCalendarMode(false);
                  }}
                >
                  <TripSubmitContainer>
                    <TripText>CANCEL</TripText>
                  </TripSubmitContainer>
                </TripSubmitBtn>
                {tripDate.tripStartDate && tripDate.tripEndDate && (
                  <TripSubmitBtn>
                    <TripSubmitContainer>
                      <TripText>POST</TripText>
                    </TripSubmitContainer>
                  </TripSubmitBtn>
                )}
              </TripBtnContainer>
            </>
          ) : (
            <>
              <TextInput
                style={{
                  alignSelf: "center",
                  width: constants.width - 30,
                  top: 200,
                  backgroundColor: "transparent",
                  textAlign: "center",
                  fontSize: 30,
                  position: "absolute",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: isDarkMode && isDarkMode === true ? "white" : "black"
                }}
                autoFocus={true}
                value={navigation.value}
                placeholder={"Search"}
                placeholderTextColor={"#999"}
                returnKeyType="search"
                onChangeText={onChange}
                autoCorrect={false}
              />
              <Touchable
                onPress={() => {
                  setTripModalOpen(false);
                }}
              >
                <ScrollView
                  style={{
                    marginTop: 237,
                    marginBottom: 25,
                    backgroundColor: "transparent"
                  }}
                >
                  {createCityLoading || isLoading ? (
                    <Loader />
                  ) : (
                    <KeyboardAvoidingView enabled behavior="padding">
                      {search !== "" &&
                        results.predictions &&
                        results.predictions.length !== 0 && (
                          <>
                            {results.predictions.length === 1 ? (
                              <TripSmallText>CITY</TripSmallText>
                            ) : (
                              <TripSmallText>CITIES</TripSmallText>
                            )}
                            {results.predictions.map(prediction => (
                              <Touchable
                                key={prediction.id}
                                onPress={() =>
                                  onSearchPress(
                                    prediction.place_id, 
                                    prediction.structured_formatting.main_text, 
                                    prediction.structured_formatting.secondary_text
                                    )}
                              >
                                <SearchCityContainer>
                                  <SearchHeader>
                                    <SearchCityPhoto
                                      cityId={prediction.place_id}
                                    />
                                    <SearchHeaderUserContainer>
                                      <Bold>
                                        {
                                          prediction.structured_formatting
                                            .main_text
                                        }
                                      </Bold>
                                      <Location>
                                        {prediction.structured_formatting
                                          .secondary_text
                                          ? prediction.structured_formatting
                                              .secondary_text
                                          : prediction.structured_formatting
                                              .main_text}
                                      </Location>
                                    </SearchHeaderUserContainer>
                                  </SearchHeader>
                                </SearchCityContainer>
                              </Touchable>
                            ))}
                          </>
                        )}
                    </KeyboardAvoidingView>
                  )}
                </ScrollView>
              </Touchable>
            </>
          )}
        </Modal>
        <Modal
          style={{ margin: 0, alignItems: "flex-start" }}
          isVisible={coffeeModalOpen}
          backdropColor={isDarkMode && isDarkMode === true ? "black" : "white"}
          onBackdropPress={() => setCoffeeModalOpen(false)}
          onBackButtonPress={() =>
            Platform.OS !== "ios" && setCoffeeModalOpen(false)
          }
          onModalHide={() => setCoffeeModalOpen(false)}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          <CoffeeDetail coffeeId={coffeeId} setModalOpen={setCoffeeModalOpen} />
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
              {user.profile.isSelf && (
                <Touchable
                  onPress={() =>
                    navigation.push("EditProfile", {
                      ...user,
                      profileRefetch
                    })
                  }
                >
                  <Ionicons
                    name={
                      Platform.OS === "ios" ? "ios-settings" : "md-settings"
                    }
                    color={"#999"}
                    size={30}
                  />
                </Touchable>
              )}
              </UserNameContainer>
                <UserNameContainer>
                  {getSameTripsData &&
                    getSameTripsData.getSameTrips.cities.length !== 0 && (
                      <EditText>
                        You guys have been to
                        {getSameTripsData.getSameTrips.cities.map(city => (
                          <EditText key={city.id}>
                            &nbsp;
                            {city.cityName}
                            {city.country.countryEmoji}
                          </EditText>
                        ))}
                        .
                      </EditText>
                    )}
                </UserNameContainer>
          </Header>
          <Body>
            <BioText>{user.profile.bio}</BioText>
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
            {user.profile.isSelf &&
            <AddTripBtn onPress={() => setTripModalOpen(true)}>
              <AddTripContainer>
                <Bold>ADD TRIP</Bold>
              </AddTripContainer>
            </AddTripBtn>}
            {(() => {
              switch (user.profile.isSelf) {
                case false:
                  return user.profile.isHideTrips ? (
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
                              continentCode:
                                i.city.country.continent.continentCode
                            })
                          }
                        >
                          <UserRow trip={i} type={"trip"} />
                        </Touchable>
                      ))}
                    </>
                  );
                default:
                  return (
                    <SwipeListView
                      useFlatList={false}
                      closeOnRowBeginSwipe={true}
                      data={trip}
                      previewOpenValue={1000}
                      renderItem={data => (
                        <TouchableBackRow key={data.item.id}>
                          <TouchableRow
                            onPress={() =>
                              navigation.push("CityProfileTabs", {
                                cityId: data.item.city.cityId,
                                countryCode: data.item.city.country.countryCode,
                                continentCode:
                                  data.item.city.country.continent.continentCode
                              })
                            }
                          >
                            <UserRow trip={data.item} type={"trip"} />
                          </TouchableRow>
                        </TouchableBackRow>
                      )}
                      renderHiddenItem={data => (
                        <RowBack>
                          <BackLeftBtn
                            onPress={() => console.log(data.item.id)}
                          >
                            <IconContainer>
                              <SmallText>EDIT</SmallText>
                            </IconContainer>
                          </BackLeftBtn>
                          <BackLeftBtn onPress={() => deleteTrip(data.item.id)}>
                            <IconContainer>
                              <SmallText>DELETE</SmallText>
                            </IconContainer>
                          </BackLeftBtn>
                        </RowBack>
                      )}
                      leftOpenValue={90}
                      keyExtractor={item => item.id}
                    />
                  );
              }
            })()}
          </Body>
        </ScrollView>
      </>
    );
  }
};
