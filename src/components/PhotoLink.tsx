import React, { useState } from "react";
import { Platform, Alert, Linking } from "react-native";

import uuid from "uuid/v4";
import Constants from "expo-constants";
import styled from "styled-components";
import { useMutation } from "react-apollo";
import { ReactNativeFile } from "apollo-upload-client";
import * as IntentLauncher from "expo-intent-launcher";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import * as ImageManipulator from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";

import {
  Me,
  UploadAvatar,
  UploadAvatarVariables,
  GetAvatars,
  GetAvatarsVariables,
  UserProfile,
  UserProfileVariables,
} from "../types/api";
import { UPLOAD_AVATAR, ME } from "../sharedQueries";
import { useTheme } from "../context/ThemeContext";
import { useMe } from "../context/MeContext";
import { GET_AVATARS } from "../screens/Tabs/UserProfileTab/AvatarList/AvatarListQueries";
import { GET_USER } from "../screens/Tabs/UserProfileTab/UserProfile/UserProfileQueries";
import { withNavigation } from "react-navigation";

const Touchable = styled.TouchableOpacity`
  margin-right: 5px;
`;

export default withNavigation(({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const isDarkMode = useTheme();
  const [loading, setLoading] = useState<boolean>(false);

  // MUTATTION

  const [uploadAvatarFn, { loading: uploadAvatarLoading }] = useMutation<
    UploadAvatar,
    UploadAvatarVariables
  >(UPLOAD_AVATAR, {
    update(cache, { data: { uploadAvatar } }) {
      try {
        const data = cache.readQuery<GetAvatars, GetAvatarsVariables>({
          query: GET_AVATARS,
          variables: { uuid: me.user.uuid },
        });
        if (data) {
          data.getAvatars.avatars.unshift(uploadAvatar.avatar);
          data.getAvatars.avatars.find(
            (i) => i.uuid === uploadAvatar.preAvatarUUID
          ).isMain = false;
          data.getAvatars.avatars.find(
            (i) => i.uuid === uploadAvatar.newAvatarUUID
          ).isMain = true;
          cache.writeQuery({
            query: GET_AVATARS,
            variables: { uuid: me.user.uuid },
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid: me.user.uuid },
        });
        if (data) {
          data.userProfile.user.avatarUrl = uploadAvatar.avatar.thumbnail;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid: me.user.uuid },
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const data = cache.readQuery<Me>({
          query: ME,
        });
        if (data) {
          data.me.user.avatarUrl = uploadAvatar.avatar.thumbnail;
          cache.writeQuery({
            query: ME,
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  // FUNC

  const toast = (message: string) => {
    Toast.show(message, {
      duration: 1000,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
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
          { resize: { width: 960 } },
        ]);
      } else {
        manipResult = await ImageManipulator.manipulateAsync(uri, [
          { resize: { height: 960 } },
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
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        if (result.cancelled !== true) {
          const resized_uri = await image_resize(
            result.uri,
            result.width,
            result.height
          );
          let type: string = result.type;
          if (!type.includes("image/")) {
            const ext = result.uri.slice(result.uri.lastIndexOf(".") + 1);
            switch (ext) {
              case "gif":
                type = "image/gif";
                break;
              case "png":
                type = "image/png";
                break;
              case "jpeg":
              case "jpg":
                type = "image/jpeg";
                break;
              case "bmp":
                type = "image/bmp";
                break;
              case "webp":
                type = "image/webp";
                break;
              default:
                type = "image/jpeg";
                break;
            }
          }
          const name = uuid();
          const file = new ReactNativeFile({
            uri: resized_uri,
            type,
            name,
          });
          try {
            setLoading(true);
            const {
              data: { uploadAvatar },
            } = await uploadAvatarFn({ variables: { file } });
            if (uploadAvatar.ok) {
              toast("Uploaded");
              navigation.pop();
            }
          } catch (e) {
            console.log(e);
          } finally {
            setLoading(false);
          }
        }
      } catch (e) {
        console.log(e);
      }
    } else if (Platform.OS === "ios" && status === "denied") {
      Alert.alert(
        "Permission Denied",
        "To enable photo library, tap Open Settings, then tap on Photos, and finally tap on Read and Write.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openURL("app-settings:");
            },
          },
        ]
      );
    } else if (Platform.OS === "android" && status === "denied") {
      Alert.alert(
        "Permission Denied",
        "To enable photo library, tap Open Settings, then tap on Permissions, then tap on Storage which is on Deniedand, and finally tap on Allow.",
        [
          { text: "Cancel", style: "cancel" },
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
            },
          },
        ]
      );
    }
  };

  if (!meLoading && me) {
    return (
      <Touchable onPress={() => pickFromGallery()} disabled={loading}>
        <AntDesign
          name={"appstore-o"}
          size={22}
          color={isDarkMode ? "#EFEFEF" : "#161616"}
        />
      </Touchable>
    );
  } else {
    return null;
  }
});
