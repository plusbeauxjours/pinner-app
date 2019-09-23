import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import styled from "styled-components";

const Text = styled.Text``;

interface IProps {
  name: string;
  color?: string;
  size?: number;
  focused?: boolean;
}

const NavIcon: React.FC<IProps> = ({
  name,
  color,
  size = 26,
  focused = true
}) => (
  <>
    <Ionicons
      name={name}
      color={focused ? color : theme.lightGreyColor}
      size={size}
    />
    <Text>Search</Text>
  </>
);

export default NavIcon;
