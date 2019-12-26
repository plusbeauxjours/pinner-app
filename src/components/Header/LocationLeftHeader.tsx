import React from "react";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const Text = styled.Text`
  font-weight: 500;
  font-size: 18px;
  color: ${props => props.theme.color};
`;

const View = styled.View``;

const IconContainer = styled.TouchableOpacity`
  width: 50px;
`;

const LocationLeftHeader = ({ navigation }) => {
  const isDarkMode = useTheme();
  if (navigation.state.params === undefined) {
    return (
      <View>
        <Text>LOCATIONS</Text>
      </View>
    );
  } else {
    return (
      <IconContainer onPress={() => navigation.goBack(null)}>
        <AntDesign
          size={25}
          color={isDarkMode ? "#EFEFEF" : "#161616"}
          name={"left"}
        />
      </IconContainer>
    );
  }
};

export default withNavigation(LocationLeftHeader);
