import React from "react";
import { Platform, Linking } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import { useTheme } from "../../../../context/ThemeContext";
import styled from "styled-components";

const Touchable = styled.TouchableOpacity``;

export default ({ currentMessage }) => {
  const isDarkMode = useTheme();
  const onMapPress = () => {
    const { latitude, longitude } = currentMessage.location;
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}`,
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
  if (currentMessage.location) {
    return (
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
          borderRadius: 13,
          margin: 3
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
    );
  }
  return null;
};
