import React from "react";
import { Platform, Linking } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import { useTheme } from "../../../../context/ThemeContext";
import styled from "styled-components";
import Toast from "react-native-root-toast";

const Touchable = styled.TouchableOpacity`
  overflow: hidden;
  border-radius: 13px;
`;

const Text = styled.Text``;

export default ({ currentMessage }) => {
  const isDarkMode = useTheme();
  const onMapPress = () => {
    const { latitude, longitude } = currentMessage.location;
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=*`,
      android: `http://maps.google.com/?q=${latitude},${longitude}`
    });
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          return null;
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  const onSnsPress = () => {
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
    toast("You have copied the username");
  };

  if (currentMessage.snsId) {
    return (
      <Touchable onPress={onSnsPress} activeOpacity={0.8}>
        <Text>SNS</Text>
      </Touchable>
    );
  } else if (currentMessage.location) {
    return (
      <Touchable onPress={onMapPress} activeOpacity={0.8}>
        <MapView
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025
          }}
          style={{
            width: 200,
            height: 100,
            borderRadius: 13
          }}
          onPress={onMapPress}
          scrollEnabled={false}
          zoomEnabled={false}
          customMapStyle={
            isDarkMode && isDarkMode === true ? darkMode : lightMode
          }
        >
          <Marker coordinate={currentMessage.location} />
        </MapView>
      </Touchable>
    );
  } else {
    return null;
  }
};
