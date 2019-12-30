import styled from "styled-components";
import * as Facebook from "expo-facebook";
import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import { FacebookConnect, FacebookConnectVariables } from "../../../types/api";
import { FACEBOOK_CONNECT } from "./FacebookApproachQueries";
import { useLogIn } from "../../../context/AuthContext";
import Toast from "react-native-root-toast";
import { ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Touchable = styled.TouchableOpacity``;

const Container = styled.View`
  background-color: #2d4da7;
  width: 260px;
  height: 40px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const LoginTextContainer = styled.View`
  width: 200px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

export default ({ cityId, countryCode }) => {
  const [loading, setLoading] = useState(false);
  const logIn = useLogIn();
  const [facebookConnectFn, { loading: facebookConnectLoading }] = useMutation<
    FacebookConnect,
    FacebookConnectVariables
  >(FACEBOOK_CONNECT);
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
  const fbLogin = async () => {
    try {
      await Facebook.initializeAsync("242663513281642", "Pinner");
      const authResult = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"]
      });
      if (authResult.type === "success") {
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${authResult.token}&fields=id,name,last_name,first_name,email,gender`
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
            cityId,
            countryCode,
            fbId: id
          }
        });
        await logIn(facebookConnect);
        await toast(`Welcome ${first_name}!`);
        await setLoading(false);
      } else {
        // type === 'cancel'
        setLoading(false);
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Touchable
      disabled={loading}
      onPress={() => {
        setLoading(true), fbLogin();
      }}
    >
      <Container>
        {loading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <LoginTextContainer>
            <FontAwesome
              name={"facebook"}
              color={"white"}
              size={25}
              style={{ marginRight: 10 }}
            />
            <Text>Continue with Facebook</Text>
          </LoginTextContainer>
        )}
      </Container>
    </Touchable>
  );
};
