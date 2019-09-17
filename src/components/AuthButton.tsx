import React from "react";
import styled from "styled-components";
import constants from "../../constants";
import { ActivityIndicator } from "react-native";

const Touchable = styled.TouchableOpacity``;

const Container = styled.View`
  background-color: ${props => props.theme.blueColor};
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
  loading: boolean;
}

const AuthButton: React.FC<IProps> = ({ text, onPress, loading = false }) => (
  <Touchable disabled={loading} onPress={onPress}>
    <Container>
      {loading ? <ActivityIndicator color={"white"} /> : <Text>{text}</Text>}
    </Container>
  </Touchable>
);

export default AuthButton;
