import React, { useState, useEffect } from "react";

import { useQuery, useMutation } from "react-apollo-hooks";
import Toast from "react-native-root-toast";
import { useActionSheet } from "@expo/react-native-action-sheet";

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
import constants from "../../../../../constants";
import { GET_SAME_TRIPS } from "./UserProfileQueries";
import { useTheme } from "../../../../context/ThemeContext";
import { CREATE_CITY } from "../../../../components/Search/SearchQueries";
import useGoogleAutocomplete from "../../../../hooks/useGoogleAutocomplete";
import keys from "../../../../../keys";
import { MATCH } from "../../../../sharedQueries";
import { GET_MATCHES } from "../../MatchTab/Match/MatchQueries";
import UserProfilePresenter from "./UserProfilePresenter";

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

  // mutations

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

  //QUERY

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

  // FUNC

  const deleteTrip = (id: string) => {
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

  return (
    <UserProfilePresenter
      navigation={navigation}
      profileLoading={profileLoading}
      tripLoading={tripLoading}
      getSameTripsLoading={getSameTripsLoading}
      meLoading={meLoading}
      avatarModalOpen={avatarModalOpen}
      isDarkMode={isDarkMode}
      setAvatarModalOpen={setAvatarModalOpen}
      user={user}
      addTripModalOpen={addTripModalOpen}
      setSearch={setSearch}
      setAddTripModalOpen={setAddTripModalOpen}
      onChange={onChange}
      createCityLoading={createCityLoading}
      isLoading={isLoading}
      search={search}
      results={results}
      onSearchPress={onSearchPress}
      refreshing={refreshing}
      onRefresh={onRefresh}
      randomAvatar={randomAvatar}
      onMatch={onMatch}
      selectReportUser={selectReportUser}
      isSelf={isSelf}
      cities={cities}
      formatDistance={formatDistance}
      imageNumber={imageNumber}
      uuid={uuid}
      trip={trip}
      deleteTripLoading={deleteTripLoading}
      deleteTrip={deleteTrip}
    />
  );
};
