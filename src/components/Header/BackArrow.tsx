import React from "react";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const View = styled.View`
  margin-left: 20px;
`;

const BackArrow = ({ navigation }) => {
  const isDarkMode = useTheme();
  return (
    <View>
      <AntDesign
        size={30}
        color={isDarkMode ? "#EFEFEF" : "#161616"}
        name={"left"}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default withNavigation(BackArrow);