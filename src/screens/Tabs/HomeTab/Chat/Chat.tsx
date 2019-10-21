import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GiftedChat, Bubble, Actions } from "react-native-gifted-chat";
import firebaseSvc from "../../../../../Fire";
import CustomView from "./CustomView";
import database from "../../../../../Fire";
import Loader from "../../../../components/Loader";
import { Platform, KeyboardAvoidingView } from "react-native";
import NavIcon from "../../../../components/NavIcon";

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

export default ({ navigation }) => {
  const chatId = navigation.getParam("chatId");
  const userId = navigation.getParam("userId");
  const userName = navigation.getParam("userName");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    fetchMessages();
  }, [chatId]);

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

  const onSend = nMess => {
    const newMessage = nMess[0];
    const { user } = newMessage;
    user._id = userId;
    user.name = userName;
    setMessages(GiftedChat.append(messages, nMess));
    database
      .ref("messages")
      .child(chatId)
      .push({
        ...nMess[0],
        createdAt: new Date().getTime()
      });
  };

  const renderActionsIcon = () => (
    <NavIcon name={Platform.OS === "ios" ? "ios-add" : "md-add"} />
  );
  const renderCustomView = props => {
    return <CustomView {...props} />;
  };

  const renderActions = props => {
    const options = {
      "Send location": () => {
        navigation.push("SendLocationScreen", { onSend: props.onSend });
      },
      Cancel: () => {}
    };
    return <Actions {...props} icon={renderActionsIcon} options={options} />;
  };

  if (loading) {
    return (
      <View>
        <Loader />
      </View>
    );
  } else {
    return (
      <ChatContainer>
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="padding" enabled>
            <GiftedChat
              messages={messages}
              onSend={messages => onSend(messages)}
              user={{
                _id: userId
              }}
              renderCustomView={renderCustomView}
              renderActions={renderActions}
            />
          </KeyboardAvoidingView>
        ) : (
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: userId
            }}
            renderCustomView={renderCustomView}
            renderActions={renderActions}
          />
        )}
      </ChatContainer>
    );
  }
};
