import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import { ScreenOrientation } from "expo";
import { RefreshControl, FlatList, Platform, Alert } from "react-native";
import Toast from "react-native-root-toast";
import styled from "styled-components";
import { useMe } from "../../../../context/MeContext";
import { GET_AVATARS, DELETE_AVATAR, MARK_AS_MAIN } from "./AvatarListQueries";
import {
  Me,
  GetAvatars,
  GetAvatarsVariables,
  DeleteAvatar,
  DeleteAvatarVariables,
  MarkAsMain,
  MarkAsMainVariables,
  UserProfile,
  UserProfileVariables
} from "../../../../types/api";
import Loader from "../../../../components/Loader";
import constants, { BACKEND_URL } from "../../../../../constants";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import { useTheme } from "../../../../context/ThemeContext";
import Modal from "react-native-modal";
import ImageZoom from "react-native-image-pan-zoom";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { GET_USER } from "../UserProfile/UserProfileQueries";
import { ME } from "../../../../sharedQueries";

const TextContainer = styled.View`
  margin-top: 15px;
  justify-content: center;
  align-items: center;
`;
const Text = styled.Text`
  color: ${props => props.theme.color};
  font-size: 8px;
  margin-left: 5px;
`;
const Touchable = styled.TouchableOpacity``;
const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
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

