import React from "react";
import styled from "styled-components";
import { useMe } from "../../context/MeContext";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => {
  const me = useMe();
  return (
    <View>
      <View>
        <Text>{me && me.user.username}</Text>
      </View>
    </View>
  );
};
