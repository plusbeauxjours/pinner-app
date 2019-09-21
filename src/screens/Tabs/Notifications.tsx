import React from "react";
import styled from "styled-components";
import { useMe } from "../../context/MeContext";
import { useLocation } from "../../context/LocationContext";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => {
  const me = useMe();
  const location = useLocation();
  console.log("useLocation::", location);
  return (
    <View>
      <View>
        <Text>{me && me.user.username}</Text>
      </View>
    </View>
  );
};
