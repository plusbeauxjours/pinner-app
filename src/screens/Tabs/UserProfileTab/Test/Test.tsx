import React from "react";
import styled from "styled-components";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: ${props => props.theme.bgColor};
`;

const Text = styled.Text``;

export default ({ navigation }) => {
  return (
    <View>
      <Text>hahiahaihi</Text>
    </View>
  );
};
