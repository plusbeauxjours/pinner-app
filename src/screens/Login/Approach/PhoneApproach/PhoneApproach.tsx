import React, { useState } from "react";
import styled from "styled-components";
import AuthButton from "../../../../components/AuthButton";
import AuthInput from "../../../../components/AuthInput";
import useInput from "../../../../hooks/useInput";
import { TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { PHONE_SIGN_IN } from "./PhoneApproachQueries";
import { useMutation } from "react-apollo-hooks";
import {
  StartPhoneVerification,
  StartPhoneVerificationVariables
} from "../../../../types/api";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default ({ navigation }) => {
  const phoneNumberInput = useInput("");
  const countryNumberInput = useInput("");
  const [loading, setLoading] = useState(false);
  const [phoneSignInFn] = useMutation<
    StartPhoneVerification,
    StartPhoneVerificationVariables
  >(PHONE_SIGN_IN, {
    variables: {
      phoneNumber: `${countryNumberInput.value}${
        phoneNumberInput.value.startsWith("0")
          ? phoneNumberInput.value.substring(1)
          : phoneNumberInput.value
      }`
    }
  });
  const handleLogin = async () => {
    const { value: phoneNumber } = phoneNumberInput;
    const { value: countryNumber } = countryNumberInput;
    const phone = `${countryNumber}${
      phoneNumber.startsWith("0") ? phoneNumber.substring(1) : phoneNumber
    }`;
    const phoneRegex = /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
    if (phoneNumber === "") {
      return Alert.alert("Phone number can't be empty");
    } else if (countryNumber === "") {
      return Alert.alert("Please choose a country");
    } else if (!phoneRegex.test(phone)) {
      return Alert.alert("That phone number is invalid");
    }
    try {
      setLoading(true);
      const {
        data: { startPhoneVerification }
      } = await phoneSignInFn();
      if (startPhoneVerification) {
        Alert.alert("SMS Sent! ");
        navigation.navigate("PhoneVerification");
        return;
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
          {...countryNumberInput}
          placeholder="countryNumberInput"
          keyboardType="phone-pad"
          returnKeyType="send"
          onSubmitEditing={handleLogin}
          autoCorrect={false}
        />
        <AuthInput
          {...phoneNumberInput}
          placeholder="phoneNumberInput"
          keyboardType="phone-pad"
          returnKeyType="send"
          onSubmitEditing={handleLogin}
          autoCorrect={false}
        />

        <AuthButton loading={loading} onPress={handleLogin} text="Send SMS" />
      </View>
    </TouchableWithoutFeedback>
  );
};
