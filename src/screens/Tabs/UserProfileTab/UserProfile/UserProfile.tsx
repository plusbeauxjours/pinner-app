import React, { useState, useEffect } from "react";
import { RefreshControl, Platform, Image, TextInput } from "react-native";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { SwipeListView } from "react-native-swipe-list-view";
import Toast from "react-native-root-toast";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useMe } from "../../../../context/MeContext";
import {
  UserProfile,
  UserProfileVariables,
  GetTrips,
  GetTripsVariables,
  AddTrip,
  AddTripVariables,
  DeleteTrip,
  DeleteTripVariables,
  CalculateDistance,
  SlackReportUsers,
  SlackReportUsersVariables,
  GetSameTrips,
  GetSameTripsVariables,
  CreateCity,
  CreateCityVariables,
  Match,
  MatchVariables,
  GetMatches,
  GetMatchesVariables,
} from "../../../../types/api";
import {
  GET_USER,
  GET_TRIPS,
  ADD_TRIP,
  DELETE_TRIP,
  CALCULATE_DISTANCE,
  SLACK_REPORT_USERS,
} from "./UserProfileQueries";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import constants, { BACKEND_URL } from "../../../../../constants";
import { GET_SAME_TRIPS } from "./UserProfileQueries";
import Modal from "react-native-modal";
import { useTheme } from "../../../../context/ThemeContext";
import { CREATE_CITY } from "../../../../components/Search/SearchQueries";
import useGoogleAutocomplete from "../../../../hooks/useGoogleAutocomplete";
import keys from "../../../../../keys";
import SearchCityPhoto from "../../../../components/SearchCityPhoto";
import ImageZoom from "react-native-image-pan-zoom";
import { MATCH } from "../../../../sharedQueries";
import { GET_MATCHES } from "../../MatchTab/Match/MatchQueries";

const Header = styled.View`
  height: 290;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.headerColor};
  padding: 10px;
`;
const Body = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
  padding: 5px;
`;

const BioText = styled.Text`
  padding: 10px;
  color: ${(props) => props.theme.color};
`;
const Bold = styled.Text`
  font-size: 11px;
  color: ${(props) => props.theme.color};
`;
const Item = styled.View`
  flex-direction: column;
  align-items: center;
  width: ${constants.width / 4 - 2.5};
  height: 50px;
`;
const ItemContainer = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 25px;
`;
const UserNameContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
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
  font-size: 28px;
  color: ${(props) => props.theme.color};
`;
const ScrollView = styled.ScrollView`
  background-color: ${(props) => props.theme.bgColor};
`;
const SearchLoaderContainer = styled.View`
  flex: 1;
  margin-top: 50;
`;
const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;
const EditText = styled.Text`
  color: ${(props) => props.theme.color};
  font-size: 11px;
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
  background-color: ${(props) => props.theme.bgColor};
`;
const TouchableBackRow = styled.View`
  background-color: ${(props) => props.theme.bgColor};
`;
const SmallText = styled.Text`
  color: #999;
  text-align: center;
  font-size: 8px;
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

const CityBold = styled.Text`
  font-weight: 500;
  color: ${(props) => props.theme.color};
`;
const TripText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
`;
const SearchCityContainer = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
  font-size: 11px;
  color: ${(props) => props.theme.color};
`;
const TripSmallText = styled(SmallText)`
  margin-left: 15px;
  text-align: auto;
`;
const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  background-color: ${(props) => props.theme.bgColor};
`;
const MessageContainer = styled.TouchableOpacity`
  width: 100px;
  height: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #999;
  color: #999;
  margin-bottom: 5px;
`;
const MessageText = styled.Text`
  color: #999;
