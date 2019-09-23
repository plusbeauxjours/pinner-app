import React from "react";
import { Platform } from "react-native";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import NavIcon from "./NavIcon";

const Container = styled.TouchableOpacity`
  padding-right: 20px;
`;

export default withNavigation(({ navigation }) => (
  <Container onPress={() => navigation.navigate("PhotoNavigation")}>
    <NavIcon name={Platform.OS === "ios" ? "ios-add" : "md-add"} />
  </Container>
));
