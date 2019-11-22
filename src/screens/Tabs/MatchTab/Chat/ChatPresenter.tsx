import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GiftedChat } from "react-native-gifted-chat";
import ImageViewer from "react-native-image-zoom-viewer";
import { ScreenOrientation } from "expo";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Loader from "../../../../components/Loader";
import { Platform, KeyboardAvoidingView, Modal, Image } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import constants from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import { Ionicons } from "@expo/vector-icons";
import { useLocation } from "../../../../context/LocationContext";

const View = styled.View`
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const ChatContainer = styled.View`
  flex: 1;
  height: ${constants.height};
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

const TripSubmitBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 40px;
  margin: 5px;
  border: 0.5px solid #999;
  border-radius: 5px;
  background-color: rgba(230, 230, 230, 0.95);
`;

const TripBtnContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${constants.width};
  padding: 0 10px 0 10px;
  bottom: 0;
`;

const Text = styled.Text`
  font-size: 16;
  font-weight: 600;
  color: white;
`;

interface IProps {
  chatId: string;
  userId: string;
  userName: string;
  userUrl: string;
  userAvatarUrl: string;
  nowShowing: string;
  imageUrl: any;
  imageModalOpen: boolean;
  mapModalOpen: boolean;
  loading: boolean;
  messages: any;
  onSend: any;
  onSendLocation: any;
  renderCustomView: any;
  onPressAvatar: () => void;
  renderMessageVideo: () => void;
  renderDarkMessageImage: any;
  renderLightMessageImage: any;
  renderActions: any;
  closeImageModalOpen: () => void;
  closeMapModal: () => void;
  leaveChat: () => void;
  pickFromCamera: any;
  pickFromGallery: any;
  messageFooter: (timeProps: any) => void;
}

const ChatPresenter: React.FunctionComponent<IProps> = ({
  chatId,
  userId,
  userName,
  userUrl,
  userAvatarUrl,
  nowShowing,
  imageUrl,
  imageModalOpen,
  mapModalOpen,
  loading,
  messages,
  onSend,
  onSendLocation,
  renderCustomView,
  onPressAvatar,
  renderMessageVideo,
  renderDarkMessageImage,
  renderLightMessageImage,
  renderActions,
  closeImageModalOpen,
  closeMapModal,
  leaveChat,
  pickFromCamera,
  pickFromGallery,
  messageFooter
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
    console.log(region);
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
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
  }, []);
  if (loading) {
    return (
      <View>
        <Loader />
      </View>
    );
  } else {
    return (
      <>
        {/* {nowShowing == "photo" && ( */}
        <Modal visible={imageModalOpen} transparent={true}>
          <ImageViewer
            imageUrls={[{ url: imageUrl }]}
            enablePreload={true}
            style={{
              height: constants.width,
              width: constants.width,
              padding: 0,
              margin: 0
            }}
            renderImage={() => {
              return (
                <ProgressiveImage
                  style={{
                    height: constants.width,
                    width: constants.width,
                    padding: 0,
                    margin: 0,
                    position: "absolute"
                  }}
                  preview={{ uri: imageUrl }}
                  uri={imageUrl}
                />
              );
            }}
            onSwipeDown={async () => {
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
              );
              closeImageModalOpen();
            }}
            enableSwipeDown={true}
            //@ts-ignore
            renderIndicator={() => {}}
          />
          {/* )}
          {nowShowing == "video" && (
            <View
              style={{
                width: constants.width,
                height: constants.height,
                backgroundColor: "red"
              }}
            >
              <Video
                source={{
                  uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
                }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={{ width: 300, height: 300 }}
              />
            </View>
          )} */}
        </Modal>
        <Modal visible={mapModalOpen} transparent={true}>
          <MapView
            ref={map => {
              mapRef = map;
            }}
            provider={PROVIDER_GOOGLE}
            style={{
              flex: 1,
              borderRadius: 3
            }}
            initialRegion={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
            onMapReady={onMapReady}
            loadingEnabled={true}
            rotateEnabled={false}
            onRegionChangeComplete={onRegionChangeComplete}
            customMapStyle={
              isDarkMode && isDarkMode === true ? darkMode : lightMode
            }
          >
            <MarkerContainer
              pointerEvents="none"
              onPress={() => onSendLocation(region.latitude, region.longitude)}
            >
              <Ionicons
                name={Platform.OS === "ios" ? "ios-pin" : "md-pin"}
                size={40}
                color={"#3897f0"}
                pointerEvents="none"
                containerStyle={{ marginBottom: 30 }}
              />
            </MarkerContainer>
            <TripBtnContainer>
              <TripSubmitBtn onPress={() => closeMapModal()}>
                <Text>Cancel</Text>
              </TripSubmitBtn>
              <TripSubmitBtn
                onPress={() =>
                  onSendLocation(region.latitude, region.longitude)
                }
              >
                <Text>Send Location</Text>
              </TripSubmitBtn>
            </TripBtnContainer>
          </MapView>
        </Modal>
        <ChatContainer>
          {Platform.OS === "android" ? (
            <KeyboardAvoidingView behavior="padding" enabled>
              <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                  _id: userId,
                  avatar: userAvatarUrl
                }}
                renderCustomView={renderCustomView}
                renderActions={renderActions}
                onPressAvatar={onPressAvatar}
                renderMessageImage={
                  isDarkMode ? renderDarkMessageImage : renderLightMessageImage
                }
                //@ts-ignore
                renderTime={messageFooter}
                // renderMessageVideo={renderMessageVideo}
              />
              <KeyboardSpacer />
            </KeyboardAvoidingView>
          ) : (
            <GiftedChat
              messages={messages}
              onSend={messages => onSend(messages)}
              user={{
                _id: userId,
                avatar: userAvatarUrl
              }}
              renderCustomView={renderCustomView}
              renderActions={renderActions}
              onPressAvatar={onPressAvatar}
              renderMessageImage={
                isDarkMode ? renderDarkMessageImage : renderLightMessageImage
              }
              //@ts-ignore
              renderTime={messageFooter}
              // renderMessageVideo={renderMessageVideo}
            />
          )}
        </ChatContainer>
      </>
    );
  }
};

export default ChatPresenter;
