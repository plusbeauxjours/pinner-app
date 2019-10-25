import React from "react";
import uuid from "uuid";
import { GiftedChat, Actions } from "react-native-gifted-chat";
import { withNavigation, NavigationScreenProp } from "react-navigation";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import CustomView from "./CustomView";
import { database, chat_send } from "../../../../../Fire";
import { Platform, Image, TouchableOpacity, Alert } from "react-native";
import NavIcon from "../../../../components/NavIcon";
import { BACKEND_URL } from "../../../../../constants";
import ChatPresenter from "./ChatPresenter";
import {
  chat_leave,
  get_new_key,
  UserChatMessage,
  ChatMessage,
  image_upload_chat
} from "../../../../../Fire";
import * as ImageManipulator from "expo-image-manipulator";

const HIGH_WIDTH = 1280;
const HIGH_HEIGHT = 960;
const LOW_WIDTH = 640;
const LOW_HEIGHT = 480;

interface IProps {
  navigation: NavigationScreenProp<{
    chatId: string;
    userId: string;
    userName: string;
    userUrl: string;
    targetName: string;
  }>;
}

interface IState {
  chatId: string;
  userId: string;
  userName: string;
  userUrl: string;
  userAvatarUrl: string;
  targetName: string;
  hasPermission: boolean;
  nowShowing: string;
  imageUrl: string;
  modalOpen: boolean;
  loading: boolean;
  messages: any;
  resolution: "full" | "high" | "low";
}

