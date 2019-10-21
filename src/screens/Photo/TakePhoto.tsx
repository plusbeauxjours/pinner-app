import React, { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { Camera } from "expo-camera";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import constants from "../../../constants";
import Loader from "../../components/Loader";
import * as MediaLibrary from "expo-media-library";

const View = styled.View`
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Touchable = styled.TouchableOpacity``;
const Icon = styled.View``;
const Text = styled.Text`
  color: ${props => props.theme.color};
`;

const Button = styled.View`
  width: 80;
  height: 80;
  border-radius: 40;
  border: 10px solid ${props => props.theme.greyColor};
`;

export default ({ navigation }) => {
  const cameraRef = useRef(null);
  const [canTakePhoto, setCanTakePhoto] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const takePhoto = async () => {
    if (!canTakePhoto) {
      return null;
    }
    try {
      setCanTakePhoto(false);
      const { uri } = await cameraRef.current.takePictureAsync({
        qualith: 1
      });
      const asset = await MediaLibrary.createAssetAsync(uri);
      setCanTakePhoto(true);
      navigation.navigate("UploadPhoto", { photo: asset });
    } catch (e) {
      console.log(e);
      setCanTakePhoto(true);
    }
  };
  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status === "granted") {
        setHasPermission(true);
      }
    } catch (e) {
      console.log(e);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };
  const toggleType = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };
  useEffect(() => {
    askPermission();
  }, []);
  return (
    <View>
      {loading ? (
        <Loader />
      ) : hasPermission ? (
        <>
          <Camera
            ref={cameraRef}
            type={cameraType}
            style={{
              justifyContent: "flex-end",
              padding: 15,
              width: constants.width,
              height: constants.width
            }}
          >
            <Touchable onPress={toggleType}>
              <Icon>
                <Ionicons
                  name={
                    Platform.OS === "ios"
                      ? "ios-reverse-camera"
                      : "md-reverse-camera"
                  }
                  size={32}
                  color={"white"}
                />
              </Icon>
            </Touchable>
          </Camera>
          <View>
            <Touchable onPress={takePhoto} disabled={!canTakePhoto}>
              <Button />
            </Touchable>
          </View>
        </>
      ) : null}
    </View>
  );
};
