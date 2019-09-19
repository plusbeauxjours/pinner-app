import React from "react";
import styled from "styled-components";
import constants from "../../constants";
import { ActivityIndicator } from "react-native";

const Touchable = styled.TouchableOpacity``;

const Container = styled.View<ITheme>`
  background-color: ${props =>
    props.bgColor ? props.bgColor : props.theme.blueColor};
  padding: 10px;
  margin: 0px 50px;
  border-radius: 4px;
  width: ${constants.width / 2};
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

interface IProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
  bgColor?: string;
}

interface ITheme {
  bgColor?: string;
}

const AuthButton: React.FC<IProps> = ({
  text,
  onPress,
  loading = false,
  bgColor = null
}) => (
  <Touchable disabled={loading} onPress={onPress}>
    <Container bgColor={bgColor}>
      {loading ? <ActivityIndicator color={"white"} /> : <Text>{text}</Text>}
    </Container>
  </Touchable>
);

export default AuthButton;
