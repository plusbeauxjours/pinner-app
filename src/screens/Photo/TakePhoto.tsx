import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import { Camera } from "expo-camera";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import constants from "../../../constants";
import Loader from "../../components/Loader";

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

export default ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
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
        <Camera
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
      ) : null}
    </View>
  );
};
