import React from "react";
import uuid from "uuid/v4";
import { Platform, Alert } from "react-native";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import SelectPhoto from "../screens/Photo/SelectPhoto";
import { UploadAvatar, UploadAvatarVariables } from "../types/api";
import { UPLOAD_AVATAR } from "../sharedQueries";
import { useMutation } from "react-apollo";
import { ReactNativeFile } from "apollo-upload-client";

const Container = styled.TouchableOpacity`
  padding-right: 20px;
`;

export default withNavigation(({ navigation }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const options = ["Image From Gallery", "Image From Camera", "Cancel"];
  const cancelButtonIndex = 2;
  const [
    UploadAvatarFn,
    { data: uploadData, loading: uploadLoading }
  ] = useMutation<UploadAvatar, UploadAvatarVariables>(UPLOAD_AVATAR);
  const image_resize = async (
    uri: string,
    orig_width: number,
    orig_height: number
  ) => {
    if (orig_width > 960 || orig_height > 720) {
      let manipResult;
      if (orig_width / 960 >= orig_height / 720) {
        manipResult = await ImageManipulator.manipulateAsync(uri, [
          { resize: { width: 960 } }
        ]);
      } else {
        manipResult = await ImageManipulator.manipulateAsync(uri, [
          { resize: { height: 720 } }
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
          UploadAvatarFn({ variables: { file } });
          navigation.pop();
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      Alert.alert("You can't take pictures without CAMERA_ROLL permissions");
    }
  };
  const pickFromCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      /* tslint:enable:no-shadowed-variable */
      let result = await ImagePicker.launchCameraAsync({
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
        UploadAvatarFn({ variables: { file } });
        navigation.pop();
      }
    } else {
      Alert.alert("You can't take pictures without CAMERA permissions");
    }
  };
  const onOpenActionSheet = () => {
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
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
      />
    </Container>
  );
});
