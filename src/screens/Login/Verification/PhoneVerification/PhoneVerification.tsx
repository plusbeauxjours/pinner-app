import React, { useState } from "react";
import styled from "styled-components";
import { Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../../../components/AuthButton";
import AuthInput from "../../../../components/AuthInput";
import useInput from "../../../../hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import { useLogIn } from "../../../../context/AuthContext";
import {
  CompletePhoneVerification,
  CompletePhoneVerificationVariables
} from "../../../../types/api";
import { COMPLETE_PHONE_SIGN_IN } from "./PhoneVerificationQueries";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default ({ navigation }) => {
  const verificationInput = useInput("");
  const logIn = useLogIn();
  const [loading, setLoading] = useState(false);
  const [completePhoneVerificationFn] = useMutation<
    CompletePhoneVerification,
    CompletePhoneVerificationVariables
  >(COMPLETE_PHONE_SIGN_IN, {
    variables: {
      key: verificationInput.value,
      phoneNumber: navigation.getParam("phoneNumber"),
      countryPhoneNumber: navigation.getParam("countryNumber"),
      countryPhoneCode: navigation.getParam("countryCode"),
      cityId: "ChIJuQhD6D7sfDURB6J0Dx5TGW8"
    }
  });
  const handleVerification = async () => {
    const { value } = verificationInput;
    if (value === "" || value.length !== 6) {
      return Alert.alert("Invalid Key");
    }
    try {
      setLoading(true);
      const {
        data: { completePhoneVerification }
      } = await completePhoneVerificationFn();
      if (completePhoneVerification.ok) {
        logIn(completePhoneVerification);
      } else {
        Alert.alert("Wrong Key");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Could not be Verified you");
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...verificationInput}
          placeholder="Key"
          returnKeyType="send"
          onSubmitEditing={handleVerification}
          autoCorrect={false}
          keyboardType="number-pad"
        />
        <AuthButton
          loading={loading}
          onPress={handleVerification}
          text="Verification"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
