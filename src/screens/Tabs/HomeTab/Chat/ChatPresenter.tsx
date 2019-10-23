import React from "react";
import uuid from "uuid";
import styled from "styled-components";
import { GiftedChat, Actions, MessageImage } from "react-native-gifted-chat";
import ImageViewer from "react-native-image-zoom-viewer";
import Modal from "react-native-modal";
import { withNavigation, NavigationScreenProp } from "react-navigation";
import { ScreenOrientation, Video } from "expo";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import CustomView from "./CustomView";
import database from "../../../../../Fire";
import Loader from "../../../../components/Loader";
import { Platform, KeyboardAvoidingView, Image } from "react-native";
import NavIcon from "../../../../components/NavIcon";
import constants, { BACKEND_URL } from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";

const View = styled.View`
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const ChatContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
`;

const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;

interface IProps {
  chatId: string;
  userId: string;
  userName: string;
  userUrl: string;
  Avatar: string;
  targetName: string;
  nowShowing: string;
  imageUrls: any;
  modalOpen: boolean;
  loading: boolean;
  messages: any;
  onSend: (newMessages: any) => void;
  renderCustomView: any;
  onPressAvatar: () => void;
  onLoadEarlier: () => void;
  renderMessageVideo: () => void;
  renderMessageImage: any;
  renderActions: any;
  closeModalOpen: () => void;
}

const ChatPresenter: React.FunctionComponent<IProps> = ({
  chatId,
  userId,
  userName,
  userUrl,
  Avatar,
  targetName,
  nowShowing,
  imageUrls,
  modalOpen,
  loading,
  messages,
  onSend,
  renderCustomView,
  onPressAvatar,
  onLoadEarlier,
  renderMessageVideo,
  renderMessageImage,
  renderActions,
  closeModalOpen
}) => {
  const isDarkMode = useTheme();
  if (loading) {
    return (
      <View>
        <Loader />
      </View>
    );
  } else {
    return (
      <>
        <Modal
          style={{ margin: 0, alignItems: "center" }}
          isVisible={modalOpen}
          backdropColor={isDarkMode && isDarkMode === true ? "black" : "white"}
          onBackdropPress={() => closeModalOpen()}
          onBackButtonPress={() => Platform.OS !== "ios" && closeModalOpen()}
          onModalHide={() => closeModalOpen()}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
        >
          {nowShowing == "photo" && (
            <ImageViewer
              imageUrls={imageUrls}
              enablePreload={true}
              saveToLocalByLongPress={true}
              loadingRender={() => {
                return <Loader />;
              }}
              onSave={() => alert("Image Saved to Gallery")}
              onSwipeDown={async () => {
                await ScreenOrientation.lockAsync(
                  ScreenOrientation.OrientationLock.PORTRAIT_UP
                );
                closeModalOpen();
              }}
              enableSwipeDown={true}
            />
          )}
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
          )}
        </Modal>
        <ChatContainer>
          {Platform.OS === "android" ? (
            <KeyboardAvoidingView behavior="padding" enabled>
              <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                  _id: userId,
                  avatar: Avatar
                }}
                renderCustomView={renderCustomView}
                renderActions={renderActions}
                onPressAvatar={onPressAvatar}
                loadEarlier={true}
                onLoadEarlier={onLoadEarlier}
                showAvatarForEveryMessage={true}
                renderUsernameOnMessage={true}
                renderMessageImage={renderMessageImage}
                // renderMessageVideo={renderMessageVideo}
              />
            </KeyboardAvoidingView>
          ) : (
            <GiftedChat
              messages={messages}
              onSend={messages => onSend(messages)}
              user={{
                _id: userId,
                avatar: Avatar
              }}
              renderCustomView={renderCustomView}
              renderActions={renderActions}
              onPressAvatar={onPressAvatar}
              loadEarlier={true}
              onLoadEarlier={onLoadEarlier}
              showAvatarForEveryMessage={true}
              renderUsernameOnMessage={true}
              renderMessageImage={renderMessageImage}
              // renderMessageVideo={renderMessageVideo}
            />
          )}
        </ChatContainer>
      </>
    );
  }
};

export default ChatPresenter;