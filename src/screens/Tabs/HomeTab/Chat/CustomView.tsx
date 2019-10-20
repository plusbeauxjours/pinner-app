import React from "react";
import { Platform, Linking, TouchableOpacity } from "react-native";
import { MapView } from "expo";
import styled from "styled-components";

// const MapView = styled.MapView`
//   width: 250;
//   height: 150;
//   border-radius: 13;
//   margin: 3;
// `;

export default ({ currentMessage }) => {
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
      <TouchableOpacity onPress={onMapPress}>
        <MapView
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.025
          }}
          style={{
            width: 250,
            height: 250,
            borderRadius: 13,
            margin: 3
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <MapView.Marker coordinate={currentMessage.location} />
        </MapView>
      </TouchableOpacity>
    );
  }
  return null;
};
