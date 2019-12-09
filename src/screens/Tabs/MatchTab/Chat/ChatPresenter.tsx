import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  GiftedChat,
  InputToolbar,
  Send,
  Composer
} from "react-native-gifted-chat";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Platform, Modal, SafeAreaView } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Loader from "../../../../components/Loader";
import constants from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import { useLocation } from "../../../../context/LocationContext";

const View = styled.View``;
const ChatContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
`;
const MarkerContainer = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;
const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Text = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
  opacity: 1;
`;
const MapBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 40px;
  margin: 5px;
  border: 0.5px solid #999;
  border-radius: 5px;
  opacity: 0.85;
  background-color: #96abbf;
`;

interface IProps {
  userId: string;
  mapModalOpen: boolean;
  loading: boolean;
  messages: any;
  onSend: any;
  onSendLocation: any;
  renderCustomView: any;
  renderActions: any;
  closeMapModal: () => void;
  messageFooter: (timeProps: any) => void;
  renderAvatar: any;
}

const ChatPresenter: React.FunctionComponent<IProps> = ({
  userId,
  mapModalOpen,
  loading,
  messages,
  onSend,
  onSendLocation,
  renderCustomView,
  renderActions,
  closeMapModal,
  messageFooter,
  renderAvatar
}) => {
  let mapRef: MapView | null;
  const isDarkMode = useTheme();
  const location = useLocation();
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = 0.01;
  const [ready, setReady] = useState<boolean>(false);
  const [region, setRegion] = useState({
    latitude: location.currentLat,
    longitude: location.currentLng,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });
  const onMapReady = () => {
    if (!ready) {
      setReady(true);
    }
  };
  const onRegionChangeComplete = region => {
    setRegion(region);
  };
  const handleGeoSuccess = (position: Position) => {
    const {
      coords: { latitude, longitude }
    } = position;
    setRegion({
      latitude,
      longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    });
  };
  const handleGeoError = () => {
    console.log("No location");
  };
  const renderComposer = props => <Composer {...props} />;
  const renderSend = props => (
    <Send {...props}>
      <View
        style={{
          backgroundColor: "transparent",
          height: 45,
          width: 45,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <FontAwesome name="send" size={20} color="#3897f0" />
      </View>
    </Send>
  );
  const renderInputToolbar = props => {
    return (
      <InputToolbar
        textInputStyle={{
          color: isDarkMode ? "white" : "black"
        }}
        containerStyle={{
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          height: 45
        }}
        {...props}
      >
        {renderSend(props)}
        {renderComposer(props)}
      </InputToolbar>
    );
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
  }, []);
  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  } else {
    return (
      <>
        <Modal visible={mapModalOpen} transparent={true}>
          <MapView
            ref={map => {
              mapRef = map;
            }}
            provider={PROVIDER_GOOGLE}
            style={{
              borderRadius: 5,
              height: constants.height
            }}
            initialRegion={region}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onMapReady={onMapReady}
            loadingEnabled={true}
            rotateEnabled={false}
            onRegionChangeComplete={onRegionChangeComplete}
            customMapStyle={
              isDarkMode && isDarkMode === true ? darkMode : lightMode
            }
          />
          <MarkerContainer pointerEvents="none">
            <Ionicons
              name={Platform.OS === "ios" ? "ios-pin" : "md-pin"}
              size={40}
              color={"#3897f0"}
              pointerEvents="none"
              containerStyle={{ marginBottom: 30 }}
            />
          </MarkerContainer>
          <View
            style={{
              bottom: 20,
              position: "absolute",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: constants.width,
              paddingRight: 10,
              paddingLeft: 10,
              marginBottom: 0
            }}
          >
            <MapBtn onPress={() => closeMapModal()}>
              <Text>Back to chatroom</Text>
            </MapBtn>
            <MapBtn
              onPress={() => onSendLocation(region.latitude, region.longitude)}
            >
              <Text>Send this location</Text>
            </MapBtn>
          </View>
        </Modal>
        <ChatContainer>
          {Platform.OS === "android" ? (
            <SafeAreaView style={{ flex: 1 }}>
              <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                  _id: userId
                }}
                renderCustomView={renderCustomView}
                renderActions={renderActions}
                //@ts-ignore
                renderTime={messageFooter}
                renderAvatar={renderAvatar}
                isAnimated
                scrollToBottom
                alwaysShowSend
                submitOnReturn
                placeholderTextColor={"#96abbf"}
                renderInputToolbar={renderInputToolbar}
                renderSend={renderSend}
                // keyboardShouldPersistTaps={"handled"}
                minInputToolbarHeight={45}
              />
              <KeyboardSpacer />
            </SafeAreaView>
          ) : (
            <SafeAreaView style={{ flex: 1 }}>
              <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                  _id: userId
                }}
                renderCustomView={renderCustomView}
                renderActions={renderActions}
                //@ts-ignore
                renderTime={messageFooter}
                renderAvatar={renderAvatar}
                isAnimated
                scrollToBottom
                alwaysShowSend
                submitOnReturn
                placeholderTextColor={"#96abbf"}
                renderInputToolbar={renderInputToolbar}
                renderSend={renderSend}
                // keyboardShouldPersistTaps={"handled"}
                minInputToolbarHeight={45}
              />
            </SafeAreaView>
          )}
        </ChatContainer>
      </>
    );
  }
};

export default ChatPresenter;
