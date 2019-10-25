import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import { ScreenOrientation } from "expo";
import { RefreshControl, FlatList, Image, Button, Modal } from "react-native";
import styled from "styled-components";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
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
import { Platform } from "react-native";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import { useTheme } from "../../../../context/ThemeContext";
import ImageViewer from "react-native-image-zoom-viewer";

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
  font-weight: 500;
  font-size: 20;
  color: ${props => props.theme.color};
`;

const Touchable = styled.TouchableOpacity``;
const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
`;
const ScrollView = styled.ScrollView`
  background-color: ${props => props.theme.bgColor};
`;

export default ({ navigation }) => {
  const me = useMe();
  const isDarkMode = useTheme();
  const location = useLocation();
  const username = navigation.getParam("username") || me.user.username;
  const isSelf = navigation.getParam("isSelf") || me.user.username === username;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<any>({});
  const {
    data: avatarData,
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
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {avatarLoading || deleteAvatarLoading || markAsMainLoading ? (
        <Loader />
      ) : (
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
              saveToLocalByLongPress={true}
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
              onSave={() => alert("Image Saved to Gallery")}
              onSwipeDown={async () => {
                await ScreenOrientation.lockAsync(
                  ScreenOrientation.OrientationLock.PORTRAIT_UP
                );
                closeModal();
              }}
              enableSwipeDown={true}
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
              data={avatarData.getAvatars.avatars}
              renderItem={({ item }) => (
                <Container
                  style={{
                    margin: 0.5
                  }}
                >
                  <Touchable onPress={() => openModal(item)}>
                    <Image
                      style={{
                        height: constants.width / 3 - 1,
                        width: constants.width / 3 - 1
                      }}
                      source={
                        item.thumbnail && {
                          uri: `${BACKEND_URL}/media/${item.thumbnail}`
                        }
                      }
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
      )}
    </ScrollView>
  );
};
