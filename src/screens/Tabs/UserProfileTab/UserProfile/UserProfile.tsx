import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  RefreshControl,
  Platform,
  Image,
  KeyboardAvoidingView,
  Modal as AvatarModal
} from "react-native";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { SwipeListView } from "react-native-swipe-list-view";
import Toast from "react-native-root-toast";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import { Ionicons } from "@expo/vector-icons";
import { range } from "lodash";
import { useMe } from "../../../../context/MeContext";
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
import { GET_SAME_TRIPS } from "./UserProfileQueries";
import Modal from "react-native-modal";
import { useTheme } from "../../../../context/ThemeContext";
import { CalendarList } from "react-native-calendars";
import { CREATE_CITY } from "../../../../components/Search/SearchQueries";
import { TextInput } from "react-native-gesture-handler";
import useGoogleAutocomplete from "../../../../hooks/useGoogleAutocomplete";
import keys from "../../../../../keys";
import SearchCityPhoto from "../../../../components/SearchCityPhoto";
import { countries } from "../../../../../countryData";
import CoffeeDetail from "../../../CoffeeDetail/index";
import { GET_COFFEES } from "../../../../sharedQueries";
import ImageViewer from "react-native-image-zoom-viewer";

const Header = styled.View`
  height: 270;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.headerColor};
  padding: 10px;
`;
const Body = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.bgColor};
  color: ${props => props.theme.color};
  padding: 5px;
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
  width: ${constants.width / 4 - 2.5};
  height: ${constants.width / 5 - 10};
`;
const ItemContainer = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 10px;
`;
const UserNameContainer = styled.View`
  flex-direction: row;
  align-self: flex-start;
  justify-content: center;
`;
const Touchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;
const IconTouchable = styled(Touchable)`
  margin-left: 5px;
  margin-top: 5px;
`;
const ImageTouchable = styled(Touchable)`
  margin-bottom: 15px;
  margin-top: 25px;
`;
const UserName = styled.Text`
  font-weight: 500;
  font-size: 30px;
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
  border: 0.5px solid #999;
  border-radius: 5px;
  padding: 2px;
`;
const TouchableRow = styled.TouchableOpacity`
  background-color: ${props => props.theme.bgColor};
`;
const TouchableBackRow = styled.View`
  background-color: ${props => props.theme.bgColor};
`;
const SmallText = styled.Text`
  color: #999;
  text-align: center;
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
  padding: 0 5px 5px 5px;
`;
const AddTripContainer = styled.View`
  width: ${constants.width - 40};
  height: 40px;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
`;
const CalendarContainer = styled.View`
  height: ${constants.height - 120};
`;
const TripSubmitBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 40px;
  margin: 5px;
  border: 0.5px solid #999;
  border-radius: 5px;
`;
const TripBtnContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${constants.width};
  padding: 0 10px 0 10px;
`;
const CityBold = styled.Text`
  font-weight: 500;
  color: ${props => props.theme.color};
`;
const TripText = styled.Text`
  font-size: 16;
  font-weight: 500;
  color: ${props => props.theme.color};
`;
const SearchCityContainer = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 45px;
  width: ${constants.width};
`;
const CalendarCityContainer = styled(SearchCityContainer)`
  justify-content: center;
  padding: 0;
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
  text-align: auto;
