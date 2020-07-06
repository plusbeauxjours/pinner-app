import React from "react";

import styled from "styled-components";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { withNavigation } from "react-navigation";

const IconContainer = styled.TouchableOpacity`
  width: 50px;
`;

export default withNavigation(({ navigation }) => {
  const isDarkMode = useTheme();

  return (
    <IconContainer onPress={() => navigation.goBack(null)}>
      <AntDesign
        size={24}
        color={isDarkMode ? "#EFEFEF" : "#161616"}
        name={"left"}
      />
    </IconContainer>
  );
});
