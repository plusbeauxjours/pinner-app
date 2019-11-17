import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
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
      <Ionicons name={name} color={focused ? "red" : "green"} size={size} />
    );
  } else {
    return (
      <Ionicons name={name} color={focused ? "orange" : "blue"} size={size} />
    );
  }
};

export default NavIcon;
