import React from "react";
import uuid from "uuid/v4";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";
import {
  Me,
  UploadAvatar,
  UploadAvatarVariables,
  GetAvatars,
  GetAvatarsVariables,
  UserProfile,
  UserProfileVariables
} from "../types/api";
import { UPLOAD_AVATAR, ME } from "../sharedQueries";
import { useMutation } from "react-apollo";
import { ReactNativeFile } from "apollo-upload-client";
import { useTheme } from "../context/ThemeContext";
import Toast from "react-native-root-toast";
import { useMe } from "../context/MeContext";
import { GET_AVATARS } from "../screens/Tabs/UserProfileTab/AvatarList/AvatarListQueries";
import { GET_USER } from "../screens/Tabs/UserProfileTab/UserProfile/UserProfileQueries";

const Container = styled.TouchableOpacity`
  margin-bottom: 7px;
  margin-left: 15px;
  width: 50px;
`;

export default withNavigation(({ navigation }) => {
  const { me } = useMe();
  const isDarkMode = useTheme();
  const [uploadAvatarFn, { loading: uploadAvatarLoading }] = useMutation<
    UploadAvatar,
    UploadAvatarVariables
  >(UPLOAD_AVATAR, {
    update(cache, { data: { uploadAvatar } }) {
      try {
        const data = cache.readQuery<GetAvatars, GetAvatarsVariables>({
          query: GET_AVATARS,
          variables: { uuid: me.user.profile.uuid }
        });
        if (data) {
          data.getAvatars.avatars.unshift(uploadAvatar.avatar);
          data.getAvatars.avatars.find(
            i => i.uuid === uploadAvatar.preAvatarUUID
          ).isMain = false;
          data.getAvatars.avatars.find(
            i => i.uuid === uploadAvatar.newAvatarUUID
          ).isMain = true;
          cache.writeQuery({
            query: GET_AVATARS,
            variables: { uuid: me.user.profile.uuid },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid: me.user.profile.uuid }
        });
        if (data) {
          data.userProfile.user.profile.avatarUrl =
            uploadAvatar.avatar.thumbnail;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid: me.user.profile.uuid },
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
          data.me.user.profile.avatarUrl = uploadAvatar.avatar.thumbnail;
          cache.writeQuery({
            query: ME,
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const image_resize = async (
    uri: string,
    orig_width: number,
    orig_height: number
  ) => {
    if (orig_width > 960 || orig_height > 960) {
      let manipResult;
      if (orig_width / 960 >= orig_height / 960) {
        manipResult = await ImageManipulator.manipulateAsync(uri, [
          { resize: { width: 960 } }
        ]);
      } else {
        manipResult = await ImageManipulator.manipulateAsync(uri, [
          { resize: { height: 960 } }
        ]);
      }
      return manipResult.uri;
    } else {
      return uri;
    }
  };
  const pickFromGallery = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1
        });
        if (result.cancelled !== true) {
          const resized_uri = await image_resize(
            result.uri,
            result.width,
            result.height
          );
          const name = uuid();
          const [, type] = resized_uri.split(".");
          const file = new ReactNativeFile({
            uri: resized_uri,
            type: type.toLowerCase(),
            name
          });
          console.log(file);
          try {
            const {
              data: { uploadAvatar }
            } = await uploadAvatarFn({ variables: { file } });
            if (uploadAvatar.ok) {
              toast("Uploaded");
              navigation.pop();
            }
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      toast("You can't take pictures without CAMERA_ROLL permissions");
    }
  };
  return (
    <Container onPress={() => pickFromGallery()}>
      <AntDesign
        name={"appstore-o"}
        size={22}
        color={isDarkMode ? "#EFEFEF" : "#161616"}
      />
    </Container>
  );
});
