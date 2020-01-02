import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Constants from "expo-constants";
import {
  RefreshControl,
  Platform,
  Alert,
  Linking,
  AsyncStorage
} from "react-native";
import { MARK_AS_READ_MATCH } from "./MatchQueries";
import { SwipeListView } from "react-native-swipe-list-view";
import * as IntentLauncher from "expo-intent-launcher";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Toast from "react-native-root-toast";
import { useQuery, useMutation } from "react-apollo-hooks";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
import { GET_MATCHES } from "./MatchQueries";
import { GET_BLOCkED_USER } from "../../UserProfileTab/BlockedUsers/BlockedUsersQueries";
import { UNMATCH } from "../../../../components/CoffeeBtn/CoffeeBtnQueries";
import { chat_leave, fb_db } from "../../../../../Fire";
import {
  REGISTER_PUSH,
  ADD_BLOCK_USER,
  ME,
  REPORT_LOCATION
} from "../../../../sharedQueries";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import { GET_USER } from "../../UserProfileTab/UserProfile/UserProfileQueries";
import {
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
  UserProfileVariables
} from "../../../../types/api";
import constants from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";
import {
  Me,
  ReportLocation,
  ReportLocationVariables
} from "../../../../types/api";
import { useReverseGeoCode } from "../../../../hooks/useReverseGeoCode";
import { useReversePlaceId } from "../../../../hooks/useReversePlaceId";

const TextContainer = styled.View`
  margin-top: 15px;
  justify-content: center;
  align-items: center;
`;
const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  padding: 0 10px 0 10px;
`;
const Touchable = styled.TouchableOpacity``;
const Text = styled.Text`
  color: ${props => props.theme.color};
  font-size: 8px;
  margin-left: 5px;
`;
const UserContainer = styled.View`
  padding: 0 5px 0 5px;
`;
const Item = styled.View`
  flex: 1;
  margin-bottom: 25px;
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
const SmallText = styled.Text`
  color: #999;
  text-align: center;
  font-size: 8px;
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
const TouchableBackRow = styled.View`
  background-color: ${props => props.theme.bgColor};
