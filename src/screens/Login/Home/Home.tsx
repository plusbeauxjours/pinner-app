import React from "react";
import styled from "styled-components";
import constants from "../../../../constants";
import FacebookApproach from "../Approach/FacebookApproach";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Image = styled.Image`
  width: ${constants.width / 2.5};
`;

const Touchable = styled.TouchableOpacity`
  margin-bottom: 10px;
`;
const LoginLink = styled.View``;
const LoginLinkText = styled.Text`
  color: ${props => props.theme.blueColor};
  margin-top: 20px;
  font-weight: 600;
`;

export default ({ navigation }) => {
  return (
    <View>
      <Image
        resizeMode={"contain"}
        source={require("../../../../assets/logo.png")}
      />
      <Touchable onPress={() => navigation.push("PhoneApproach")}>
        <LoginLink>
          <LoginLinkText>LOG IN WITH PHONE NUMBER</LoginLinkText>
        </LoginLink>
      </Touchable>
      <FacebookApproach />
    </View>
  );
};
