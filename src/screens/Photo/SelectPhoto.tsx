import React, { useState, useEffect } from "react";
import styled from "styled-components";
import uuid from "uuid/v4";
import * as Permissions from "expo-permissions";
import { useMutation } from "react-apollo-hooks";
import { theme } from "../../styles/theme";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { UploadAvatar, UploadAvatarVariables } from "../../types/api";
import { UPLOAD_AVATAR } from "../../sharedQueries";
import { ReactNativeFile } from "apollo-upload-client";

const View = styled.View`
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Touchable = styled.TouchableOpacity``;

const Button = styled.TouchableOpacity`
  width: 100px;
  height: 30px;
  position: absolute;
  right: 5px;
  top: 15px;
  background-color: ${theme.blueColor};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

export default ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
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
    } finally {
      setLoading(false);
    }
  };
  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        pickFromGallery();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    askPermission();
  }, []);
  return null;
};
