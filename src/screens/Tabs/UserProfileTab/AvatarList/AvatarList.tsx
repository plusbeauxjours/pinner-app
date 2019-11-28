import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import { ScreenOrientation } from "expo";
import { RefreshControl, FlatList, Modal } from "react-native";
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
import ImageViewer from "react-native-image-zoom-viewer";
import { useTheme } from "../../../../context/ThemeContext";
import { Entypo } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { GET_USER } from "../UserProfile/UserProfileQueries";
import { ME } from "../../../../sharedQueries";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Bold = styled.Text`
  font-weight: 400;
  font-size: 16;
  color: ${props => props.theme.color};
`;

const Touchable = styled.TouchableOpacity``;
const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
`;
const ScrollView = styled.ScrollView`
  background-color: ${props => props.theme.bgColor};
`;
const FooterIconTouchable = styled.TouchableOpacity`
  margin-left: 20px;
  margin-bottom: 20px;
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
  const username = navigation.getParam("username") || me.user.username;
  const isSelf = navigation.getParam("isSelf") || me.user.username === username;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<any>({});
  const {
    data: { getAvatars: { avatars = null } = {} } = {},
    loading: avatarLoading,
    refetch: avatarRefetch
  } = useQuery<GetAvatars, GetAvatarsVariables>(GET_AVATARS, {
    variables: { userName: username }
  });
  const [deleteAvatarFn, { loading: deleteAvatarLoading }] = useMutation<
    DeleteAvatar,
    DeleteAvatarVariables
  >(DELETE_AVATAR, {
    update(cache, { data: { deleteAvatar } }) {
      try {
        const data = cache.readQuery<GetAvatars, GetAvatarsVariables>({
          query: GET_AVATARS,
          variables: { userName: username }
        });
        if (data) {
          data.getAvatars.avatars = data.getAvatars.avatars.filter(
            i => i.uuid !== deleteAvatar.uuid
          );
          cache.writeQuery({
            query: GET_AVATARS,
            variables: { userName: username },
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
          variables: { username }
        });
        if (data) {
          data.userProfile.user.profile.avatarUrl = markAsMain.avatar.thumbnail;
          cache.writeQuery({
            query: GET_USER,
            variables: { username },
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
          variables: { userName: username }
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
            variables: { userName: username },
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
    showActionSheetWithOptions(
      {
        options: ["Mark As Main", "Delete Avatar", "Cancel"],
        cancelButtonIndex: 2,
        showSeparators: true
      },
      buttonIndex => {
        if (buttonIndex === 0 && !deleteAvatarLoading && !markAsMainLoading) {
          markAsMainFn({ variables: { uuid: avatar.uuid } });
        } else if (buttonIndex === 1) {
          onConfirmPress();
        } else {
          null;
        }
      }
    );
  };
  const onConfirmPress = () => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1
      },
      buttonIndex => {
        if (buttonIndex === 0 && !deleteAvatarLoading && !markAsMainLoading) {
          deleteAvatar(avatar.uuid);
        } else {
          null;
        }
      }
    );
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {avatars && avatars.length !== 0 ? (
          <>
            <Modal visible={modalOpen} transparent={true}>
              <ImageViewer
                imageUrls={[{ url: `${BACKEND_URL}/media/${avatar.image}` }]}
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
                  );
                }}
                onSwipeDown={async () => {
                  await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT_UP
                  );
                  closeModal();
                }}
                renderFooter={() => {
                  if (isSelf && !avatar.isMain && !avatarLoading) {
                    return (
                      <FooterIconTouchable
                        onPress={() => {
                          onPress();
                        }}
                      >
                        <Entypo
                          size={25}
                          color={"#999"}
                          name={"dots-three-horizontal"}
                        />
                      </FooterIconTouchable>
                    );
                  } else {
                    return null;
                  }
                }}
                backgroundColor={
                  isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
                }
                enableSwipeDown={true}
                loadingRender={() => {
                  return <Loader />;
                }}
                //@ts-ignore
                renderIndicator={() => {}}
              />
            </Modal>
            {/* {isSelf && !avatar.isMain && (
              <Button
                title="DELETE AVATAR"
                onPress={() => deleteAvatar(avatar.uuid)}
              />
            )}
            {isSelf && !avatar.isMain && (
              <Button
                title="MARK AS MAIN"
                onPress={() =>
                  markAsMainFn({ variables: { uuid: avatar.uuid } })
                }
              />
            )}
            <Button title="CLOSE AVATAR" onPress={() => closeModal()} />
          </Modal> */}
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
          <View>
            <Bold>No avatars yet...</Bold>
          </View>
        )}
      </ScrollView>
    );
  }
};
