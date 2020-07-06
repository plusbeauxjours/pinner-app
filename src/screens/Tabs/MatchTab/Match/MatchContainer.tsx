import React, { useState, useEffect } from "react";
import { Platform, Alert, Linking } from "react-native";

import Constants from "expo-constants";
import { MARK_AS_READ_MATCH, GET_MATCHES } from "./MatchQueries";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Toast from "react-native-root-toast";
import { useQuery, useMutation } from "react-apollo-hooks";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";

import { chat_leave, fb_db } from "../../../../../Fire";
import { GET_BLOCkED_USER } from "../../UserProfileTab/BlockedUsers/BlockedUsersQueries";
import {
  REGISTER_PUSH,
  ADD_BLOCK_USER,
  ME,
  REPORT_LOCATION,
} from "../../../../sharedQueries";
import { UNMATCH } from "../../../../sharedQueries";
import { GET_USER } from "../../UserProfileTab/UserProfile/UserProfileQueries";

import {
  Me,
  ReportLocation,
  ReportLocationVariables,
  GetMatches,
  GetMatchesVariables,
  MarkAsReadMatch,
  MarkAsReadMatchVariables,
  UnMatch,
  UnMatchVariables,
  RegisterPush,
  RegisterPushVariables,
  AddBlockUser,
  AddBlockUserVariables,
  GetBlockedUser,
  UserProfile,
  UserProfileVariables,
} from "../../../../types/api";

import constants from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";
import { useReverseGeoCode } from "../../../../hooks/useReverseGeoCode";
import { useReversePlaceId } from "../../../../hooks/useReversePlaceId";
import MatchPresenter from "./MatchPresenter";

