import React from "react";
import { GiftedChat, Actions } from "react-native-gifted-chat";
import { withNavigation, NavigationScreenProp } from "react-navigation";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import CustomView from "./CustomView";
import { database, chat_send } from "../../../../../Fire";
import { Platform, TouchableOpacity, Alert, BackHandler } from "react-native";
import { BACKEND_URL } from "../../../../../constants";
import ChatPresenter from "./ChatPresenter";
import {
  chat_leave,
  get_new_key,
  UserChatMessage,
  ChatMessage,
  image_upload_chat,
  get_old_chat_messages,
  image_get_raw,
  update_message_info,
  fb_db
} from "../../../../../Fire";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";

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
  receiverId: string;
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
  loadingEarlier: boolean;
  overlayVisible: boolean;
  dbref: any;
  imageLoading: boolean;
}

class ChatContainer extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      chatId: this.props.navigation.getParam("chatId"),
      userId: this.props.navigation.getParam("userId"),
      receiverId: this.props.navigation.getParam("receiverId"),
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
      resolution: "high",
      loadingEarlier: false,
      overlayVisible: false,
      dbref: firebase
        .database()
        .ref("messages")
        .child(this.props.navigation.getParam("chatId")),
      imageLoading: false
    };
  }

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
    <Ionicons name={Platform.OS === "ios" ? "ios-add" : "md-add"} size={26} />
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

  public renderMessageVideo = () => {};

  public openImageViewer = images => {
    this.setState({ modalOpen: true, imageUrl: images[0].url });
  };

  public renderDarkMessageImage = props => {
    const images = [{ url: props.currentMessage.image }];
    return (
      <TouchableOpacity
        disabled={this.state.imageLoading}
        onPress={() => this.openImageViewer(images)}
      >
        <ProgressiveImage
          tint={"dark"}
          style={{
            width: 200,
            height: 200,
            borderRadius: 13,
            margin: 3,
            resizeMode: "cover"
          }}
          preview={{
            uri: props.currentMessage.image
          }}
          uri={props.currentMessage.image}
        />
      </TouchableOpacity>
    );
  };

  public renderLightMessageImage = props => {
    const images = [{ url: props.currentMessage.image }];
    return (
      <TouchableOpacity
        disabled={this.state.imageLoading}
        onPress={() => this.openImageViewer(images)}
      >
        <ProgressiveImage
          tint={"light"}
          style={{
            width: 200,
            height: 200,
            borderRadius: 13,
            margin: 3,
            resizeMode: "cover"
          }}
          preview={{
            uri: props.currentMessage.image
          }}
          uri={props.currentMessage.image}
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
          chat_send(this.state.chatId, messageServer).catch(e =>
            console.log(e)
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

      chat_send(this.state.chatId, messageServer).catch(e => console.log(e));
    }
  };

  public closeModalOpen = () => {
    this.setState({ modalOpen: false });
  };

  public sortByDate = (a, b) => {
    let date1 = new Date(a.createdAt).getTime();
    let date2 = new Date(b.createdAt).getTime();
    return date1 < date2 ? 1 : date2 < date1 ? -1 : 0;
  };

  // public componentDidMount() {
  //   this.fetchMessages();
  // }
  // public fetchMessages = async () => {
  //   const { chatId } = this.state;
  //   this.setState({ loading: true });
  //   await database
  //     .ref("messages")
  //     .child(chatId)
  //     .on("value", snap => {
  //       let messages = [];
  //       snap.forEach(message => {
  //         messages.push(message.val());
  //       });
  //       this.setState({ messages: messages.reverse() });
  //     });
  //   this.setState({ loading: false });
  // };

  public componentDidUnMount() {
    this.state.dbref.off("child_added");
    BackHandler.removeEventListener("hardwareBackPress", () => {
      return;
    });
  }
  public componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (!this.state.overlayVisible) {
        this.props.navigation.navigate("Match");
        return true;
      } else {
        this.setState({ overlayVisible: false });
        return true;
      }
    });
    get_old_chat_messages(
      this.state.chatId,
      this.state.resolution,
      this.state.userId
    ).then(messages => {
      if (messages) {
        let promises = messages.map(m =>
          update_message_info(m, this.state.chatId)
        );
        Promise.all(promises).then(results => {
          this.setState({
            messages: results.filter(r => r).sort(this.sortByDate),
            loading: false
          });
        });
      }
    });
    let start_key = get_new_key("messages");
    fb_db.ref
      .child("messages")
      .child(this.state.chatId)
      .orderByKey()
      .startAt(start_key)
      .on("child_added", child => {
        /* tslint:disable:no-string-literal */
        if (child && child.val()) {
          let message_container = [];
          let new_message = child.val();
          if (
            new_message.system ||
            new_message.user._id !== this.state.userId
          ) {
            update_message_info(new_message, this.state.chatId).then(
              updated_message => {
                console.log("updated_message", updated_message);
                //@ts-ignore
                if (updated_message.image) {
                  try {
                    this.setState({ imageLoading: true });
                    image_get_raw(
                      //@ts-ignore
                      updated_message.image,
                      this.state.resolution
                    ).then(image => {
                      console.log("image", image);
                      //@ts-ignore
                      updated_message.image = image;
                      message_container.push(new_message);
                      this.setState(previousState => ({
                        messages: GiftedChat.append(
                          previousState.messages,
                          message_container
                        ).sort(this.sortByDate)
                      }));
                    });
                  } catch (e) {
                    console.log(e);
                  } finally {
                    this.setState({ imageLoading: false });
                  }
                } else {
                  message_container.push(new_message);
                  this.setState(previousState => ({
                    messages: GiftedChat.append(
                      previousState.messages,
                      message_container
                    ).sort(this.sortByDate)
                  }));
                }
              }
            );
          }
        }
      });
  }

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
        renderMessageVideo={this.renderMessageVideo}
        renderDarkMessageImage={this.renderDarkMessageImage}
        renderLightMessageImage={this.renderLightMessageImage}
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
