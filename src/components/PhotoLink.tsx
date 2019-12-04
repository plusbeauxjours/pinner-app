import React from "react";
import uuid from "uuid/v4";
import { Platform } from "react-native";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
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

import { RNCamera } from "react-native-camera";

const Container = styled.TouchableOpacity`
  padding-left: 20px;
`;

export default withNavigation(({ navigation }) => {
  const { me } = useMe();
  const isDarkMode = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const [uploadAvatarFn, { loading: uploadAvatarLoading }] = useMutation<
    UploadAvatar,
    UploadAvatarVariables
  >(UPLOAD_AVATAR, {
    update(cache, { data: { uploadAvatar } }) {
      try {
        const data = cache.readQuery<GetAvatars, GetAvatarsVariables>({
          query: GET_AVATARS,
          variables: { userName: me.user.username }
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
            variables: { userName: me.user.username },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { username: me.user.username }
        });
        if (data) {
          data.userProfile.user.profile.avatarUrl =
            uploadAvatar.avatar.thumbnail;
          cache.writeQuery({
            query: GET_USER,
            variables: { username: me.user.username },
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
    console.log(orig_width, orig_height);
    if (orig_width > 1280 || orig_height > 1280) {
      let manipResult;
      if (orig_width / 1280 >= orig_height / 1280) {
        manipResult = await ImageManipulator.manipulateAsync(uri, [
          { resize: { width: 1280 } }
        ]);
      } else {
        manipResult = await ImageManipulator.manipulateAsync(uri, [
          { resize: { height: 1280 } }
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
          allowsEditing: true
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
          uploadAvatarFn({ variables: { file } });
          navigation.pop();
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      toast("You can't take pictures without CAMERA_ROLL permissions");
    }
  };
  const pickFromCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      /* tslint:enable:no-shadowed-variable */
      let result = await ImagePicker.launchCameraAsync({
        quality: 1,
        aspect: [1, 1],
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true
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
        uploadAvatarFn({ variables: { file } });
        navigation.pop();
      }
    } else {
      toast("You can't take pictures without CAMERA permissions");
    }
  };
  const onOpenActionSheet = () => {
    showActionSheetWithOptions(
      {
        options: ["Image From Gallery", "Image From Camera", "Cancel"],
        cancelButtonIndex: 2,
        showSeparators: true
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          pickFromGallery();
        } else if (buttonIndex === 1) {
          pickFromCamera();
        } else {
          null;
        }
      }
    );
  };

  return (
    <Container onPress={() => onOpenActionSheet()}>
      <Ionicons
        name={Platform.OS === "ios" ? "ios-camera" : "md-camera"}
        size={36}
        color={isDarkMode ? "#EFEFEF" : "#161616"}
      />
    </Container>
  );
});
