import React from "react";
import styled from "styled-components";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${props => props.theme.bgColor};
`;

const Text = styled.Text`
  color: ${props => props.theme.color};
`;

export default () => (
  <View>
    <Text>Upload</Text>
  </View>
);
