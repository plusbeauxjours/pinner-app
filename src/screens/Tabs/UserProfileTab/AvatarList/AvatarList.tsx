import React, { useState } from "react";
import Modal from "react-native-modal";
import { useQuery, useMutation } from "react-apollo-hooks";
import { RefreshControl, FlatList, Image, Button } from "react-native";
import styled from "styled-components";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import {
  GET_AVATARS,
  UPLOAD_AVATAR,
  DELETE_AVATAR,
  MARK_AS_MAIN
} from "./AvatarListQueries";
import {
  GetAvatars,
  GetAvatarsVariables,
  UploadAvatar,
  UploadAvatarVariables,
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

const View = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
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
const Container = styled.View``;
const ScrollView = styled.ScrollView`
  background-color: ${props => props.theme.bgColor};
`;

export default ({ navigation }) => {
  const me = useMe();
  const isDarkMode = useTheme();
  const location = useLocation();
  const [username, setUsername] = useState<string>(
    navigation.getParam("username") || me.user.username
  );
  const isSelf = navigation.getParam("isSelf") || me.user.username === username;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<any>({});
  const [file, setFile] = useState();
  const [imagePreviewUrl, setImagePreviewUrl] = useState();
  const {
    data: avatarData,
    loading: avatarLoading,
    refetch: avatarRefetch
  } = useQuery<GetAvatars, GetAvatarsVariables>(GET_AVATARS, {
    variables: { userName: username }
  });
  const [uploadAvatarFn, { loading: uploadLoading }] = useMutation<
    UploadAvatar,
    UploadAvatarVariables
  >(UPLOAD_AVATAR, { variables: { file } });
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
          <Modal
            style={{ margin: 0, alignItems: "center" }}
            isVisible={modalOpen}
            backdropColor={
              isDarkMode && isDarkMode === true ? "black" : "white"
            }
            onBackdropPress={() => setModalOpen(false)}
            onBackButtonPress={() =>
              Platform.OS !== "ios" && setModalOpen(false)
            }
            onModalHide={() => setModalOpen(false)}
            propagateSwipe={true}
            scrollHorizontal={true}
            backdropOpacity={0.9}
          >
            <ProgressiveImage
              style={{
                height: constants.width,
                width: constants.width,
                padding: 0,
                margin: 0
              }}
              preview={{ uri: `${BACKEND_URL}/media/${avatar.thumbnail}` }}
              uri={`${BACKEND_URL}/media/${avatar.image}`}
            />
            {isSelf && !avatar.isMain && (
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
          </Modal>
          <View>
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
          </View>
        </>
      )}
    </ScrollView>
  );
};
