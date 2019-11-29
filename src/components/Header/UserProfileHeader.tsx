import React from "react";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useMe } from "../../context/MeContext";
import PhotoLink from "../PhotoLink";

const Text = styled.Text`
  font-weight: 500;
  font-size: 20;
  color: ${props => props.theme.color};
`;

const View = styled.View`
  margin-left: 20px;
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

export default withNavigation(UserProfileHeader);