`;
export default ({ navigation }) => {
  const {
    data: { me = null },
    loading: meLoading
  } = useQuery<Me>(ME);
  const isDarkMode = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [addBlockUserFn, { loading: addBlockUserLoading }] = useMutation<
    AddBlockUser,
    AddBlockUserVariables
  >(ADD_BLOCK_USER, {
    update(cache, { data: { addBlockUser } }) {
      try {
        const matchData = cache.readQuery<GetMatches, GetMatchesVariables>({
          query: GET_MATCHES
        });
        if (matchData) {
          matchData.getMatches.matches = matchData.getMatches.matches.filter(
            i =>
              i.isHost
                ? i.guest.profile.uuid !== addBlockUser.blockedUser.uuid
                : i.host.profile.uuid !== addBlockUser.blockedUser.uuid
          );
          cache.writeQuery({
            query: GET_MATCHES,
            data: matchData
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const blockedUserData = cache.readQuery<GetBlockedUser>({
          query: GET_BLOCkED_USER
        });
        if (blockedUserData) {
          blockedUserData.getBlockedUser.blockedUsers.unshift(
            addBlockUser.blockedUser
          );
          cache.writeQuery({
            query: GET_BLOCkED_USER,
            data: blockedUserData
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const userData = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid: me.user.profile.uuid }
        });
        if (userData) {
          userData.userProfile.user.profile.blockedUserCount =
            userData.userProfile.user.profile.blockedUserCount + 1;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid: me.user.profile.uuid },
            data: userData
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const [registerPushFn, { loading: registerPushLoading }] = useMutation<
    RegisterPush,
    RegisterPushVariables
  >(REGISTER_PUSH);
  const askPermission = async () => {
    try {
      const { status: existingLocationStatus } = await Permissions.getAsync(
        Permissions.LOCATION
      );
      let finalLocationStatus = existingLocationStatus;
      if (Platform.OS === "ios" && existingLocationStatus === "denied") {
        Alert.alert(
          "Permission Denied",
          "To enable location, tap Open Settings, then tap on Location, and finally tap on While Using the App.",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openURL("app-settings:");
              }
            }
          ]
        );
      } else if (Platform.OS !== "ios" && existingLocationStatus === "denied") {
        Alert.alert(
          "Permission Denied",
          "To enable location, tap Open Settings, then tap on Pinner, then tap on Permissions, and finally tap on Allow only while using the app.",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Open Settings",
              onPress: () => {
                IntentLauncher.startActivityAsync(
                  IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
                );
              }
            }
          ]
        );
      } else if (existingLocationStatus !== "granted") {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        finalLocationStatus = status;
      } else if (finalLocationStatus !== "granted") {
        return;
      } else if (finalLocationStatus === "granted") {
        navigator.geolocation.getCurrentPosition(
          handleGeoSuccess,
          handleGeoError
        );
      } else {
        return;
      }
    } catch (e) {
      console.log(e);
    }
    try {
      const { status: existingNotificationStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalNotificationStatus = existingNotificationStatus;
      if (Platform.OS === "ios" && existingNotificationStatus === "denied") {
        Alert.alert(
          "Permission Denied",
          "To enable notification, tap Open Settings, then tap on Notifications, and finally tap on Allow Notifications.",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openURL("app-settings:");
              }
            }
          ]
        );
      } else if (
        Platform.OS !== "ios" &&
        existingNotificationStatus === "denied"
      ) {
        Alert.alert(
          "Permission Denied",
          "To enable notification, tap Open Settings, then tap on Notifications, and finally tap on Show notifications.",
          [
            {
              text: "Cancel",
              style: "cancel"
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
              }
            }
          ]
        );
      } else if (existingNotificationStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalNotificationStatus = status;
      } else if (finalNotificationStatus !== "granted") {
        return;
      } else {
        return;
      }

      let pushToken = await Notifications.getExpoPushTokenAsync();
      const { data: serverData } = await registerPushFn({
        variables: { pushToken }
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleGeoSuccess = (position: Position) => {
    const {
      coords: { latitude, longitude }
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
            currentCountryCode: address.storableLocation.countryCode
          }
        });
        await AsyncStorage.setItem("cityId", address.storableLocation.cityId);
        await AsyncStorage.setItem(
          "countryCode",
          address.storableLocation.countryCode
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleGeoError = () => {
    console.log("No location");
  };
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
          query: GET_MATCHES
        });
        if (matchData) {
          matchData.getMatches.matches.find(
            i => i.id === markAsReadMatch.matchId
          ).isReadByHost = markAsReadMatch.isReadByHost;
          matchData.getMatches.matches.find(
            i => i.id === markAsReadMatch.matchId
          ).isReadByGuest = markAsReadMatch.isReadByGuest;
          cache.writeQuery({
            query: GET_MATCHES,
            data: matchData
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });

  const {
    data: { getMatches: { matches = null } = {} } = {},
    loading: matchLoading,
    refetch: matchRefetch
  } = useQuery<GetMatches, GetMatchesVariables>(GET_MATCHES);

  const [unMatchFn, { loading: unMatchLoading }] = useMutation<
    UnMatch,
    UnMatchVariables
  >(UNMATCH, {
    update(cache, { data: { unMatch } }) {
      try {
        const matchData = cache.readQuery<GetMatches, GetMatchesVariables>({
          query: GET_MATCHES
        });
        if (matchData) {
          matchData.getMatches.matches = matchData.getMatches.matches.filter(
            i => parseInt(i.id, 10) !== unMatch.matchId
          );
          cache.writeQuery({
            query: GET_MATCHES,
            data: matchData
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
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
      delay: 0
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
          marginBottom: 10
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400"
        },
        separatorStyle: { opacity: 0.5 }
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          try {
            const {
              data: { unMatch }
            } = await unMatchFn({
              variables: { matchId: parseInt(matchId, 10) }
            });
            if (unMatch.ok) {
              chat_leave(matchId, me.user.profile.uuid, me.user.username);
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
          marginBottom: 10
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400"
        },
        separatorStyle: { opacity: 0.5 }
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          try {
            const {
              data: { addBlockUser }
            } = await addBlockUserFn({
              variables: { uuid }
            });
            if (addBlockUser.ok) {
              chat_leave(matchId, me.user.profile.uuid, me.user.username);
              toast("blocked user");
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  };
  fb_db.ref.child("chats").on("child_added", child => {
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
  if (matchLoading || meLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
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
        <Container>
          {matches && matches.length !== 0 && me ? (
            <Item>
              <UserContainer>
                <SwipeListView
                  useFlatList={false}
                  closeOnRowBeginSwipe={true}
                  data={matches}
                  previewOpenValue={1000}
                  renderItem={data => (
                    <TouchableBackRow key={data.index}>
                      <Touchable
                        disabled={unMatchLoading || addBlockUserLoading}
                        onPress={() => {
                          MarkAsReadMatchFn({
                            variables: { matchId: parseInt(data.item.id, 10) }
                          }),
                            navigation.navigate("Chat", {
                              chatId: data.item.id,
                              userId: me.user.profile.uuid,
                              receiverId: data.item.isHost
                                ? data.item.guest.profile.uuid
                                : data.item.host.profile.uuid,
                              receiverAvatar: data.item.isHost
                                ? data.item.guest.profile.appAvatarUrl
                                : data.item.host.profile.appAvatarUrl,
                              receiverPushToken: data.item.isHost
                                ? data.item.guest.profile.pushToken
                                : data.item.host.profile.pushToken,
                              uuid: me.user.profile.uuid,
                              userName: me.user.username,
                              userUrl: me.user.profile.appAvatarUrl,
                              targetUuid: data.item.isHost
                                ? data.item.guest.profile.uuid
                                : data.item.host.profile.uuid,
                              isDarkMode: isDarkMode,
                              latitude: me.user.profile.currentCity.latitude,
                              longitude: me.user.profile.currentCity.longitude
                            });
                        }}
                      >
                        <UserRow match={data.item} type={"match"} />
                      </Touchable>
                    </TouchableBackRow>
                  )}
                  renderHiddenItem={data => (
                    <RowBack>
                      <BackLeftBtn
                        disabled={unMatchLoading}
                        onPress={() => unMatch(data.item.id)}
                      >
                        <IconContainer>
                          <SmallText>UN MATCH</SmallText>
                        </IconContainer>
                      </BackLeftBtn>
                      <BackLeftBtn
                        disabled={addBlockUserLoading}
                        onPress={() =>
                          blockedUser(data.item.host.profile.uuid, data.item.id)
                        }
                      >
                        <IconContainer>
                          <SmallText>BLOCK USER</SmallText>
                        </IconContainer>
                      </BackLeftBtn>
                    </RowBack>
                  )}
                  leftOpenValue={91}
                  keyExtractor={item => item.id}
                />
              </UserContainer>
            </Item>
          ) : (
            <TextContainer>
              <Text>
                You don't have any matches. Please swipe to right to find
                someone.
              </Text>
            </TextContainer>
          )}
        </Container>
      </ScrollView>
    );
  }
};
