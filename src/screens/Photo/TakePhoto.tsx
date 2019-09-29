import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default ({ navigation }) => (
  <View>
    <TouchableOpacity onPress={() => navigation.push("UploadPhoto")}>
      <Text>Take</Text>
    </TouchableOpacity>
  </View>
);
