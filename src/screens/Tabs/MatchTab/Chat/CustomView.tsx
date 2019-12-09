import React from "react";
import { Platform, Linking } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import { useTheme } from "../../../../context/ThemeContext";
import styled from "styled-components";

const Touchable = styled.TouchableOpacity`
  overflow: hidden;
  border-radius: 13px;
`;

interface IProps {
  currentMessage: any;
}

export default class CustomViewContainer extends React.Component<IProps> {
  onMapPress = () => {
    const { latitude, longitude } = this.props.currentMessage.location;
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

  render() {
    const { currentMessage } = this.props;
    if (currentMessage.location) {
      return (
        <CustomViewPresenter
          currentMessage={currentMessage}
          onMapPress={this.onMapPress}
        />
      );
    }
    return null;
  }
}
const CustomViewPresenter = ({ currentMessage, onMapPress }) => {
  const isDarkMode = useTheme();
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
};
