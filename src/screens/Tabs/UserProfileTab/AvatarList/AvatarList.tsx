import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import { ScrollView, RefreshControl, FlatList, Image } from "react-native";
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

const View = styled.View`
  flex: 1;
`;

const Text = styled.Text``;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
`;

const Container = styled.TouchableOpacity``;
const Touchable = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export default ({ navigation }) => {
  const me = useMe();
  const location = useLocation();
  const [username, setUsername] = useState<string>(
    navigation.getParam("username") || me.user.username
  );
  const [uuid, setUuid] = useState();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [file, setFile] = useState();
  const [imagePreviewUrl, setImagePreviewUrl] = useState();
  const {
    data: avatarData,
    loading: avatarLoading,
    refetch: avatarRefetch
  } = useQuery<GetAvatars, GetAvatarsVariables>(GET_AVATARS, {
    variables: { userName: username }
  });
  const [uploadAvatarFn] = useMutation<UploadAvatar, UploadAvatarVariables>(
    UPLOAD_AVATAR,
    { variables: { file } }
  );
  const [deleteAvatarFn] = useMutation<DeleteAvatar, DeleteAvatarVariables>(
    DELETE_AVATAR,
    { variables: { uuid } }
  );
  const [markAsMainFn] = useMutation<MarkAsMain, MarkAsMainVariables>(
    MARK_AS_MAIN,
    { variables: { uuid } }
  );
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
  useEffect(() => {
    setUsername(navigation.getParam("username") || me.user.username);
  }, [navigation]);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {avatarLoading ? (
        <Loader />
      ) : (
        <View>
          <Bold>AvatarList</Bold>
          <FlatList
            data={avatarData.getAvatars.avatars}
            renderItem={({ item }) => (
              <Touchable
                style={{ flex: 1, flexDirection: "column", margin: 1 }}
              >
                <Container>
                  <Image
                    style={{
                      height: constants.width / 3 - 2,
                      width: constants.width / 3 - 2,
                      borderRadius: 8
                    }}
                    source={
                      item.thumbnail && {
                        uri: `${BACKEND_URL}/media/${item.thumbnail}`
                      }
                    }
                  />
                </Container>
              </Touchable>
            )}
            numColumns={3}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </ScrollView>
  );
};
