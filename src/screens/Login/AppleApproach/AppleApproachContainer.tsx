import React, { useState } from "react";

import { useMutation } from "react-apollo-hooks";
import Toast from "react-native-root-toast";
import * as AppleAuthentication from "expo-apple-authentication";

import { APPLE_CONNECT } from "./AppleApproachQueries";
import { AppleConnect, AppleConnectVariables } from "../../../types/api";
import { useLogIn } from "../../../context/AuthContext";
import AppleApproachPresenter from "./AppleApproachPresenter";

interface IProps {
  cityId: string;
  countryCode: string;
}

const AppleApproachContainer: React.FC<IProps> = ({ cityId, countryCode }) => {
  const [loading, setLoading] = useState(false);
  const logIn = useLogIn();

  // MUTATION

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
      delay: 0,
    });
  };

  // FUNC

  const appleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      try {
        const {
          data: { appleConnect },
        } = await appleConnectFn({
          variables: {
            firstName: credential.fullName.givenName,
            lastName: credential.fullName.familyName,
            email: credential.email,
            cityId,
            countryCode,
            appleId: credential.user,
          },
        });
        await logIn(appleConnect);
        await toast(`Welcome!`);
        await setLoading(false);
      } catch ({ message }) {
        console.log(`Apple Login Error: ${message}`);
        setLoading(false);
      }
    } catch ({ message }) {
      console.log(`Apple Login Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppleApproachPresenter
      loading={loading}
      setLoading={setLoading}
      appleLogin={appleLogin}
    />
  );
};

export default AppleApproachContainer;
