import React from "react";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

const Text = styled.Text``;

interface IProps {
  name: string;
  color?: any;
  size?: number;
  focused?: boolean;
}

const NavIcon: React.FC<IProps> = ({
  name,
  color,
  size = 26,
  focused = true
}) => {
  const isDarkMode = useTheme();
  if (isDarkMode) {
    return (
      <Ionicons
        name={name}
        color={focused ? "#EFEFEF" : "#424242"}
        size={size}
      />
    );
  } else {
    return (
      <Ionicons
        name={name}
        color={focused ? "#161616" : "#DADADA"}
        size={size}
      />
    );
  }
};

export default NavIcon;
