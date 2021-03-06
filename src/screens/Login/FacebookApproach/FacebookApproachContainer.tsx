import React, { useState } from "react";

import * as Facebook from "expo-facebook";
import Toast from "react-native-root-toast";
import { useMutation } from "react-apollo-hooks";

import { FACEBOOK_CONNECT } from "./FacebookApproachQueries";
import FacebookApproachPresenter from "./FacebookApproachPresenter";
import { FacebookConnect, FacebookConnectVariables } from "../../../types/api";
import { useLogIn } from "../../../context/AuthContext";

interface IProps {
  cityId: string;
  countryCode: string;
}

const FacebookApproachContainer: React.FC<IProps> = ({
  cityId,
  countryCode,
}) => {
  const [loading, setLoading] = useState(false);
  const logIn = useLogIn();

  // MUTATION

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
      delay: 0,
    });
  };

  // FUNC

  const fbLogin = async () => {
    try {
      await Facebook.initializeAsync("242663513281642", "Pinner");
      const authResult = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
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
          gender,
        } = await response.json();
        const {
          data: { facebookConnect },
        } = await facebookConnectFn({
          variables: {
            firstName: first_name,
            lastName: last_name,
            email,
            gender,
            cityId,
            countryCode,
            fbId: id,
          },
        });
        await logIn(facebookConnect);
        await toast(`Welcome ${first_name}!`);
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FacebookApproachPresenter
      loading={loading}
      setLoading={setLoading}
      fbLogin={fbLogin}
    />
  );
};

export default FacebookApproachContainer;
