import React from "react";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const View = styled.View`
  flex-direction: row;
  margin-left: 20px;
  align-items: center;
`;

const LocationCenterHeader = ({ navigation }) => {
  const isDarkMode = useTheme();
  console.log(navigation);
  if (navigation.state.routeName === "CityProfileTabs") {
    if (navigation.state.index === 0) {
      return (
        <View>
          <FontAwesome name={"circle"} color={"#EFEFEF"} size={12} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
          <FontAwesome name={"circle"} color={"#424242"} size={10} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
          <FontAwesome name={"circle"} color={"#424242"} size={10} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
        </View>
      );
    } else if (navigation.state.index === 1) {
      return (
        <View>
          <FontAwesome name={"circle"} color={"#424242"} size={10} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
          <FontAwesome name={"circle"} color={"#EFEFEF"} size={12} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
          <FontAwesome name={"circle"} color={"#424242"} size={10} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
        </View>
      );
    } else if (navigation.state.index === 2) {
      return (
        <View>
          <FontAwesome name={"circle"} color={"#424242"} size={10} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
          <FontAwesome name={"circle"} color={"#424242"} size={10} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
          <FontAwesome name={"circle"} color={"#EFEFEF"} size={12} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
        </View>
      );
    }
  } else if (navigation.state.routeName === "CountryProfileTabs") {
    if (navigation.state.index === 0) {
      return (
        <View>
          <FontAwesome name={"circle"} color={"#EFEFEF"} size={12} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
          <FontAwesome name={"circle"} color={"#424242"} size={10} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
        </View>
      );
    } else if (navigation.state.index === 1) {
      return (
        <View>
          <FontAwesome name={"circle"} color={"#424242"} size={10} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
          <FontAwesome name={"circle"} color={"#EFEFEF"} size={12} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
        </View>
      );
    }
  } else if (navigation.state.routeName === "ContinentProfile") {
    return (
      <View>
        <FontAwesome name={"circle"} color={"#EFEFEF"} size={12} style={{marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>
      </View>
    );
  }
};

export default withNavigation(LocationCenterHeader);
