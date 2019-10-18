import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import Loader from "../../components/Loader";
import { Image, ScrollView } from "react-native";
import constants from "../../../constants";
import { theme } from "../../styles/theme";

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
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>({});
  const [allPhotos, setAllPhotos] = useState<any>();
  const changeSelected = photo => {
    if (selected && photo.id === selected.id) {
      setSelected({});
    } else {
      setSelected(photo);
    }
  };
  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        sortBy: MediaLibrary.SortBy.creationTime
      });
      setAllPhotos(assets);
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
        setHasPermission(true);
        getPhotos();
      }
    } catch (e) {
      console.log(e);
      setHasPermission(false);
    }
  };
  const handleSelected = () => {
    navigation.navigate("UploadPhoto", { photo: selected });
  };
  useEffect(() => {
    askPermission();
  }, []);
  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <View>
          {hasPermission ? (
            <>
              {selected.id && (
                <Image
                  style={{
                    width: constants.width,
                    height: constants.width,
                    margin: 0.5
                  }}
                  source={{ uri: selected.uri }}
                />
              )}
              {selected.length !== 0 && (
                <Button onPress={handleSelected}>
                  <Text>Select Photo</Text>
                </Button>
              )}
              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: constants.width
                }}
              >
                {allPhotos.map(photo => (
                  <Touchable
                    key={photo.id}
                    onPress={() => changeSelected(photo)}
                  >
                    <Image
                      key={photo.id}
                      source={{ uri: photo.uri }}
                      style={{
                        width: constants.width / 4 - 1,
                        height: constants.width / 4 - 1,
                        opacity: photo.id === selected.id ? 0.3 : 1,
                        margin: 0.5
                      }}
                    />
                  </Touchable>
                ))}
              </ScrollView>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
};
