import React from "react";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useMe } from "../../context/MeContext";
import PhotoLink from "../PhotoLink";

const Text = styled.Text`
  font-weight: 500;
  font-size: 18px;
  color: ${props => props.theme.color};
  margin-bottom: 10px;
  margin-top: 10px;
  margin-left: 15px;
`;

const View = styled.View``;

const IconContainer = styled.TouchableOpacity`
  margin-bottom: 5px;
  margin-left: 10px;
  width: 50px;
`;

const UserProfileHeader = ({ navigation }) => {
  const { me } = useMe();
  const isDarkMode = useTheme();
  if (!navigation.state.params) {
    if (navigation.state.index === 0) {
      return (
        <View>
          <Text>USER PROFILE</Text>
        </View>
      );
    } else if (navigation.state.index === 1) {
      return <PhotoLink />;
    } else {
      return null;
    }
  } else if (
    navigation.state.params.username === me.user.username &&
    navigation.state.index === 1
  ) {
    return <PhotoLink />;
  } else {
    return (
      <IconContainer onPress={() => console.log("navigation.goBack")}>
        <AntDesign
          size={25}
          color={isDarkMode ? "#EFEFEF" : "#161616"}
          name={"left"}
        />
      </IconContainer>
    );
  }
};

export default withNavigation(UserProfileHeader);
