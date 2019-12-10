import React from "react";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const Text = styled.Text`
  font-weight: 500;
  font-size: 18px;
  color: ${props => props.theme.color};
  margin-bottom: 5px;
  margin-top: 10px;
  margin-left: 15px;
`;

const View = styled.View``;

const IconContainer = styled.TouchableOpacity`
  margin-bottom: 3px;
  margin-left: 10px;
  width: 50px;
`;

export default withNavigation(({ navigation }) => {
  const isDarkMode = useTheme();
  if (!navigation.state.params) {
    return (
      <View>
        <Text>USER PROFILE</Text>
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
});