`;
const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  background-color: ${props => props.theme.bgColor};
`;
export default ({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const isSelf = navigation.getParam("isSelf")
    ? navigation.getParam("isSelf")
    : me.user.username === navigation.getParam("username") ||
      !navigation.getParam("username");
  const isDarkMode = useTheme();
  const [search, setSearch] = useState<string>("");
  const [coffeeId, setCoffeeId] = useState<string>("");
  const [moveNotificationId, setMoveNotificationId] = useState<string>();
  const [coffeeModalOpen, setCoffeeModalOpen] = useState<boolean>(false);
  const [addTripModalOpen, setAddTripModalOpen] = useState<boolean>(false);
  const [editTripModalOpen, setEditTripModalOpen] = useState<boolean>(false);
  const [isCalendarMode, setIsCalendarMode] = useState<boolean>(false);
  const [searchCityId, setSearchCityId] = useState<string>("");
  const [searchCityName, setSearchCityName] = useState<string>("");
  const [searchCountryCode, setSearchCountryCode] = useState<string>("");
  const [searchCountryName, setSearchCountryName] = useState<string>("");
  const [avatarModalOpen, setAvatarModalOpen] = useState<boolean>(false);
  const [searchContinentCode, setSearchContinentCode] = useState<string>("");
  const [uuid, setUuid] = useState<string>(
    navigation.getParam("uuid")
      ? navigation.getParam("uuid")
      : me.user.profile.uuid
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [tripStartDate, setTripStartDate] = useState<moment.Moment>(null);
  const [tripEndDate, setTripEndDate] = useState<moment.Moment>(null);
  const [tripMarkedDates, setTripMarkedDates] = useState<any>({});
  const { showActionSheetWithOptions } = useActionSheet();
  const imageNumber = Math.round(Math.random() * 9);
  const randomAvatar = {
    1: require(`../../../../Images/avatars/earth1.png`),
    2: require(`../../../../Images/avatars/earth2.png`),
    3: require(`../../../../Images/avatars/earth3.png`),
    4: require(`../../../../Images/avatars/earth4.png`),
    5: require(`../../../../Images/avatars/earth5.png`),
    6: require(`../../../../Images/avatars/earth6.png`),
    7: require(`../../../../Images/avatars/earth7.png`),
    8: require(`../../../../Images/avatars/earth8.png`),
    9: require(`../../../../Images/avatars/earth9.png`)
  };
  const deleteTrip = id => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: "Are you sure to delete trip?"
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          deleteTripFn({
            variables: {
              moveNotificationId: parseInt(id, 10)
            }
          });
          calculateDistanceFn();
          toast("Trip deleted");
        }
      }
    );
  };
  const selectReportUser = () => {
    showActionSheetWithOptions(
      {
        options: [
          "Inappropriate Photoes",
          "Looks Like Spam",
          "Inappropriate Message",
          "Other",
          "Cancel"
        ],
        cancelButtonIndex: 4,
        title: `Choose a reason for reporting this account. We won't tell ${user.username} who reported them.`,
        showSeparators: true
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          reportUser("PHOTO");
        } else if (buttonIndex === 1) {
          reportUser("SPAM");
        } else if (buttonIndex === 2) {
          reportUser("MESSAGE");
        } else if (buttonIndex === 3) {
          reportUser("OTHER");
        } else {
          null;
        }
      }
    );
  };
  const reportUser = payload => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: `Are you sure to report ${user.username}?`
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          slackReportUsersFn({
            variables: { targetUuid: uuid, payload }
          });
          toast("Reported");
        }
      }
    );
  };
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const {
    data: { userProfile: { user = null } = {} } = {},
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<UserProfile, UserProfileVariables>(GET_USER, {
    variables: { uuid }
  });
  const {
    data: { getSameTrips: { cities = null } = {} } = {},
    loading: getSameTripsLoading,
    refetch: getSameTripsRefetch
  } = useQuery<GetSameTrips, GetSameTripsVariables>(GET_SAME_TRIPS, {
    variables: {
      uuid
    },
    skip: !navigation.getParam("uuid")
  });
  const {
    data: { getTrips: { trip = null } = {} } = {},
    loading: tripLoading,
    refetch: tripRefetch
  } = useQuery<GetTrips, GetTripsVariables>(GET_TRIPS, {
    variables: { username }
  });
  const {
    data: { getCoffees: { coffees = null } = {} } = {},
    loading: coffeeLoading
  } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
    variables: {
      uuid,
      location: "profile"
    },
    fetchPolicy: "no-cache"
  });
  const [addTripFn, { loading: addTripLoading }] = useMutation<
    AddTrip,
    AddTripVariables
  >(ADD_TRIP, {
    variables: {
      cityId: searchCityId,
      startDate: moment(tripStartDate),
      endDate: moment(tripEndDate)
    }
  });
  const [editTripFn, { loading: editTripLoading }] = useMutation<
    EditTrip,
    EditTripVariables
  >(EDIT_TRIP, {
    variables: {
      moveNotificationId: parseInt(moveNotificationId, 10),
      cityId: searchCityId,
      startDate: moment(tripStartDate),
      endDate: moment(tripEndDate)
    }
  });
  const [deleteTripFn, { loading: deleteTripLoading }] = useMutation<
    DeleteTrip,
    DeleteTripVariables
  >(DELETE_TRIP, {
    update(cache, { data: { deleteTrip } }) {
      try {
        const data = cache.readQuery<GetTrips, GetTripsVariables>({
          query: GET_TRIPS,
          variables: { username }
        });
        if (data) {
          data.getTrips.trip = data.getTrips.trip.filter(
            i => parseInt(i.id, 10) !== deleteTrip.tripId
          );
          cache.writeQuery({
            query: GET_TRIPS,
            variables: { username },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const [
    calculateDistanceFn,
    { loading: calculateDistanceLoading }
  ] = useMutation<CalculateDistance>(CALCULATE_DISTANCE);
  const [
    slackReportUsersFn,
    { loading: slackReportUsersLoading }
  ] = useMutation<SlackReportUsers, SlackReportUsersVariables>(
    SLACK_REPORT_USERS
  );
  const [createCityFn, { loading: createCityLoading }] = useMutation<
    CreateCity,
    CreateCityVariables
  >(CREATE_CITY);
  const onSearchPress = async (cityId, cityName, countryName) => {
    let result;
    try {
      result = await createCityFn({
        variables: { cityId }
      });
      setIsCalendarMode(true);
      setSearchCityId(result.data.createCity.cityId);
      setSearchCountryCode(result.data.createCity.countryCode);
      setSearchContinentCode(result.data.createCity.continentCode);
      setSearchCityName(cityName);
      setSearchCountryName(countryName);
    } catch (e) {
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
      await getSameTripsRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  const onAddTripPress = async () => {
    setAddTripModalOpen(false);
    setSearch("");
    setIsCalendarMode(false);
    try {
      const {
        data: { addTrip }
      } = await addTripFn();
      setTripMarkedDates({});
      if (addTrip.ok) {
        calculateDistanceFn();
        tripRefetch();
        toast("Trip added");
      }
    } catch (e) {
      toast("Overlapping dates! Please check your trip dates.");
    }
  };
  const onEditTripPress = async () => {
    setEditTripModalOpen(false);
    setSearch("");
    setIsCalendarMode(false);
    try {
      const {
        data: { editTrip }
      } = await editTripFn();
      setTripMarkedDates({});
      if (editTrip.ok) {
        calculateDistanceFn();
        tripRefetch();
        toast("Trip edited");
      }
    } catch (e) {
      toast("Overlapping dates! Please check your trip dates.");
    }
  };
  const onEditBtnPress = (id, trip, tripStartDate, tripEndDate) => {
    setMoveNotificationId(id);
    setEditTripModalOpen(true);
    setIsCalendarMode(true);
    setSearch(trip.city.cityName);
    setSearchCityId(trip.city.cityId);
    setSearchCityName(trip.city.cityName);
    setSearchCountryCode(trip.city.country.countryCode);
    setSearchCountryName(trip.city.country.countryName);
    setSearchContinentCode(trip.city.country.continent.continentCode);
    if (tripStartDate && tripEndDate) {
      const daysInBetween = moment(tripEndDate).diff(tripStartDate, "day");
      const daysInBetweenMarked = range(daysInBetween).reduce((acc, cur) => {
        const nextDay = moment(tripStartDate)
          .add(cur, "day")
          .format("YYYY-MM-DD");
        acc[nextDay] = {
          color: "#C75454",
          selected: true,
          textColor: "white"
        };
        return acc;
      }, {});
      const markedDates = {
        ...daysInBetweenMarked,
        [tripStartDate.toString()]: {
          color: "#C75454",
          startingDay: true,
          textColor: "white"
        },
        [tripEndDate.toString()]: {
          color: "#C75454",
          endingDay: true,
          textColor: "white"
        }
      };
      setTripStartDate(tripStartDate);
      setTripEndDate(tripEndDate);
      setTripMarkedDates(markedDates);
    } else {
      setTripMarkedDates({});
      setTripStartDate(null);
      setTripEndDate(null);
    }
  };
  const onPress = coffeeId => {
    setCoffeeModalOpen(true);
    setCoffeeId(coffeeId);
  };
  const onDayPress = day => {
    if (
      !tripStartDate ||
      day.dateString < tripStartDate ||
      (tripStartDate && tripEndDate)
    ) {
      const tripStartDate = day.dateString;
      const markedDates = {
        [tripStartDate.toString()]: {
          color: "#C75454",
          endingDay: true,
          startingDay: true,
          textColor: "white"
        }
      };
      setTripStartDate(tripStartDate);
      setTripEndDate(null);
      setTripMarkedDates(markedDates);
    } else {
      if (day.dateString !== tripStartDate) {
        const tripEndDate = day.dateString;
        const daysInBetween = moment(tripEndDate).diff(tripStartDate, "day");
        const daysInBetweenMarked = range(daysInBetween).reduce((acc, cur) => {
          const nextDay = moment(tripStartDate)
            .add(cur, "day")
            .format("YYYY-MM-DD");
          acc[nextDay] = {
            color: "#C75454",
            selected: true,
            textColor: "white"
          };
          return acc;
        }, {});
        const markedDates = {
          ...daysInBetweenMarked,
          [tripStartDate.toString()]: {
            color: "#C75454",
            startingDay: true,
            textColor: "white"
          },
          [tripEndDate.toString()]: {
            color: "#C75454",
            endingDay: true,
            textColor: "white"
          }
        };
        setTripEndDate(tripEndDate);
        setTripMarkedDates(markedDates);
      }
    }
  };
  const formatDistance = (distance: number) => {
    if (distance < 1e3) return distance;
    if (distance >= 1e3 && distance < 1e5)
      return +(distance / 1e3).toFixed(2) + "K";
    if (distance >= 1e5 && distance < 1e8)
      return +(distance / 1e6).toFixed(2) + "M";
    if (distance >= 1e8 && distance < 1e11)
      return +(distance / 1e9).toFixed(2) + "B";
    if (distance >= 1e11) return +(distance / 1e12).toFixed(1) + "T";
    else return null;
  };
  useEffect(() =>
    setUuid(
      navigation.getParam("uuid")
        ? navigation.getParam("uuid")
        : me.user.profile.uuid
    )
  );
  if (
    profileLoading ||
    tripLoading ||
    coffeeLoading ||
    getSameTripsLoading ||
    meLoading ||
    createCityLoading
  ) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <>
        <AvatarModal visible={avatarModalOpen} transparent={true}>
          <ImageViewer
            imageUrls={[
              { url: `${BACKEND_URL}/media/${user.profile.avatarUrl}` }
            ]}
            enablePreload={true}
            style={{
              height: constants.width,
              width: constants.width,
              padding: 0,
              margin: 0
            }}
            renderImage={() => {
              return (
                <ProgressiveImage
                  tint={isDarkMode ? "dark" : "light"}
                  style={{
                    height: constants.width,
                    width: constants.width,
                    padding: 0,
                    margin: 0,
                    position: "absolute"
                  }}
                  preview={{
                    uri: `${BACKEND_URL}/media/${user.profile.avatarUrl}`
                  }}
                  uri={`${BACKEND_URL}/media/${user.profile.avatarUrl}`}
                />
              );
            }}
            onSwipeDown={() => setAvatarModalOpen(false)}
            backgroundColor={
              isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
            }
            enableSwipeDown={true}
            loadingRender={() => {
              return <Loader />;
            }}
            //@ts-ignore
            renderIndicator={() => {}}
            saveToLocalByLongPress={false}
          />
        </AvatarModal>
        <Modal
          style={{ margin: 0, alignItems: "flex-start" }}
          isVisible={addTripModalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() => {
            setAddTripModalOpen(false), setSearch(""), setIsCalendarMode(false);
          }}
          onBackButtonPress={() => {
            Platform.OS !== "ios" && setAddTripModalOpen(false),
              setSearch(""),
              setIsCalendarMode(false);
          }}
          onModalHide={() => {
            setAddTripModalOpen(false), setSearch(""), setIsCalendarMode(false);
          }}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.95}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          {isCalendarMode ? (
            <>
              <CalendarContainer>
                <CalendarList
                  style={{
                    height: "auto",
                    width: "100%"
                  }}
                  pastScrollRange={24}
                  futureScrollRange={24}
                  pagingEnabled={true}
                  markedDates={tripMarkedDates}
                  onDayPress={onDayPress}
                  markingType={"period"}
                  theme={{
                    backgroundColor: "transparent",
                    calendarBackground: "transparent",
                    dayTextColor: "#999",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor:
                      isDarkMode && isDarkMode === true ? "white" : "black",
                    monthTextColor: "#00adf5",
                    textMonthFontWeight: "bold",
                    selectedDayBackgroundColor: "#00adf5"
                  }}
                />
              </CalendarContainer>
              <Touchable onPress={() => setIsCalendarMode(false)}>
                <CalendarCityContainer>
                  <SearchCityPhoto cityId={searchCityId} />
                  <SearchHeaderUserContainer>
                    <CityBold>{searchCityName}</CityBold>
                    <Location>
                      {searchCountryName
                        ? countries.find(i => i.code === searchCountryCode).name
                        : searchCityName}
                    </Location>
                  </SearchHeaderUserContainer>
                </CalendarCityContainer>
              </Touchable>
              <TripBtnContainer>
                <TripSubmitBtn
                  onPress={() => {
                    setAddTripModalOpen(false),
                      setSearch(""),
                      setIsCalendarMode(false);
                  }}
                >
                  <TripText>CANCEL</TripText>
                </TripSubmitBtn>
                <TripSubmitBtn
                  disabled={addTripLoading}
                  onPress={() => onAddTripPress()}
                >
                  <TripText>ADD TRIP</TripText>
                </TripSubmitBtn>
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
                  fontSize: 40,
                  position: "absolute",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: isDarkMode && isDarkMode === true ? "white" : "black"
                }}
                autoFocus={true}
                value={search}
                placeholder={"Search"}
                placeholderTextColor={"#999"}
                returnKeyType="search"
                onChangeText={onChange}
                autoCorrect={false}
              />
              <Touchable
                onPress={() => {
                  setAddTripModalOpen(false);
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
                                    prediction.structured_formatting
                                      .secondary_text
                                  )
                                }
                              >
                                <SearchCityContainer>
                                  <SearchHeader>
                                    <SearchCityPhoto
                                      cityId={prediction.place_id}
                                    />
                                    <SearchHeaderUserContainer>
                                      <CityBold>
                                        {
                                          prediction.structured_formatting
                                            .main_text
                                        }
                                      </CityBold>
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
          isVisible={editTripModalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() => {
            setEditTripModalOpen(false),
              setSearch(""),
              setIsCalendarMode(false);
          }}
          onBackButtonPress={() => {
            Platform.OS !== "ios" && setEditTripModalOpen(false),
              setSearch(""),
              setIsCalendarMode(false);
          }}
          onModalHide={() => {
            setEditTripModalOpen(false),
              setSearch(""),
              setIsCalendarMode(false);
          }}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.95}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          {isCalendarMode ? (
            <>
              <CalendarContainer>
                <CalendarList
                  style={{
                    height: "auto",
                    width: "100%"
                  }}
                  current={tripStartDate && tripStartDate}
                  pastScrollRange={24}
                  futureScrollRange={24}
                  pagingEnabled={true}
                  markedDates={tripMarkedDates}
                  onDayPress={onDayPress}
                  markingType={"period"}
                  theme={{
                    backgroundColor: "transparent",
                    calendarBackground: "transparent",
                    dayTextColor: "#999",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor:
                      isDarkMode && isDarkMode === true ? "white" : "black",
                    monthTextColor: "#00adf5",
                    textMonthFontWeight: "bold",
                    selectedDayBackgroundColor: "#00adf5"
                  }}
                />
              </CalendarContainer>
              <Touchable onPress={() => setIsCalendarMode(false)}>
                <CalendarCityContainer>
                  <SearchCityPhoto cityId={searchCityId} />
                  <SearchHeaderUserContainer>
                    <CityBold>{searchCityName}</CityBold>
                    <Location>
                      {searchCountryName
                        ? countries.find(i => i.code === searchCountryCode).name
                        : searchCityName}
                    </Location>
                  </SearchHeaderUserContainer>
                </CalendarCityContainer>
              </Touchable>
              <TripBtnContainer>
                <TripSubmitBtn
                  onPress={() => {
                    setEditTripModalOpen(false),
                      setSearch(""),
                      setIsCalendarMode(false);
                  }}
                >
                  <TripText>CANCEL</TripText>
                </TripSubmitBtn>
                <TripSubmitBtn
                  disabled={editTripLoading}
                  onPress={() => onEditTripPress()}
                >
                  <TripText>EDIT TRIP</TripText>
                </TripSubmitBtn>
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
                  fontSize: 40,
                  position: "absolute",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: isDarkMode && isDarkMode === true ? "white" : "black"
                }}
                autoFocus={true}
                value={search}
                placeholder={"Search"}
                placeholderTextColor={"#999"}
                returnKeyType="search"
                onChangeText={onChange}
                autoCorrect={false}
              />
              <Touchable
                onPress={() => {
                  setEditTripModalOpen(false);
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
                                    prediction.structured_formatting
                                      .secondary_text
                                  )
                                }
                              >
                                <SearchCityContainer>
                                  <SearchHeader>
                                    <SearchCityPhoto
                                      cityId={prediction.place_id}
                                    />
                                    <SearchHeaderUserContainer>
                                      <CityBold>
                                        {
                                          prediction.structured_formatting
                                            .main_text
                                        }
                                      </CityBold>
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
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
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
          <CoffeeDetail
            coffeeId={coffeeId}
            setModalOpen={setCoffeeModalOpen}
            isSelf={user.profile.isSelf}
            isStaying={true}
          />
        </Modal>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Header>
            <ImageTouchable onPress={() => setAvatarModalOpen(true)}>
              {user.profile.avatarUrl ? (
                <ProgressiveImage
                  tint={isDarkMode ? "dark" : "light"}
                  style={{ height: 150, width: 150, borderRadius: 75 }}
                  preview={{
                    uri: `${BACKEND_URL}/media/${user.profile.avatarUrl}`
                  }}
                  uri={`${BACKEND_URL}/media/${user.profile.avatarUrl}`}
                />
              ) : (
                <Image
                  resizeMode={"contain"}
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: 75
                  }}
                  source={randomAvatar[imageNumber]}
                />
              )}
            </ImageTouchable>
            <UserNameContainer>
              <UserName>
                {user.username.length > 24
                  ? user.username.substring(0, 24) + "..."
                  : user.username}
              </UserName>
              {user.profile.isSelf ? (
                <IconTouchable
                  onPress={() =>
                    navigation.push("EditProfile", {
                      ...user
                    })
                  }
                >
                  <Ionicons
                    name={
                      Platform.OS === "ios" ? "ios-settings" : "md-settings"
                    }
                    color={"#999"}
                    size={22}
                  />
                </IconTouchable>
              ) : (
                <IconTouchable onPress={() => selectReportUser()}>
                  <Ionicons
                    name={Platform.OS === "ios" ? "ios-list" : "md-list"}
                    size={22}
                    color={"#999"}
                  />
                </IconTouchable>
              )}
            </UserNameContainer>
            {!isSelf && cities && cities.length !== 0 && (
              <UserNameContainer>
                {cities.length < 6 ? (
                  <EditText>
                    You guys have been to
                    {cities.map(city => (
                      <EditText key={city.id}>
                        &nbsp;
                        {city.cityName}
                        {city.country.countryEmoji}
                      </EditText>
                    ))}
                    .
                  </EditText>
                ) : (
                  <EditText>
                    You guys have been to
                    {cities.slice(0, 5).map(city => (
                      <EditText key={city.id}>
                        &nbsp;
                        {city.cityName}
                        {city.country.countryEmoji}
                      </EditText>
                    ))}
                    and {cities.length - 5} more cities.
                  </EditText>
                )}
              </UserNameContainer>
            )}
          </Header>
          <Body>
            <BioText>{user.profile.bio}</BioText>
            <ItemContainer>
              {user.profile.distance !== 0 && (
                <Item>
                  <UserName>{formatDistance(user.profile.distance)}</UserName>
                  <Bold>KM</Bold>
                </Item>
              )}
              {user.profile.isHideTrips ? (
                <>
                  {user.profile.tripCount === 1 ? (
                    <Item>
                      <UserName>{user.profile.tripCount}</UserName>
                      <Bold>TRIP🔒</Bold>
                    </Item>
                  ) : (
                    <Item>
                      <UserName>{user.profile.tripCount}</UserName>
                      <Bold>TRIPS🔒</Bold>
                    </Item>
                  )}
                </>
              ) : (
                <>
                  {user.profile.tripCount === 1 ? (
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
                </>
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
                    onPress={() => navigation.push("Cities", { uuid })}
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
                    onPress={() => navigation.push("Countries", { uuid })}
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
                    onPress={() => navigation.push("Continents", { uuid })}
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
                coffees.map(coffee => (
                  <Touchable
                    key={coffee.uuid}
                    onPress={() => onPress(coffee.uuid)}
                  >
                    <Item>
                      <UserName>☕️</UserName>
                      <Bold>COFFEE </Bold>
                    </Item>
                  </Touchable>
                ))}
            </ItemContainer>

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
                            onPress={() =>
                              onEditBtnPress(
                                data.item.id,
                                data.item,
                                data.item.startDate,
                                data.item.endDate
                              )
                            }
                          >
                            <IconContainer>
                              <SmallText>EDIT TRIP</SmallText>
                            </IconContainer>
                          </BackLeftBtn>
                          <BackLeftBtn
                            disabled={deleteTripLoading}
                            onPress={() => deleteTrip(data.item.id)}
                          >
                            <IconContainer>
                              <SmallText>DELETE TRIP</SmallText>
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
        <Footer>
          {user.profile.isSelf && (
            <AddTripBtn onPress={() => setAddTripModalOpen(true)}>
              <AddTripContainer>
                <TripText>ADD TRIP</TripText>
              </AddTripContainer>
            </AddTripBtn>
          )}
        </Footer>
      </>
    );
  }
};