`;
export default ({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const isSelf = navigation.getParam("isSelf")
    ? navigation.getParam("isSelf")
    : me.user.uuid === navigation.getParam("uuid") ||
      !navigation.getParam("uuid");
  const isDarkMode = useTheme();
  const [search, setSearch] = useState<string>("");
  const [addTripModalOpen, setAddTripModalOpen] = useState<boolean>(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string>(
    navigation.getParam("isSelf") ? me.user.uuid : navigation.getParam("uuid")
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const imageNumber = Math.round(Math.random() * 9);
  const randomAvatar = {
    0: require(`../../../../Images/avatars/earth6.png`),
    1: require(`../../../../Images/avatars/earth1.png`),
    2: require(`../../../../Images/avatars/earth2.png`),
    3: require(`../../../../Images/avatars/earth3.png`),
    4: require(`../../../../Images/avatars/earth4.png`),
    5: require(`../../../../Images/avatars/earth5.png`),
    6: require(`../../../../Images/avatars/earth6.png`),
    7: require(`../../../../Images/avatars/earth7.png`),
    8: require(`../../../../Images/avatars/earth8.png`),
    9: require(`../../../../Images/avatars/earth9.png`),
  };
  const deleteTrip = (id) => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        showSeparators: true,
        title: "Are you sure to delete trip?",
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10,
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400",
        },
        separatorStyle: { opacity: 0.5 },
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          deleteTripFn({
            variables: {
              moveNotificationId: parseInt(id, 10),
            },
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
          "Cancel",
        ],
        cancelButtonIndex: 4,
        title: `Choose a reason for reporting this account. We won't tell ${user.username} who reported them.`,
        showSeparators: true,
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10,
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400",
        },
        separatorStyle: { opacity: 0.5 },
      },
      async (buttonIndex) => {
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
  const reportUser = (payload) => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        showSeparators: true,
        title: `Are you sure to report ${user.username}?`,
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10,
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400",
        },
        separatorStyle: { opacity: 0.5 },
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          slackReportUsersFn({
            variables: { targetUuid: uuid, payload },
          });
          toast("Reported");
        }
      }
    );
  };
  const toast = (message: string) => {
    Toast.show(message, {
      duration: 1000,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };
  const {
    data: { userProfile: { user = null } = {} } = {},
    loading: profileLoading,
    refetch: profileRefetch,
  } = useQuery<UserProfile, UserProfileVariables>(GET_USER, {
    variables: { uuid },
  });
  const {
    data: { getSameTrips: { cities = null } = {} } = {},
    loading: getSameTripsLoading,
    refetch: getSameTripsRefetch,
  } = useQuery<GetSameTrips, GetSameTripsVariables>(GET_SAME_TRIPS, {
    variables: {
      uuid,
    },
    skip: !navigation.getParam("uuid"),
  });
  const {
    data: { getTrips: { trip = null } = {} } = {},
    loading: tripLoading,
    refetch: tripRefetch,
  } = useQuery<GetTrips, GetTripsVariables>(GET_TRIPS, {
    variables: { uuid },
  });
  const [addTripFn, { loading: addTripLoading }] = useMutation<
    AddTrip,
    AddTripVariables
  >(ADD_TRIP);
  const [deleteTripFn, { loading: deleteTripLoading }] = useMutation<
    DeleteTrip,
    DeleteTripVariables
  >(DELETE_TRIP, {
    update(cache, { data: { deleteTrip } }) {
      try {
        const data = cache.readQuery<GetTrips, GetTripsVariables>({
          query: GET_TRIPS,
          variables: { uuid },
        });
        if (data) {
          data.getTrips.trip = data.getTrips.trip.filter(
            (i) => parseInt(i.id, 10) !== deleteTrip.tripId
          );
          cache.writeQuery({
            query: GET_TRIPS,
            variables: { uuid },
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  // mutations

  const [
    calculateDistanceFn,
    { loading: calculateDistanceLoading },
  ] = useMutation<CalculateDistance>(CALCULATE_DISTANCE);

  const [
    slackReportUsersFn,
    { loading: slackReportUsersLoading },
  ] = useMutation<SlackReportUsers, SlackReportUsersVariables>(
    SLACK_REPORT_USERS
  );

  const [createCityFn, { loading: createCityLoading }] = useMutation<
    CreateCity,
    CreateCityVariables
  >(CREATE_CITY);

  const [matchFn, { loading: matchLoading }] = useMutation<
    Match,
    MatchVariables
  >(MATCH, {
    variables: {
      cityId: me.user.currentCity.cityId,
      hostUuid: me.user.uuid,
      guestUuid: uuid,
    },
    update(cache, { data: { match } }) {
      if (match.match) {
        try {
          const matchData = cache.readQuery<GetMatches, GetMatchesVariables>({
            query: GET_MATCHES,
          });
          if (matchData) {
            if (
              !matchData.getMatches.matches.find(
                (matche) => matche.id == match.match.id
              )
            ) {
              matchData.getMatches.matches.unshift(match.match);
              cache.writeQuery({
                query: GET_MATCHES,
                data: matchData,
              });
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
  });

  // onPressFunctions

  const onSearchPress = async (cityId) => {
    let result;
    try {
      result = await createCityFn({
        variables: { cityId },
      });
      onAddTripPress(result.data.createCity.cityId);
    } catch (e) {
      console.log(e);
    }
  };

  const onChange = (text: string) => {
    setSearch(text);
  };
  const onMatch = async () => {
    const {
      data: { match },
    } = await matchFn({
      variables: {
        cityId: me.user.currentCity.cityId,
        hostUuid: me.user.uuid,
        guestUuid: uuid,
      },
    });
    if (match.match) {
      navigation.navigate("Chat", {
        chatId: match.match.id,
        userId: me.user.uuid,
        receiverId: match.match.isHost
          ? match.match.guest.uuid
          : match.match.host.uuid,
        receiverAvatar: match.match.isHost
          ? match.match.guest.appAvatarUrl
          : match.match.host.appAvatarUrl,
        receiverPushToken: match.match.isHost
          ? match.match.guest.pushToken
          : match.match.host.pushToken,
        uuid: me.user.uuid,
        userName: me.user.username,
        userUrl: me.user.appAvatarUrl,
        targetUuid: match.match.isHost
          ? match.match.guest.uuid
          : match.match.host.uuid,
        isDarkMode: isDarkMode,
        latitude: me.user.currentCity.latitude,
        longitude: me.user.currentCity.longitude,
      });
    }
  };

  const { results, isLoading } = useGoogleAutocomplete({
    apiKey: `${keys.REACT_APP_GOOGLE_PLACE_KEY}`,
    query: search,
    options: {
      types: "(cities)",
      language: "en",
    },
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
  const onAddTripPress = async (cityId) => {
    setSearch("");
    setAddTripModalOpen(false);
    try {
      const {
        data: { addTrip },
      } = await addTripFn({ variables: { cityId } });
      if (addTrip.ok) {
        await calculateDistanceFn();
        await tripRefetch();
        await toast("Trip added");
        navigation.push("CityProfileTabs", {
          cityId: addTrip.moveNotification.city.cityId,
          countryCode: addTrip.moveNotification.city.country.countryCode,
          continentCode:
            addTrip.moveNotification.city.country.continent.continentCode,
        });
      }
    } catch (e) {
      toast("Overlapping dates! Please check your trip dates.");
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
      navigation.getParam("uuid") ? navigation.getParam("uuid") : me.user.uuid
    )
  );
  if (profileLoading || tripLoading || getSameTripsLoading || meLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <>
        <Modal
          style={{ margin: 0, alignItems: "flex-start" }}
          isVisible={avatarModalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() => setAvatarModalOpen(false)}
          onBackButtonPress={() =>
            Platform.OS === "android" && setAvatarModalOpen(false)
          }
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn={"fadeIn"}
          animationOut={"fadeOut"}
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          <ImageZoom
            cropWidth={constants.width}
            cropHeight={constants.width}
            imageWidth={constants.width}
            imageHeight={constants.width}
          >
            <ProgressiveImage
              tint={isDarkMode ? "dark" : "light"}
              resizeMode={"cover"}
              style={{
                height: constants.width,
                width: constants.width,
                padding: 0,
                margin: 0,
                position: "absolute",
              }}
              onSwipeDown={() => setAvatarModalOpen(false)}
              preview={{
                uri: `${BACKEND_URL}/media/${user?.avatarUrl}`,
              }}
              uri={`${BACKEND_URL}/media/${user?.avatarUrl}`}
            />
          </ImageZoom>
        </Modal>
        <Modal
          style={{ margin: 0, alignItems: "flex-start" }}
          isVisible={addTripModalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() => {
            setSearch(""), setAddTripModalOpen(false);
          }}
          onBackButtonPress={() => {
            setSearch(""),
              Platform.OS === "android" && setAddTripModalOpen(false);
          }}
          onModalHide={() => {
            setSearch(""), setAddTripModalOpen(false);
          }}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
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
                color: isDarkMode && isDarkMode === true ? "white" : "black",
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
                  marginTop: 249,
                  marginBottom: 25,
                  backgroundColor: "transparent",
                }}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              >
                {createCityLoading || isLoading ? (
                  <SearchLoaderContainer>
                    <Loader />
                  </SearchLoaderContainer>
                ) : (
                  <>
                    {search !== "" &&
                      results.predictions &&
                      results.predictions.length !== 0 && (
                        <>
                          {results.predictions.length === 1 ? (
                            <TripSmallText>CITY</TripSmallText>
                          ) : (
                            <TripSmallText>CITIES</TripSmallText>
                          )}
                          {results.predictions.map((prediction) => (
                            <Touchable
                              key={prediction.id}
                              onPress={() => onSearchPress(prediction.place_id)}
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
                  </>
                )}
              </ScrollView>
            </Touchable>
          </>
        </Modal>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={"#999"}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <Header>
            <ImageTouchable
              disabled={!user.avatarUrl}
              onPress={() => setAvatarModalOpen(true)}
            >
              {user.avatarUrl ? (
                <ProgressiveImage
                  tint={isDarkMode ? "dark" : "light"}
                  style={{ height: 150, width: 150, borderRadius: 75 }}
                  preview={{
                    uri: `${BACKEND_URL}/media/${user.avatarUrl}`,
                  }}
                  uri={`${BACKEND_URL}/media/${user.avatarUrl}`}
                />
              ) : (
                <Image
                  resizeMode={"contain"}
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: 75,
                  }}
                  source={randomAvatar[imageNumber]}
                />
              )}
            </ImageTouchable>
            {!user.isSelf && (
              <MessageContainer onPress={() => onMatch()}>
                <MessageText>MESSAGE</MessageText>
              </MessageContainer>
            )}
            <UserNameContainer>
              <UserName>
                {user.username.length > 24
                  ? user.username.substring(0, 24) + "..."
                  : user.username}
              </UserName>
              {user.isSelf ? (
                <IconTouchable
                  onPress={() => navigation.navigate("EditProfile", { user })}
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
                  <FontAwesome
                    name="exclamation-circle"
                    size={18}
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
                    {cities.map((city) => (
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
                    {cities.slice(0, 5).map((city) => (
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
            <BioText>{user.bio}</BioText>
            <ItemContainer>
              {user.distance !== 0 && (
                <Item>
                  <UserName>{formatDistance(user.distance)}</UserName>
                  <Bold>KM</Bold>
                </Item>
              )}
              {/* {user.isHidePhotos ? (
                user.isSelf ? (
                  <Touchable
                    onPress={() => navigation.push("AvatarList", { uuid })}
                  >
                    {user.photoCount === 1 ? (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTO🔒</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTOS🔒</Bold>
                      </Item>
                    )}
                  </Touchable>
                ) : (
                  <>
                    {user.photoCount === 1 ? (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTO🔒</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTOS🔒</Bold>
                      </Item>
                    )}
                  </>
                )
              ) : (
                <>
                  <Touchable
                    onPress={() => navigation.push("AvatarList", { uuid })}
                  >
                    {user.photoCount === 1 ? (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTO</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTOS</Bold>
                      </Item>
                    )}
                  </Touchable>
                </>
              )} */}
              {user.isHideTrips ? (
                <>
                  {user.tripCount === 1 ? (
                    <Item>
                      <UserName>{user.tripCount}</UserName>
                      <Bold>TRIP🔒</Bold>
                    </Item>
                  ) : (
                    <Item>
                      <UserName>{user.tripCount}</UserName>
                      <Bold>TRIPS🔒</Bold>
                    </Item>
                  )}
                </>
              ) : (
                <>
                  {user.tripCount === 1 ? (
                    <Item>
                      <UserName>{user.tripCount}</UserName>
                      <Bold>TRIP</Bold>
                    </Item>
                  ) : (
                    <Item>
                      <UserName>{user.tripCount}</UserName>
                      <Bold>TRIPS</Bold>
                    </Item>
                  )}
                </>
              )}
              {user.isHideCities ? (
                <>
                  {user.cityCount === 1 ? (
                    <Item>
                      <UserName>{user.cityCount}</UserName>
                      <Bold>CITY🔒</Bold>
                    </Item>
                  ) : (
                    <Item>
                      <UserName>{user.cityCount}</UserName>
                      <Bold>CITIES🔒</Bold>
                    </Item>
                  )}
                </>
              ) : (
                <>
                  <Touchable
                    onPress={() => navigation.push("Cities", { uuid })}
                  >
                    {user.cityCount === 1 ? (
                      <Item>
                        <UserName>{user.cityCount}</UserName>
                        <Bold>CITY</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.cityCount}</UserName>
                        <Bold>CITIES</Bold>
                      </Item>
                    )}
                  </Touchable>
                </>
              )}
              {user.isHideCountries ? (
                <>
                  {user.countryCount === 1 ? (
                    <Item>
                      <UserName>{user.countryCount}</UserName>
                      <Bold>COUNTRY🔒</Bold>
                    </Item>
                  ) : (
                    <Item>
                      <UserName>{user.countryCount}</UserName>
                      <Bold>COUNTRIES🔒</Bold>
                    </Item>
                  )}
                </>
              ) : (
                <>
                  <Touchable
                    onPress={() => navigation.push("Countries", { uuid })}
                  >
                    {user.countryCount === 1 ? (
                      <Item>
                        <UserName>{user.countryCount}</UserName>
                        <Bold>COUNTRY</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.countryCount}</UserName>
                        <Bold>COUNTRIES</Bold>
                      </Item>
                    )}
                  </Touchable>
                </>
              )}
              {user.isHideContinents ? (
                <>
                  {user.continentCount === 1 ? (
                    <Item>
                      <UserName>{user.continentCount}</UserName>
                      <Bold>CONTINENT🔒</Bold>
                    </Item>
                  ) : (
                    <Item>
                      <UserName>{user.continentCount}</UserName>
                      <Bold>CONTINENTS🔒</Bold>
                    </Item>
                  )}
                </>
              ) : (
                <>
                  <Touchable
                    onPress={() => navigation.push("Continents", { uuid })}
                  >
                    {user.continentCount === 1 ? (
                      <Item>
                        <UserName>{user.continentCount}</UserName>
                        <Bold>CONTINENT</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.continentCount}</UserName>
                        <Bold>CONTINENTS</Bold>
                      </Item>
                    )}
                  </Touchable>
                </>
              )}
              {user.gender && (
                <Item>
                  {(() => {
                    switch (user.gender) {
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
              {user.nationality && (
                <Touchable
                  onPress={() =>
                    navigation.push("CountryProfileTabs", {
                      countryCode: user.nationality.countryCode,
                      continentCode: user.nationality.continent.continentCode,
                    })
                  }
                >
                  <Item>
                    <UserName>{user.nationality.countryEmoji}</UserName>
                    <Bold>NATIONALITY </Bold>
                  </Item>
                </Touchable>
              )}
              {user.residence && (
                <Touchable
                  onPress={() =>
                    navigation.push("CountryProfileTabs", {
                      countryCode: user.residence.countryCode,
                      continentCode: user.residence.continent.continentCode,
                    })
                  }
                >
                  <Item>
                    <UserName>{user.residence.countryEmoji}</UserName>
                    <Bold>RESIDENCE </Bold>
                  </Item>
                </Touchable>
              )}
              {user.isSelf &&
                (user.blockedUserCount === 1 ? (
                  <Touchable onPress={() => navigation.push("BlockedUsers")}>
                    <Item>
                      <UserName>{user.blockedUserCount}</UserName>
                      <Bold>BLOCKED USER</Bold>
                    </Item>
                  </Touchable>
                ) : (
                  <Touchable onPress={() => navigation.push("BlockedUsers")}>
                    <Item>
                      <UserName>{user.blockedUserCount}</UserName>
                      <Bold>BLOCKED USERS</Bold>
                    </Item>
                  </Touchable>
                ))}
            </ItemContainer>

            {(() => {
              switch (user.isSelf) {
                case false:
                  return user.isHideTrips ? (
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
                                i.city.country.continent.continentCode,
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
                      renderItem={(data) => (
                        <TouchableBackRow key={data.item.id}>
                          <TouchableRow
                            onPress={() =>
                              navigation.push("CityProfileTabs", {
                                cityId: data.item.city.cityId,
                                countryCode: data.item.city.country.countryCode,
                                continentCode:
                                  data.item.city.country.continent
                                    .continentCode,
                              })
                            }
                          >
                            <UserRow trip={data.item} type={"trip"} />
                          </TouchableRow>
                        </TouchableBackRow>
                      )}
                      renderHiddenItem={(data) => (
                        <RowBack>
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
                      leftOpenValue={46}
                      keyExtractor={(item) => item.id}
                    />
                  );
              }
            })()}
          </Body>
        </ScrollView>
        <Footer>
          {user.isSelf && (
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
