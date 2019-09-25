import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import { ScrollView, RefreshControl, FlatList } from "react-native";
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

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
`;

export default () => {
  const me = useMe();
  const location = useLocation();
  const [uuid, setUuid] = useState();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [file, setFile] = useState();
  const [imagePreviewUrl, setImagePreviewUrl] = useState();
  const {
    data: avatarData,
    loading: avatarLoading,
    refetch: avatarRefetch
  } = useQuery<GetAvatars, GetAvatarsVariables>(GET_AVATARS, {
    variables: { userName: "devilishPlusbeauxjours" }
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
          {avatarData.getAvatars.avatars &&
            avatarData.getAvatars.avatars.map((avatar, index) => (
              <Text key={index}>{avatar.uuid}</Text>
            ))}
        </View>
      )}
    </ScrollView>
  );
};
