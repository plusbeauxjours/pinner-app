import React from "react";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const Text = styled.Text`
  font-weight: 500;
  font-size: 20;
  color: ${props => props.theme.color};
`;

const View = styled.View`
  margin-left: 20px;
`;

const LocationRightHeader = ({ navigation }) => {
  const isDarkMode = useTheme();
  if (navigation.state.params === undefined) {
    return (
      <View>
        <Text>LOCATIONS</Text>
      </View>
    );
  } else {
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
  }
};

export default withNavigation(LocationRightHeader);