export default ({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const isDarkMode = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const uuid = navigation.getParam("uuid")
    ? navigation.getParam("uuid")
    : me.user.profile.uuid;
  const isSelf = navigation.getParam("isSelf")
    ? navigation.getParam("isSelf")
    : me.user.profile.uuid === navigation.getParam("uuid") ||
      !navigation.getParam("uuid");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<any>({});
  const {
    data: { getAvatars: { avatars = null } = {} } = {},
    loading: avatarLoading,
    refetch: avatarRefetch
  } = useQuery<GetAvatars, GetAvatarsVariables>(GET_AVATARS, {
    variables: { uuid }
  });
  const [deleteAvatarFn, { loading: deleteAvatarLoading }] = useMutation<
    DeleteAvatar,
    DeleteAvatarVariables
  >(DELETE_AVATAR, {
    update(cache, { data: { deleteAvatar } }) {
      try {
        const data = cache.readQuery<GetAvatars, GetAvatarsVariables>({
          query: GET_AVATARS,
          variables: { uuid }
        });
        if (data) {
          data.getAvatars.avatars = data.getAvatars.avatars.filter(
            i => i.uuid !== deleteAvatar.uuid
          );
          cache.writeQuery({
            query: GET_AVATARS,
            variables: { uuid },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const [markAsMainFn, { loading: markAsMainLoading }] = useMutation<
    MarkAsMain,
    MarkAsMainVariables
  >(MARK_AS_MAIN, {
    update(cache, { data: { markAsMain } }) {
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid }
        });
        if (data) {
          data.userProfile.user.profile.avatarUrl = markAsMain.avatar.thumbnail;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const data = cache.readQuery<Me>({
          query: ME
        });
        if (data) {
          data.me.user.profile.avatarUrl = markAsMain.avatar.thumbnail;
          cache.writeQuery({
            query: ME,
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const data = cache.readQuery<GetAvatars, GetAvatarsVariables>({
          query: GET_AVATARS,
          variables: { uuid }
        });
        if (data) {
          data.getAvatars.avatars.find(
            i => i.uuid === markAsMain.preAvatarUUID
          ).isMain = false;
          data.getAvatars.avatars.find(
            i => i.uuid === markAsMain.newAvatarUUID
          ).isMain = true;
          cache.writeQuery({
            query: GET_AVATARS,
            variables: { uuid },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const openModal = async (item: any) => {
    await setAvatar(item);
    await setModalOpen(true);
  };
  const closeModal = async () => {
    await setAvatar({});
    await setModalOpen(false);
  };
  const deleteAvatar = async (uuid: string) => {
    deleteAvatarFn({ variables: { uuid } });
    setModalOpen(false);
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await avatarRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  const onPress = () => {
    Platform.OS === "ios"
      ? showActionSheetWithOptions(
          {
            options: ["Change main photo", "Delete photo", "Cancel"],
            showSeparators: true,
            cancelButtonIndex: 2
          },
          buttonIndex => {
            if (
              buttonIndex === 0 &&
              !deleteAvatarLoading &&
              !markAsMainLoading
            ) {
              markAsMainFn({ variables: { uuid: avatar.uuid } });
              setModalOpen(false);
              toast("Main photo changed");
            } else if (buttonIndex === 1) {
              onConfirmPress();
            } else {
              null;
            }
          }
        )
      : Alert.alert("Options", "Please tap an option.", [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Change main photo",
            onPress: () => {
              !deleteAvatarLoading &&
                !markAsMainLoading &&
                markAsMainFn({ variables: { uuid: avatar.uuid } });
              setModalOpen(false);
              toast("Main photo changed");
            }
          },
          {
            text: "Delete photo",
            onPress: () => {
              onConfirmPress();
            }
          }
        ]);
  };
  const onConfirmPress = () => {
    Platform.OS === "ios"
      ? showActionSheetWithOptions(
          {
            options: ["Yes", "No"],
            destructiveButtonIndex: 0,
            showSeparators: true,
            cancelButtonIndex: 1
          },
          buttonIndex => {
            if (
              buttonIndex === 0 &&
              !deleteAvatarLoading &&
              !markAsMainLoading
            ) {
              deleteAvatar(avatar.uuid);
              toast("Photo deleted");
            } else {
              null;
            }
          }
        )
      : Alert.alert(
          "Delete Photo",
          "Once you delete your photo, there is no going back. Please be certain to delete photo. Are you sure to delete this photo?",
          [
            {
              text: "No",
              style: "cancel"
            },
            {
              text: "Yes",
              onPress: () => {
                !deleteAvatarLoading &&
                  !markAsMainLoading &&
                  deleteAvatar(avatar.uuid);
                toast("Photo deleted");
              }
            }
          ]
        );
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
  if (avatarLoading || meLoading) {
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
        {avatars && avatars.length !== 0 ? (
          <>
            <Modal
              style={{ margin: 0, alignItems: "flex-start", zIndex: 10 }}
              isVisible={modalOpen}
              backdropColor={
                isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
              }
              onBackdropPress={async () => {
                await ScreenOrientation.lockAsync(
                  ScreenOrientation.OrientationLock.PORTRAIT_UP
                );
                closeModal();
              }}
              onBackButtonPress={async () => {
                Platform.OS === "android" &&
                  (await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT_UP
                  ));
                closeModal();
              }}
              onModalHide={async () => {
                {
                  await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT_UP
                  );
                  closeModal();
                }
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
              <ImageZoom
                cropWidth={constants.width}
                cropHeight={constants.width}
                imageWidth={constants.width}
                imageHeight={constants.width}
                onClick={() => {
                  isSelf && !avatar.isMain && !avatarLoading && onPress();
                }}
              >
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
                    uri: `${BACKEND_URL}/media/${avatar.thumbnail}`
                  }}
                  uri={`${BACKEND_URL}/media/${avatar.image}`}
                />
              </ImageZoom>
            </Modal>
            <Container>
              <FlatList
                data={avatars}
                renderItem={({ item }) => (
                  <Container
                    style={{
                      margin: 0.5
                    }}
                  >
                    <Touchable
                      disabled={!item.image && true}
                      onPress={() => {
                        item.image && openModal(item);
                      }}
                    >
                      {item.isMain && isSelf ? (
                        <ProgressiveImage
                          tint={isDarkMode ? "dark" : "light"}
                          style={{
                            height: constants.width / 3 - 1,
                            width: constants.width / 3 - 1,
                            borderRadius: constants.width / 3 / 2
                          }}
                          preview={{
                            uri: `${BACKEND_URL}/media/${item.thumbnail}`
                          }}
                          uri={`${BACKEND_URL}/media/${item.thumbnail}`}
                        />
                      ) : (
                        <ProgressiveImage
                          tint={isDarkMode ? "dark" : "light"}
                          style={{
                            height: constants.width / 3 - 1,
                            width: constants.width / 3 - 1
                          }}
                          preview={{
                            uri: `${BACKEND_URL}/media/${item.thumbnail}`
                          }}
                          uri={`${BACKEND_URL}/media/${item.thumbnail}`}
                        />
                      )}
                    </Touchable>
                  </Container>
                )}
                numColumns={3}
                keyExtractor={item => item.id}
              />
            </Container>
          </>
        ) : (
          <TextContainer>
            <Text>No photo yet...</Text>
          </TextContainer>
        )}
      </ScrollView>
    );
  }
};
