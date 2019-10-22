import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GiftedChat, Actions } from "react-native-gifted-chat";
import CustomView from "./CustomView";
import database from "../../../../../Fire";
import Loader from "../../../../components/Loader";
import { Platform, KeyboardAvoidingView, Image } from "react-native";
import NavIcon from "../../../../components/NavIcon";
import constants, { BACKEND_URL } from "../../../../../constants";
import ImageViewer from "react-native-image-zoom-viewer";
import Modal from "react-native-modal";
import { useTheme } from "../../../../context/ThemeContext";
import { ScreenOrientation, Video } from "expo";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import uuid from "uuid";

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

export default ({ navigation }) => {
  const isDarkMode = useTheme();
  const chatId = navigation.getParam("chatId");
  const userId = navigation.getParam("userId");
  const userName = navigation.getParam("userName");
  const userUrl = navigation.getParam("userUrl");
  const Avatar = `${BACKEND_URL}/media/${userUrl}`;
  const targetName = navigation.getParam("targetName");
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [nowShowing, setNowShowing] = useState();
  const [imageUrls, setImageUrls] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    setLoading(true);
    await database
      .ref("messages")
      .child(chatId)
      .on("value", snap => {
        let messages = [];
        snap.forEach(message => {
          messages.push(message.val());
        });
        setMessages(messages.reverse());
      });
    setLoading(false);
  };

  const onSend = newMessages => {
    const newMessage = newMessages[0];
    const { user } = newMessage;
    user._id = userId;
    user.name = userName;
    setMessages(GiftedChat.append(messages, newMessages));
    database
      .ref("messages")
      .child(chatId)
      .push({
        ...newMessages[0],
        createdAt: new Date().getTime()
      });
  };

  const renderActionsIcon = () => (
    <NavIcon name={Platform.OS === "ios" ? "ios-add" : "md-add"} />
  );
  const renderCustomView = props => {
    return <CustomView {...props} />;
  };

  const onPressAvatar = () => {
    navigation.push("UserProfileTabs", {
      username: targetName,
      isSelf: false
    });
  };

  const onLoadEarlier = () => {};
  const renderMessageVideo = () => {};

  const openImageViewer = images => {
    setImageUrls(images);
    setModalOpen(true);
  };

  const renderMessageImage = props => {
    const images = [{ url: props.currentMessage.image }];
    return (
      <Touchable onPress={() => openImageViewer(images)}>
        <Image
          style={{
            width: 200,
            height: 200,
            borderRadius: 13,
            margin: 3,
            resizeMode: "cover"
          }}
          source={{ uri: props.currentMessage.image }}
        />
      </Touchable>
    );
  };

  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        setHasPermission(true);
      }
    } catch (e) {
      console.log(e);
      setHasPermission(false);
    }
  };

  const handleAddPhoto = async () => {
    const { cancelled, uri }: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });
    if (!cancelled) {
      const newMessages = [
        {
          _id: uuid.v4(),
          createdAt: new Date().getTime(),
          image: uri,
          text: "",
          user: { _id: userId, avatar: Avatar, name: userName }
        }
      ];
      setMessages(GiftedChat.append(messages, newMessages));
      database
        .ref("messages")
        .child(chatId)
        .push({
          ...newMessages[0]
        });
    }
  };

  const renderActions = props => {
    const options = {
      "Send Location": () => {
        navigation.push("SendLocationScreen", { onSend: props.onSend });
      },
      "Send Image": () => {
        askPermission();
        handleAddPhoto();
      },
      Cancel: () => {}
    };
    return <Actions {...props} icon={renderActionsIcon} options={options} />;
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

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
          onBackdropPress={() => setModalOpen(false)}
          onBackButtonPress={() => Platform.OS !== "ios" && setModalOpen(false)}
          onModalHide={() => setModalOpen(false)}
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
                setModalOpen(false);
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
