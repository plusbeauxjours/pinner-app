import React from "react";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const IconContainer = styled.TouchableOpacity`
  width: 50px;
`;

const BackArrow = ({ navigation }) => {
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
};

export default withNavigation(BackArrow);
