import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components";

const Container = styled.View`
  justify-content: center;
  align-items: center;
`;

export default () => (
  <Container>
    <ActivityIndicator color={"#999"} />
  </Container>
);
