// import React from "react";
// import styled from "styled-components";

// const View = styled.View`
//   justify-content: center;
//   align-items: center;
//   flex: 1;
// `;

// const Text = styled.Text``;

// export default () => (
//   <View>
//     <Text>Chat List</Text>
//   </View>
// );

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import firebaseSvc from "../../../../../Fire";
import CustomView from "./CustomView";
import database from "../../../../../Fire";
import Loader from "../../../../components/Loader";

const View = styled.View`
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default function Chat({ navigation }) {
  const chatId = navigation.getParam("chatId");
  const userId = navigation.getParam("userId");
  const userName = navigation.getParam("userName");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
    listenOnChangeMessages();
  }, []);

  const fetchMessages = async () => {
    await database
      .ref("messages")
      .child(chatId)
      .on("value", snap => {
        let messages = [];
        snap.forEach(message => {
          messages.push(message.val());
        });
        setMessages(messages);
      });
    setMessages(messages);
    setLoading(true);
  };

  const listenOnChangeMessages = () => {
    database
      .ref("messages")
      .child(chatId)
      .on("value", snap => {
        let messages = [];
        snap.forEach(message => {
          messages.push(message.val());
        });
        setMessages(messages);
      });
  };

  const onSend = nMess => {
    const newMessage = nMess[0];
    console.log(newMessage);
    const { user } = newMessage;
    user._id = userId;
    user.name = userName;
    setMessages(GiftedChat.append(messages, nMess));
    console.log(chatId);
    database
      .ref("messages")
      .child(chatId)
      .push({
        ...nMess[0],
        createdAt: new Date().getTime()
      });
  };

  return (
    (loading && (
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userId
        }}
        inverted={false}
      />
    )) || (
      <View>
        <Loader />
      </View>
    )
    // <View style={{ flex: 1 }}>
    //   {Platform.OS === "android" ? (
    //     <KeyboardAvoidingView behavior="padding" enabled>
    //       <GiftedChat
    //         messages={this.state.messages}
    //         onSend={messages => onSend(messages)}
    //         user={{
    //           _id: 1
    //         }}
    //       />
    //     </KeyboardAvoidingView>
    //   ) : (
    //     <GiftedChat
    //       messages={this.state.messages}
    //       onSend={messages => onSend(messages)}
    //       user={{
    //         _id: 1
    //       }}
    //     />
    //   )}
    // </View>
  );
}
