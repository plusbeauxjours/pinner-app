import React from "react";
import styled from "styled-components";

const View = styled.View`
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text`
  color: ${props => props.theme.color};
`;

export default () => (
  <View>
    <Text>Select</Text>
  </View>
);
