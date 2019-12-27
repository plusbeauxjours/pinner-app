import React, { useState } from "react";
import styled from "styled-components";
import * as AppleAuthentication from "expo-apple-authentication";
import { useMutation } from "react-apollo-hooks";
import { FacebookConnect, FacebookConnectVariables } from "../../../types/api";
import { FACEBOOK_CONNECT } from "./FacebookApproachQueries";
import { useLogIn } from "../../../context/AuthContext";
import Toast from "react-native-root-toast";
import { ActivityIndicator } from "react-native";

const Touchable = styled.TouchableOpacity``;

const Container = styled.View`
  background-color: #000;
  padding: 10px;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 40px;
  border-radius: 5px;
  margin-top: 10px;
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

export default () => {
  const [loading, setLoading] = useState(false);
  const logIn = useLogIn();
  const toast = (message: string) => {
    Toast.show(message, {
      duration: 1000,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const appleLogin = async () => {
    try {
      setLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });
      console.log("credential APPLE LOGIN", credential);

      //   if (authResult.type === "success") {
      //     const response = await fetch(
      //       `https://graph.facebook.com/me?access_token=${authResult.token}&fields=id,name,last_name,first_name,email,gender`
      //     );
      // const {
      //   id,
      //   email,
      //   first_name,
      //   last_name,
      //   gender
      // } = await response.json();
      // const {
      //   data: { facebookConnect }
      // } = await facebookConnectFn({
      //   variables: {
      //     firstName: first_name,
      //     lastName: last_name,
      //     email,
      //     gender,
      //     cityId,
      //     countryCode,
      //     fbId: id
      //   }
      // });
      // await logIn(facebookConnect);
      // await toast(`Welcome ${first_name}!`);
      await setLoading(false);
      //   } else {
      //     // type === 'cancel'
      //     setLoading(false);
      //   }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
      setLoading(false);
    }
  };

  return (
    <Touchable disabled={loading} onPress={appleLogin}>
      <Container>
        {loading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <Text>LOG IN WITH APPLE</Text>
        )}
      </Container>
    </Touchable>
  );
};
