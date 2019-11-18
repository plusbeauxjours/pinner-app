import React from "react";
import styled from "styled-components";
import { GiftedChat } from "react-native-gifted-chat";
import ImageViewer from "react-native-image-zoom-viewer";
import { ScreenOrientation } from "expo";
import Loader from "../../../../components/Loader";
import { Platform, KeyboardAvoidingView, Modal, Image } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import constants from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";

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

const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;

interface IProps {
  chatId: string;
  userId: string;
  userName: string;
  userUrl: string;
  userAvatarUrl: string;
  nowShowing: string;
  imageUrl: any;
  modalOpen: boolean;
  loading: boolean;
  messages: any;
  onSend: (newMessages: any) => void;
  renderCustomView: any;
  onPressAvatar: () => void;
  renderMessageVideo: () => void;
  renderDarkMessageImage: any;
  renderLightMessageImage: any;
  renderActions: any;
  closeModalOpen: () => void;
  leaveChat: () => void;
  pickFromCamera: any;
  pickFromGallery: any;
}

const ChatPresenter: React.FunctionComponent<IProps> = ({
  chatId,
  userId,
  userName,
  userUrl,
  userAvatarUrl,
  nowShowing,
  imageUrl,
  modalOpen,
  loading,
  messages,
  onSend,
  renderCustomView,
  onPressAvatar,
  renderMessageVideo,
  renderDarkMessageImage,
  renderLightMessageImage,
  renderActions,
  closeModalOpen,
  leaveChat,
  pickFromCamera,
  pickFromGallery
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
        {/* {nowShowing == "photo" && ( */}
        <Modal visible={modalOpen} transparent={true}>
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
              closeModalOpen();
            }}
            enableSwipeDown={true}
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
              // renderMessageVideo={renderMessageVideo}
            />
          )}
        </ChatContainer>
      </>
    );
  }
};

export default ChatPresenter;
