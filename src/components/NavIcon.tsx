import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

interface IProps {
  name: string;
  color?: string;
  size?: number;
}

const NavIcon: React.FC<IProps> = ({ name, color, size = 26 }) => (
  <Ionicons
    style={{ backgroundColor: "transparent" }}
    name={name}
    color={color}
    size={size}
  />
);

export default NavIcon;
