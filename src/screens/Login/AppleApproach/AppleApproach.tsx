import React, { useState } from "react";
import styled from "styled-components";
import * as AppleAuthentication from "expo-apple-authentication";
import { useMutation } from "react-apollo-hooks";
import { AppleConnect, AppleConnectVariables } from "../../../types/api";
import { APPLE_CONNECT } from "./AppleApproachQueries";
import { useLogIn } from "../../../context/AuthContext";
import Toast from "react-native-root-toast";
import { ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Touchable = styled.TouchableOpacity``;

const Container = styled.View`
  flex-direction: row;
  background-color: #000;
  width: 260px;
  height: 40px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const LoginTextContainer = styled.View`
  width: 220px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

export default ({ cityId, countryCode }) => {
  const [loading, setLoading] = useState(false);
  const logIn = useLogIn();
  const [appleConnectFn, { loading: appleConnectLoading }] = useMutation<
    AppleConnect,
    AppleConnectVariables
  >(APPLE_CONNECT);
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
      console.log(credential);
      if (credential.user && credential.user.length > 0) {
        try {
          const {
            data: { appleConnect }
          } = await appleConnectFn({
            variables: {
              firstName: credential.fullName.givenName,
              lastName: credential.fullName.familyName,
              email: credential.email,
              cityId,
              countryCode,
              appleId: credential.user
            }
          });
          await logIn(appleConnect);
          await toast(`Welcome!`);
          await setLoading(false);
        } catch ({ message }) {
          console.log(`Apple Login Error: ${message}`);
          setLoading(false);
        }
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
    <Touchable disabled={loading} onPress={() => appleLogin()}>
      <Container>
        {loading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <LoginTextContainer>
            <FontAwesome
              name={"apple"}
              color={"white"}
              size={25}
              style={{ marginRight: 10 }}
            />
            <Text>Continue with Apple</Text>
          </LoginTextContainer>
        )}
      </Container>
    </Touchable>
  );
};
