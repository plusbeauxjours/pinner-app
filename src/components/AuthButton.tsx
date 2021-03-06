import React from "react";
import { ActivityIndicator } from "react-native";

import styled from "styled-components";

import constants from "../../constants";

const Touchable = styled.TouchableOpacity``;

const Container = styled.View<ITheme>`
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : props.theme.blueColor};
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

interface ITheme {
  bgColor?: string;
}

interface IProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
  bgColor?: string;
}

const AuthButton: React.FC<IProps> = ({
  text,
  onPress,
  loading = false,
  bgColor = null,
}) => (
  <Touchable disabled={loading} onPress={onPress}>
    <Container bgColor={bgColor}>
      {loading ? <ActivityIndicator color={"white"} /> : <Text>{text}</Text>}
    </Container>
  </Touchable>
);

export default AuthButton;
