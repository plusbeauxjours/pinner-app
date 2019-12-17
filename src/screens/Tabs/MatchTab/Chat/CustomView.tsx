import React from "react";
import { Platform, Linking, Clipboard } from "react-native";
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
const SnsView = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 13px;
`;
const Image = styled.Image`
  width: 100px;
  height: 100px;
  margin-right: 10px;
`;

const snsList = {
  PHONE_SECOND: require("../../../../../assets/phone_second.png"),
  EMAIL_SECOND: require("../../../../../assets/email_second.png"),
  INSTAGRAM: require("../../../../../assets/instagram.png"),
  PHONE: require("../../../../../assets/phone.png"),
  EMAIL: require("../../../../../assets/email.png"),
  KAKAOTALK: require("../../../../../assets/kakao.png"),
  FACEBOOK: require("../../../../../assets/facebook.png"),
  YOUTUBE: require("../../../../../assets/youtube.png"),
  TWITTER: require("../../../../../assets/twitter.png"),
  TELEGRAM: require("../../../../../assets/telegram.png"),
  SNAPCHAT: require("../../../../../assets/snapchat.png"),
  LINE: require("../../../../../assets/line.png"),
  WECHAT: require("../../../../../assets/wechat.png"),
  KIK: require("../../../../../assets/kik.png"),
  VK: require("../../../../../assets/vk.png"),
  WHATSAPP: require("../../../../../assets/whatsapp.png"),
  BEHANCE: require("../../../../../assets/behance.png"),
  LINKEDIN: require("../../../../../assets/linkedin.png"),
  PINTEREST: require("../../../../../assets/pinterest.png"),
  VINE: require("../../../../../assets/vine.png"),
  TUMBLR: require("../../../../../assets/tumblr.png")
};

export default ({ currentMessage }) => {
  const isDarkMode = useTheme();
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
  if (currentMessage.snsId) {
    return (
      <Touchable
        onPress={() => Clipboard.setString(currentMessage.snsId)}
        activeOpacity={0.8}
      >
        <SnsView>
          <Image
            resizeMode={"contain"}
            source={snsList[currentMessage.snsIdPlatform]}
          />
          <Text>SNS</Text>
        </SnsView>
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
