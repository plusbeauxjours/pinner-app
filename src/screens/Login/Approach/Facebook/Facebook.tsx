import styled from "../../../../styles/typed-components";
import * as Facebook from "expo-facebook";
import AuthButton from "../../../../components/AuthButton";
import { Alert } from "react-native";
import React from "react";

const FBContainer = styled.View`
  margin-top: 25px;
  padding-top: 25px;
  border-top-width: 1px;
  border-style: solid;
`;

const Text = styled.Text``;

export default () => {
  const fbLogin = async () => {
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        "242663513281642",
        { permissions: ["public_profile"] }
      );
      if (type === "success") {
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };
  return (
    <FBContainer>
      <AuthButton
        bgColor={"#2D4DA7"}
        loading={false}
        onPress={fbLogin}
        text="LOG IN WITH FACEBOOK"
      />
    </FBContainer>
  );
};
