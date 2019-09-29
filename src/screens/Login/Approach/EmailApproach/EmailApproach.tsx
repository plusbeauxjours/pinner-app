import React, { useState } from "react";
import styled from "styled-components";
import AuthButton from "../../../../components/AuthButton";
import AuthInput from "../../../../components/AuthInput";
import useInput from "../../../../hooks/useInput";
import { TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { EMAIL_SIGN_IN } from "./EmailApproachQueries";
import { useMutation } from "react-apollo-hooks";
import {
  StartEmailVerification,
  StartEmailVerificationVariables
} from "../../../../types/api";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default ({ navigation }) => {
  const emailInput = useInput("");
  const [loading, setLoading] = useState(false);
  const [emailSignInFn] = useMutation<
    StartEmailVerification,
    StartEmailVerificationVariables
  >(EMAIL_SIGN_IN, {
    variables: { emailAddress: emailInput.value }
  });
  const handleLogin = async () => {
    const { value } = emailInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === "") {
      return Alert.alert("Email can't be empty");
    } else if (!value.includes("@") || !value.includes(".")) {
      return Alert.alert("Please write an email");
    } else if (!emailRegex.test(value)) {
      return Alert.alert("That email is invalid");
    }
    try {
      setLoading(true);
      const {
        data: { startEmailVerification }
      } = await emailSignInFn();
      if (startEmailVerification) {
        Alert.alert("Check your email");
        navigation.replace("EmailVerification");
        return null;
      } else {
        Alert.alert("Can't log in now");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...emailInput}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="send"
          onSubmitEditing={handleLogin}
          autoCorrect={false}
        />
        <AuthButton loading={loading} onPress={handleLogin} text="Log In" />
      </View>
    </TouchableWithoutFeedback>
  );
};
