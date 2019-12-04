import React from "react";
import { GiftedChat, Actions } from "react-native-gifted-chat";
import { withNavigation, NavigationScreenProp } from "react-navigation";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import firebase from "firebase";
import CustomView from "./CustomView";
import { chat_send } from "../../../../../Fire";
import {
  Platform,
  TouchableOpacity,
  BackHandler,
  View,
  Text
} from "react-native";
import { BACKEND_URL } from "../../../../../constants";
import ChatPresenter from "./ChatPresenter";
import {
  get_new_key,
  UserChatMessage,
  ChatMessage,
  get_old_chat_messages,
  update_message_info,
  fb_db
} from "../../../../../Fire";
import { Ionicons } from "@expo/vector-icons";
import * as moment from "moment-timezone";
import Toast from "react-native-root-toast";
import { Image } from "react-native";

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
  receiverAvatar: string;
  userName: string;
  userUrl: string;
  userAvatarUrl: string;
  targetName: string;
  hasPermission: boolean;
  nowShowing: string;
  imageUrl: string;
  imageModalOpen: boolean;
  mapModalOpen: boolean;
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
      receiverAvatar: this.props.navigation.getParam("receiverAvatar"),
      userName: this.props.navigation.getParam("userName"),
      userUrl: this.props.navigation.getParam("userUrl"),
      userAvatarUrl: `${BACKEND_URL}/media/${this.props.navigation.getParam(
        "userUrl"
      )}`,
      targetName: this.props.navigation.getParam("targetName"),
      hasPermission: false,
      nowShowing: "",
      imageUrl: "",
      imageModalOpen: false,
      mapModalOpen: false,
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
  public toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  public onSend = (messages = []) => {
    let msg = messages[0];
    if (msg) {
      msg._id = get_new_key("messages");
      msg.user.name = this.state.userName;
      msg.status = false;
      chat_send(this.state.chatId, msg);
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, msg)
      }));
    }
  };

  public onSendLocation = (latitude: string, longitude: string) => {
    let new_key = get_new_key("messages");
    let user: UserChatMessage = {
      _id: this.state.userId,
      name: this.state.userName
    };
    let messageLocation: ChatMessage = {
      _id: new_key,
      createdAt: new Date(),
      status: false,
      user: user,
      location: { latitude, longitude }
    };
    let messages = [];
    messages.push(messageLocation);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
      mapModalOpen: false
    }));
    chat_send(this.state.chatId, messageLocation).catch(e => console.log(e));
  };

  public renderActionsIcon = () => (
    <Ionicons name={Platform.OS === "ios" ? "ios-add" : "md-add"} size={26} />
  );

  public renderCustomView = props => {
    return <CustomView {...props} />;
  };

  public renderAvatar = () => {
    const { targetName } = this.state;
    const randomAvatar = {
      1: require(`../../../../Images/thumbnails/earth1.png`),
      2: require(`../../../../Images/thumbnails/earth2.png`),
      3: require(`../../../../Images/thumbnails/earth3.png`),
      4: require(`../../../../Images/thumbnails/earth4.png`),
      5: require(`../../../../Images/thumbnails/earth5.png`),
      6: require(`../../../../Images/thumbnails/earth6.png`),
      7: require(`../../../../Images/thumbnails/earth7.png`),
      8: require(`../../../../Images/thumbnails/earth8.png`),
      9: require(`../../../../Images/thumbnails/earth9.png`)
    };
    return (
      <>
        {this.state.receiverAvatar ? (
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.push("UserProfileTabs", {
                username: targetName,
                isSelf: false
              })
            }
          >
            <ProgressiveImage
              tint={"light"}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18
              }}
              preview={{
                uri: `${BACKEND_URL}/media/${this.state.receiverAvatar}`
              }}
              uri={`${BACKEND_URL}/media/${this.state.receiverAvatar}`}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.push("UserProfileTabs", {
                username: targetName,
                isSelf: false
              })
            }
          >
            <Image
              style={{
                height: 36,
                width: 36,
                borderRadius: 18
              }}
              source={randomAvatar[Math.round(Math.random() * 9)]}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  public renderActions = props => {
    const options = {
      "Send Location": () => {
        this.setState({ mapModalOpen: true });
      },
      Cancel: () => {}
    };
    return (
      <Actions {...props} icon={this.renderActionsIcon} options={options} />
    );
  };

  public closeMapModal = () => {
    this.setState({ mapModalOpen: false });
  };

  public sortByDate = (a, b) => {
    let date1 = new Date(a.createdAt).getTime();
    let date2 = new Date(b.createdAt).getTime();
    return date1 < date2 ? 1 : date2 < date1 ? -1 : 0;
  };

  public componentDidMount() {
    this.setState({ mapModalOpen: false });
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
          update_message_info(m, this.state.chatId, this.state.userId)
        );
        Promise.all(promises).then(results => {
          this.setState({
            messages: results.filter(r => r).sort(this.sortByDate)
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
      .on("child_changed", child => {
        if (child && child.val()) {
          if (child.val()["status"] === true) {
            this.setState({
              messages: this.state.messages.map(previousState =>
                previousState._id === child.val()["_id"]
                  ? { ...previousState, ...child.val() }
                  : previousState
              )
            });
          }
        }
      });
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
            update_message_info(
              new_message,
              this.state.chatId,
              this.state.userId
            ).then(updated_message => {
              message_container.push(new_message);
              this.setState(previousState => ({
                messages: GiftedChat.append(
                  previousState.messages,
                  message_container
                ).sort(this.sortByDate)
              }));
              // }
            });
          }
        }
      });
  }
  public didBlurSubscription = this.props.navigation.addListener(
    "didBlur",
    payload => {
      BackHandler.removeEventListener("hardwareBackPress", () => {
        return;
      });
      this.state.dbref.off("child_added");
    }
  );
  public componentDidUnMount() {
    this.didBlurSubscription.remove();
  }
  public messageFooter = timeProps => {
    const { currentMessage, position } = timeProps;
    const timeZone = moment.tz.guess();
    const time = moment.tz(currentMessage.createdAt, timeZone).format("LT");
    if (position === "left") {
      const text = (
        <Text style={{ left: 10, fontSize: 8, color: "black" }}>{time}</Text>
      );
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            width: 50
          }}
        >
          {text}
        </View>
      );
    } else if (position === "right") {
      const text = (
        <Text
          style={{
            right: 10,
            fontSize: 8,
            color: "white"
          }}
        >
          {time}
        </Text>
      );
      return (
        <>
          {currentMessage.status ? (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                width: 50
              }}
            >
              {text}
              <Text style={{ fontSize: 11, color: "white", right: 10 }}>
                Read
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: 50
              }}
            >
              {text}
            </View>
          )}
        </>
      );
    } else {
      return;
    }
  };
  public render() {
    const { loading, mapModalOpen, messages, userId } = this.state;
    return (
      <ChatPresenter
        userId={userId}
        mapModalOpen={mapModalOpen}
        loading={loading}
        messages={messages}
        onSend={this.onSend}
        onSendLocation={this.onSendLocation}
        renderCustomView={this.renderCustomView}
        renderActions={this.renderActions}
        closeMapModal={this.closeMapModal}
        messageFooter={this.messageFooter}
        renderAvatar={this.renderAvatar}
      />
    );
  }
}

export default withNavigation(ChatContainer);
