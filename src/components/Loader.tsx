import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components";
import constants from "../../constants";

const Container = styled.View`
  width: ${constants.width};
  justify-content: center;
  align-items: center;
`;

export default () => (
  <Container>
    <ActivityIndicator color={"#999"} />
  </Container>
);
