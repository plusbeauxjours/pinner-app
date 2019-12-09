import React from "react";
import styled from "styled-components";

const Text = styled.Text`
  font-weight: 500;
  font-size: 18px;
  color: ${props => props.theme.color};
  margin-bottom: 5px;
  margin-top: 10px;
  margin-left: 15px;
`;

const View = styled.View``;

export default () => {
  return (
    <View>
      <Text>MATCHES</Text>
    </View>
  );
};
