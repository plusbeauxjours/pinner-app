import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import { ScreenOrientation } from "expo";
import { RefreshControl, FlatList, Modal } from "react-native";
import styled from "styled-components";
import { useMe } from "../../../../context/MeContext";
import { GET_AVATARS, DELETE_AVATAR, MARK_AS_MAIN } from "./AvatarListQueries";
import {
  GetAvatars,
  GetAvatarsVariables,
  DeleteAvatar,
  DeleteAvatarVariables,
  MarkAsMain,
  MarkAsMainVariables
} from "../../../../types/api";
import Loader from "../../../../components/Loader";
import constants, { BACKEND_URL } from "../../../../../constants";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import ImageViewer from "react-native-image-zoom-viewer";
import { useTheme } from "../../../../context/ThemeContext";
import { Entypo } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  position: absolute;
  padding: 5px 0 0 5px;
  color: ${props => props.theme.color};
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
  >(DELETE_AVATAR);
  const [markAsMainFn, { loading: markAsMainLoading }] = useMutation<
    MarkAsMain,
    MarkAsMainVariables
  >(MARK_AS_MAIN);
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
        if (buttonIndex === 0) {
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
        if (buttonIndex === 0) {
          deleteAvatar(avatar.uuid);
        } else {
          null;
        }
      }
    );
  };
  if (avatarLoading || deleteAvatarLoading || meLoading) {
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
                  isDarkMode && isDarkMode === true ? "black" : "white"
                }
                enableSwipeDown={true}
                loadingRender={() => {
                  return <Loader />;
                }}
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
                      {item.isMain && isSelf && <Text>M</Text>}
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
