import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components";
import constants from "../../../../constants";
import AuthButton from "../../../components/AuthButton";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Image = styled.Image`
  width: ${constants.width / 2.5};
`;

const Touchable = styled.TouchableOpacity``;
const LoginLink = styled.View``;
const LoginLinkText = styled.Text`
  color: ${props => props.theme.blueColor};
  margin-top: 20px;
  font-weight: 600;
`;

export default ({ navigation }) => (
  <View>
    <Image
      resizeMode={"contain"}
      source={require("../../../../assets/logo.png")}
    />
    <AuthButton
      text={"Create New Account"}
      onPress={() => navigation.navigate("Signup")}
    />
    <Touchable onPress={() => navigation.navigate("PhoneApproach")}>
      <LoginLink>
        <LoginLinkText>LOG IN WITH PHONE NUMBER</LoginLinkText>
      </LoginLink>
    </Touchable>
    <Touchable onPress={() => navigation.navigate("Facebook")}>
      <LoginLink>
        <LoginLinkText>LOG IN WITH FACEBOOK</LoginLinkText>
      </LoginLink>
    </Touchable>
  </View>
);
