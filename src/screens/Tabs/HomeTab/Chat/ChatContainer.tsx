import React from "react";
import uuid from "uuid";
import { GiftedChat, Actions } from "react-native-gifted-chat";
import { withNavigation, NavigationScreenProp } from "react-navigation";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import CustomView from "./CustomView";
import database from "../../../../../Fire";
import { Platform, Image, TouchableOpacity } from "react-native";
import NavIcon from "../../../../components/NavIcon";
import { BACKEND_URL } from "../../../../../constants";
import ChatPresenter from "./ChatPresenter";

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
  Avatar: string;
  targetName: string;
  hasPermission: boolean;
  nowShowing: string;
  imageUrls: any;
  modalOpen: boolean;
  loading: boolean;
  messages: any;
}

class ChatContainer extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      chatId: this.props.navigation.getParam("chatId"),
      userId: this.props.navigation.getParam("userId"),
      userName: this.props.navigation.getParam("userName"),
      userUrl: this.props.navigation.getParam("userUrl"),
      Avatar: `${BACKEND_URL}/media/${this.props.navigation.getParam(
        "userUrl"
      )}`,
      targetName: this.props.navigation.getParam("targetName"),
      hasPermission: false,
      nowShowing: "",
      imageUrls: "",
      modalOpen: false,
      loading: false,
      messages: []
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

  public onSend = newMessages => {
    const { userId, userName, chatId, messages } = this.state;
    const newMessage = newMessages[0];
    const { user } = newMessage;
    user._id = userId;
    user.name = userName;
    this.setState({ messages: GiftedChat.append(messages, newMessages) });
    database
      .ref("messages")
      .child(chatId)
      .push({
        ...newMessages[0],
        createdAt: new Date().getTime()
      });
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
    this.setState({ modalOpen: true, imageUrls: images });
  };

  public renderMessageImage = props => {
    console.log(props.currentMessage.image);
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

  public askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        this.setState({ hasPermission: true });
      }
    } catch (e) {
      console.log(e);
      this.setState({ hasPermission: false });
    }
  };

  public handleAddPhoto = async () => {
    const { userId, Avatar, userName, messages, chatId } = this.state;
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
      this.setState({ messages: GiftedChat.append(messages, newMessages) });
      database
        .ref("messages")
        .child(chatId)
        .push({
          ...newMessages[0]
        });
    }
  };

  public renderActions = props => {
    const options = {
      "Send Location": () => {
        this.props.navigation.push("SendLocationScreen", {
          onSend: props.onSend
        });
      },
      "Send Image": () => {
        this.askPermission();
        this.handleAddPhoto();
      },
      Cancel: () => {}
    };
    return (
      <Actions {...props} icon={this.renderActionsIcon} options={options} />
    );
  };

  public closeModalOpen = () => {
    this.setState({ modalOpen: false });
  };

  public render() {
    const {
      loading,
      modalOpen,
      nowShowing,
      imageUrls,
      messages,
      userId,
      Avatar,
      chatId,
      userName,
      userUrl
    } = this.state;
    return (
      <ChatPresenter
        loading={loading}
        modalOpen={modalOpen}
        nowShowing={nowShowing}
        imageUrls={imageUrls}
        messages={messages}
        userId={userId}
        Avatar={Avatar}
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
      />
    );
  }
}

export default withNavigation(ChatContainer);