class ChatContainer extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      chatId: this.props.navigation.getParam("chatId"),
      userId: this.props.navigation.getParam("userId"),
      userName: this.props.navigation.getParam("userName"),
      userUrl: this.props.navigation.getParam("userUrl"),
      userAvatarUrl: `${BACKEND_URL}/media/${this.props.navigation.getParam(
        "userUrl"
      )}`,
      targetName: this.props.navigation.getParam("targetName"),
      hasPermission: false,
      nowShowing: "",
      imageUrl: "",
      modalOpen: false,
      loading: false,
      messages: [],
      resolution: "low"
    };
  }

  public componentDidMount() {
    this.fetchMessages();
  }

  public fetchMessages = async () => {
    const { chatId } = this.state;
    this.setState({ loading: true });
    await database
      .ref("messages")
      .child(chatId)
      .on("value", snap => {
        let messages = [];
        snap.forEach(message => {
          messages.push(message.val());
        });
        this.setState({ messages: messages.reverse() });
      });
    this.setState({ loading: false });
  };

  // public onSend = newMessages => {
  //   const { userId, userName, chatId, messages } = this.state;
  //   const newMessage = newMessages[0];
  //   const { user } = newMessage;
  //   user._id = userId;
  //   user.name = userName;
  //   this.setState({ messages: GiftedChat.append(messages, newMessages) });
  //   database
  //     .ref("messages")
  //     .child(chatId)
  //     .push({
  //       ...newMessages[0],
  //       createdAt: new Date().getTime()
  //     });
  // };

  public onSend = (messages = []) => {
    let msg = messages[0];
    if (msg) {
      msg._id = get_new_key("messages");
      msg.user.name = this.state.userName;
      chat_send(this.state.chatId, msg);
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, msg)
      }));
    }
  };

  public renderActionsIcon = () => (
    <NavIcon name={Platform.OS === "ios" ? "ios-add" : "md-add"} />
  );
  public renderCustomView = props => {
    return <CustomView {...props} />;
  };

  public onPressAvatar = () => {
    const { targetName } = this.state;
    this.props.navigation.push("UserProfileTabs", {
      username: targetName,
      isSelf: false
    });
  };

  public onLoadEarlier = () => {};
  public renderMessageVideo = () => {};

  public openImageViewer = images => {
    this.setState({ modalOpen: true, imageUrl: images[0].url });
  };

  public renderMessageImage = props => {
    const images = [{ url: props.currentMessage.image }];
    return (
      <TouchableOpacity onPress={() => this.openImageViewer(images)}>
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
      </TouchableOpacity>
    );
  };

  public leaveChat = () => {
    chat_leave(this.state.chatId, this.state.userId, this.state.userName);
    this.props.navigation.navigate("ActiveChatsScreen");
  };

  public renderActions = props => {
    const options = {
      "Send Location": () => {
        this.props.navigation.push("SendLocationScreen", {
          onSend: props.onSend
        });
      },
      "Send Image From Gallery": () => {
        this.pickFromGallery();
      },
      "Send Image From Camera": () => {
        this.pickFromCamera();
      },
      Cancel: () => {}
    };
    return (
      <Actions {...props} icon={this.renderActionsIcon} options={options} />
    );
  };

  public image_resize = async (
    uri: string,
    orig_width: number,
    orig_height: number
  ) => {
    if (this.state.resolution === "full") {
      console.log("Didn't resize because resolution was full");
      return uri;
    } else if (this.state.resolution === "high") {
      if (orig_width > HIGH_WIDTH || orig_height > HIGH_HEIGHT) {
        let manipResult;
        if (orig_width / HIGH_WIDTH >= orig_height / HIGH_HEIGHT) {
          manipResult = await ImageManipulator.manipulateAsync(uri, [
            { resize: { width: HIGH_WIDTH } }
          ]);
        } else {
          manipResult = await ImageManipulator.manipulateAsync(uri, [
            { resize: { height: HIGH_HEIGHT } }
          ]);
        }
        return manipResult.uri;
      } else {
        return uri;
      }
    } else {
      if (orig_width > LOW_WIDTH || orig_height > LOW_HEIGHT) {
        let manipResult;
        if (orig_width / LOW_WIDTH >= orig_height / LOW_HEIGHT) {
          manipResult = await ImageManipulator.manipulateAsync(uri, [
            { resize: { width: LOW_WIDTH } }
          ]);
        } else {
          manipResult = await ImageManipulator.manipulateAsync(uri, [
            { resize: { height: LOW_HEIGHT } }
          ]);
        }
        return manipResult.uri;
      } else {
        return uri;
      }
    }
  };

  public pickFromCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status === "granted") {
        /* tslint:enable:no-shadowed-variable */
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true
        });
        if (result.cancelled !== true) {
          const resized_uri = await this.image_resize(
            result.uri,
            result.width,
            result.height
          );
          let new_key = get_new_key("messages");
          let user: UserChatMessage = {
            _id: this.state.userId,
            name: this.state.userName,
            avatar: this.state.userAvatarUrl
          };

          let messageLocal: ChatMessage = {
            _id: new_key,
            createdAt: new Date(),
            user: user,
            image: resized_uri
          };
          let messages = [];
          messages.push(messageLocal);
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
          }));
          const url = await image_upload_chat(
            this.state.chatId,
            resized_uri,
            this.state.resolution
          );
          let messageServer: ChatMessage = {
            _id: new_key,
            createdAt: new Date(),
            user: user,
            image: url
          };
          chat_send(this.state.chatId, messageServer).catch(error =>
            console.log(error)
          );
        }
      } else {
        Alert.alert("You can't take pictures without CAMERA permissions");
      }
    } else {
      Alert.alert("You can't take pictures without CAMERA_ROLL permissions");
    }
  };

  public pickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    });

    if (result.cancelled !== true) {
      const resized_uri = await this.image_resize(
        result.uri,
        result.width,
        result.height
      );
      let new_key = get_new_key("messages");
      let user: UserChatMessage = {
        _id: this.state.userId,
        name: this.state.userName,
        avatar: this.state.userAvatarUrl
      };

      let messageLocal: ChatMessage = {
        _id: new_key,
        createdAt: new Date(),
        user: user,
        image: resized_uri
      };
      let messages = [];
      messages.push(messageLocal);
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }));

      const url = await image_upload_chat(
        this.state.chatId,
        resized_uri,
        this.state.resolution
      );

      let messageServer: ChatMessage = {
        _id: new_key,
        createdAt: new Date(),
        user: user,
        image: url
      };

      chat_send(this.state.chatId, messageServer).catch(error =>
        console.log(error)
      );
    }
  };

  public closeModalOpen = () => {
    this.setState({ modalOpen: false });
  };

  public render() {
    const {
      loading,
      modalOpen,
      nowShowing,
      imageUrl,
      messages,
      userId,
      userAvatarUrl,
      chatId,
      userName,
      userUrl
    } = this.state;
    return (
      <ChatPresenter
        loading={loading}
        modalOpen={modalOpen}
        nowShowing={nowShowing}
        imageUrl={imageUrl}
        messages={messages}
        userId={userId}
        userAvatarUrl={userAvatarUrl}
        chatId={chatId}
        userName={userName}
        userUrl={userUrl}
        onSend={this.onSend}
        renderCustomView={this.renderCustomView}
        onPressAvatar={this.onPressAvatar}
        onLoadEarlier={this.onLoadEarlier}
        renderMessageVideo={this.renderMessageVideo}
        renderMessageImage={this.renderMessageImage}
        renderActions={this.renderActions}
        closeModalOpen={this.closeModalOpen}
        leaveChat={this.leaveChat}
        pickFromCamera={this.pickFromCamera}
        pickFromGallery={this.pickFromGallery}
      />
    );
  }
}

export default withNavigation(ChatContainer);
