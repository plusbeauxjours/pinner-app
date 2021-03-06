import React from "react";
import { Ionicons, Entypo } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";

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
  focused = true,
}) => {
  const isDarkMode = useTheme();

  if (name === "pin") {
    if (isDarkMode) {
      return (
        <Entypo name={name} color={focused ? "#EFEFEF" : "#424242"} size={22} />
      );
    } else {
      return (
        <Entypo name={name} color={focused ? "#161616" : "#DADADA"} size={22} />
      );
    }
  } else {
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
  }
};

export default NavIcon;
