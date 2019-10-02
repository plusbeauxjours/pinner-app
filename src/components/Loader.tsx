import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components";
import { theme } from "../styles/theme";

const Container = styled.View`
  /* flex: 1; */
  justify-content: center;
  align-items: center;
`;

export default () => (
  <Container>
    <ActivityIndicator color={theme.darkGreyColor} />
  </Container>
);