export default () => {
  const { data, loading: meLoading } = useQuery<Me>(ME);
  const me = data ? data.me : null;
  const isDarkMode = useTheme();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // MUTATION

  const [addBlockUserFn, { loading: addBlockUserLoading }] = useMutation<
    AddBlockUser,
    AddBlockUserVariables
  >(ADD_BLOCK_USER, {
    update(cache, { data: { addBlockUser } }) {
      try {
        const matchData = cache.readQuery<GetMatches, GetMatchesVariables>({
          query: GET_MATCHES,
        });
        if (matchData) {
          matchData.getMatches.matches = matchData.getMatches.matches.filter(
            (i) =>
              i.isHost
                ? i.guest.uuid !== addBlockUser.blockedUser.uuid
                : i.host.uuid !== addBlockUser.blockedUser.uuid
          );
          cache.writeQuery({
            query: GET_MATCHES,
            data: matchData,
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const blockedUserData = cache.readQuery<GetBlockedUser>({
          query: GET_BLOCkED_USER,
        });
        if (blockedUserData) {
          blockedUserData.getBlockedUser.blockedUsers.unshift(
            addBlockUser.blockedUser
          );
          cache.writeQuery({
            query: GET_BLOCkED_USER,
            data: blockedUserData,
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const userData = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid: me.user.uuid },
        });
        if (userData) {
          userData.userProfile.user.blockedUserCount =
            userData.userProfile.user.blockedUserCount + 1;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid: me.user.uuid },
            data: userData,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  const [registerPushFn, { loading: registerPushLoading }] = useMutation<
    RegisterPush,
    RegisterPushVariables
  >(REGISTER_PUSH);

  const [unMatchFn, { loading: unMatchLoading }] = useMutation<
    UnMatch,
    UnMatchVariables
  >(UNMATCH, {
    update(cache, { data: { unMatch } }) {
      try {
        const matchData = cache.readQuery<GetMatches, GetMatchesVariables>({
          query: GET_MATCHES,
        });
        if (matchData) {
          matchData.getMatches.matches = matchData.getMatches.matches.filter(
            (i) => parseInt(i.id, 10) !== unMatch.matchId
          );
          cache.writeQuery({
            query: GET_MATCHES,
            data: matchData,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  const [reportLocationFn, { loading: reportLocationLoading }] = useMutation<
    ReportLocation,
    ReportLocationVariables
  >(REPORT_LOCATION);

  const [MarkAsReadMatchFn, { loading: MarkAsReadMatchLoading }] = useMutation<
    MarkAsReadMatch,
    MarkAsReadMatchVariables
  >(MARK_AS_READ_MATCH, {
    update(cache, { data: { markAsReadMatch } }) {
      try {
        const matchData = cache.readQuery<GetMatches, GetMatchesVariables>({
          query: GET_MATCHES,
        });
        if (matchData) {
          matchData.getMatches.matches.find(
            (i) => i.id === markAsReadMatch.matchId
          ).isReadByHost = markAsReadMatch.isReadByHost;
          matchData.getMatches.matches.find(
            (i) => i.id === markAsReadMatch.matchId
          ).isReadByGuest = markAsReadMatch.isReadByGuest;
          cache.writeQuery({
            query: GET_MATCHES,
            data: matchData,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  // QUERY

  const {
    data: { getMatches: { matches = null } = {} } = {},
    loading: matchLoading,
    refetch: matchRefetch,
  } = useQuery<GetMatches, GetMatchesVariables>(GET_MATCHES);

  // FUNC

  const askPermission = async () => {
    const { status: locationStatus } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    const { locationServicesEnabled } = await Location.getProviderStatusAsync();
    if (locationServicesEnabled) {
      if (Platform.OS === "ios" && locationStatus === "denied") {
        Alert.alert(
          "Permission Denied",
          "To enable location, tap Open Settings, then tap on Location, and finally tap on While Using the App.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openURL("app-settings:");
              },
            },
          ]
        );
      } else if (Platform.OS === "android" && locationStatus === "denied") {
        Alert.alert(
          "Permission Denied",
          "To enable location, tap Open Settings, then tap on Permissions, then tap on Location, and finally tap on Allow only while using the app.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => {
                const pkg = Constants.manifest.releaseChannel
                  ? Constants.manifest.android.package
                  : "host.exp.exponent";
                IntentLauncher.startActivityAsync(
                  IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                  { data: "package:" + pkg }
                );
              },
            },
          ]
        );
      } else if (locationStatus === "granted") {
        const position = await Location.getCurrentPositionAsync({
          timeout: 5000,
        });
        handleGeoSuccess(position);
      } else {
        return;
      }
    } else {
      Alert.alert("Location permission required.");
    }
    const { status: notificationStatus } = await Permissions.askAsync(
      Permissions.NOTIFICATIONS
    );
    if (Platform.OS === "ios" && notificationStatus === "denied") {
      Alert.alert(
        "Permission Denied",
        "To enable notification, tap Open Settings, then tap on Notifications, and finally tap on Allow Notifications.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openURL("app-settings:");
            },
          },
        ]
      );
    } else if (Platform.OS === "android" && notificationStatus === "denied") {
      Alert.alert(
        "Permission Denied",
        "To enable notification, tap Open Settings, then tap on Notifications, and finally tap on Show notifications.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => {
              const pkg = Constants.manifest.releaseChannel
                ? Constants.manifest.android.package
                : "host.exp.exponent";
              IntentLauncher.startActivityAsync(
                IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                { data: "package:" + pkg }
              );
            },
          },
        ]
      );
    } else if (notificationStatus === "granted") {
      let pushToken = await Notifications.getExpoPushTokenAsync();
      const { data: serverData } = await registerPushFn({
        variables: { pushToken },
      });
    } else {
      return;
    }
  };

  const handleGeoSuccess = (position) => {
    const {
      coords: { latitude, longitude },
    } = position;
    getAddress(latitude, longitude);
  };

  const getAddress = async (latitude: number, longitude: number) => {
    try {
      const address = await useReverseGeoCode(latitude, longitude);
      if (address) {
        const cityInfo = await useReversePlaceId(
          address.storableLocation.cityId
        );
        await reportLocationFn({
          variables: {
            currentLat: cityInfo.storableLocation.latitude,
            currentLng: cityInfo.storableLocation.longitude,
            currentCityId: address.storableLocation.cityId,
            currentCityName: address.storableLocation.cityName,
            currentCountryCode: address.storableLocation.countryCode,
          },
        });
        // await AsyncStorage.setItem("cityId", address.storableLocation.cityId);
        // await AsyncStorage.setItem(
        //   "countryCode",
        //   address.storableLocation.countryCode
        // );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await matchRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
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

  const { showActionSheetWithOptions } = useActionSheet();

  const unMatch = (matchId: string) => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        showSeparators: true,
        title: "Are you sure to unmatch?",
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
          try {
            const {
              data: { unMatch },
            } = await unMatchFn({
              variables: { matchId: parseInt(matchId, 10) },
            });
            if (unMatch.ok) {
              chat_leave(matchId, me.user.uuid, me.user.username);
              toast("unmatched");
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  };

  const blockedUser = (uuid: string, matchId: string) => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        showSeparators: true,
        title: "Are you sure to block user?",
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
          try {
            const {
              data: { addBlockUser },
            } = await addBlockUserFn({
              variables: { uuid },
            });
            if (addBlockUser.ok) {
              chat_leave(matchId, me.user.uuid, me.user.username);
              toast("blocked user");
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  };

  fb_db.ref.child("chats").on("child_added", (child) => {
    if (child.val()) {
      if (child.val()["lastSender"] === "system") {
        matchRefetch();
      } else {
        return;
      }
    }
  });

  useEffect(() => {
    askPermission();
  }, []);

  return (
    <MatchPresenter
      matchLoading={matchLoading}
      meLoading={meLoading}
      me={me}
      refreshing={refreshing}
      onRefresh={onRefresh}
      matches={matches}
      unMatchLoading={unMatchLoading}
      addBlockUserLoading={addBlockUserLoading}
      MarkAsReadMatchFn={MarkAsReadMatchFn}
      unMatch={unMatch}
      blockedUser={blockedUser}
    />
  );
};
