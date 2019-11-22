import styled from "styled-components";
import * as Facebook from "expo-facebook";
import AuthButton from "../../../../components/AuthButton";
import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import {
  FacebookConnect,
  FacebookConnectVariables
} from "../../../../types/api";
import { FACEBOOK_CONNECT } from "./FacebookApproachQueries";
import { useLogIn } from "../../../../context/AuthContext";
import Toast from "react-native-root-toast";

const FBContainer = styled.View``;

export default () => {
  const [loading, setLoading] = useState(false);
  const logIn = useLogIn();
  const [facebookConnectFn] = useMutation<
    FacebookConnect,
    FacebookConnectVariables
  >(FACEBOOK_CONNECT);
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: 40,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const fbLogin = async () => {
    try {
      setLoading(true);
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        "242663513281642",
        {
          permissions: ["public_profile", "email"]
        }
      );
      if (type === "success") {
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,last_name,first_name,email,gender`
        );
        const {
          id,
          email,
          first_name,
          last_name,
          gender
        } = await response.json();
        const {
          data: { facebookConnect }
        } = await facebookConnectFn({
          variables: {
            firstName: first_name,
            lastName: last_name,
            email,
            gender,
            cityId: "ChIJuQhD6D7sfDURB6J0Dx5TGW8",
            countryCode: "KR",
            fbId: id
          }
        });
        logIn(facebookConnect);
        toast(`Welcome ${first_name}!`);
        setLoading(false);
      } else {
        // type === 'cancel'
        setLoading(false);
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
      setLoading(false);
    }
  };
  return (
    <FBContainer>
      <AuthButton
        bgColor={"#2D4DA7"}
        loading={loading}
        onPress={fbLogin}
        text="LOG IN WITH FACEBOOK"
      />
    </FBContainer>
  );
};
