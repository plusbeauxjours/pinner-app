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

import React, { useState } from "react";
import styled from "styled-components";
import { GiftedChat } from "react-native-gifted-chat";
import firebaseSvc from "../../../../../Fire";
import CustomView from "./CustomView";

const View = styled.View`
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

interface IState {
  messages: any;
}

class Chat extends React.Component<any, IState> {
  public state = {
    messages: []
  };

  public renderCustomView = props => {
    return <CustomView {...props} />;
  };

  get user() {
    return {
      name: "koko",
      _id: "PRMBJ6vZ8bQxwooqXwSq4SXFo8J3"
    };
  }

  public render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSvc.send}
        user={this.user}
        renderCustomView={this.renderCustomView}
      />
    );
  }

  public componentDidMount() {
    firebaseSvc.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }))
    );
  }
  public componentWillUnmount() {
    firebaseSvc.off();
  }
}

export default Chat;
