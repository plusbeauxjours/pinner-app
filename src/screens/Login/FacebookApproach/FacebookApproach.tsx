import styled from "styled-components";
import * as Facebook from "expo-facebook";
import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import { FacebookConnect, FacebookConnectVariables } from "../../../types/api";
import { FACEBOOK_CONNECT } from "./FacebookApproachQueries";
import { useLogIn } from "../../../context/AuthContext";
import Toast from "react-native-root-toast";
import { ActivityIndicator } from "react-native";

const Touchable = styled.TouchableOpacity``;

const Container = styled.View`
  background-color: #2d4da7;
  padding: 10px;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 40px;
  border-radius: 5px;
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

export default () => {
  const [loading, setLoading] = useState(false);
  const logIn = useLogIn();
  const [facebookConnectFn, { loading: facebookConnectLoading }] = useMutation<
    FacebookConnect,
    FacebookConnectVariables
  >(FACEBOOK_CONNECT);
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const fbLogin = async () => {
    try {
      setLoading(true);
      Facebook.initializeAsync("242663513281642", "Pinner");
      const permissions = ["public_profile", "email"];
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync("242663513281642", {
        permissions
      });
      console.log(type, token);
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
    }
  };
  return (
    <Touchable disabled={loading} onPress={fbLogin}>
      <Container>
        {loading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <Text>LOG IN WITH FACEBOOK</Text>
        )}
      </Container>
    </Touchable>
  );
};
