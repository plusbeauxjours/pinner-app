import React from "react";
import { Platform } from "react-native";

import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../styles/theme";

const Touchable = styled.TouchableOpacity<ITheme>`
  margin-left: 3px;
  width: 70px;
  height: ${(props) => (props.height ? props.height : "45px")};
`;

const IconContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  margin-left: 10px;
  color: ${(props) => props.theme.color};
`;

interface ITheme {
  height: string;
}

interface IProps {
  loading: boolean;
  handleLike: () => void;
  height: string;
  isLiked: boolean;
  likeCount: number;
}

const CityLikeBtnPresenter: React.FC<IProps> = ({
  loading,
  handleLike,
  height,
  isLiked,
  likeCount,
}) => {
  return (
    <Touchable disabled={loading} onPress={handleLike} height={height}>
      <IconContainer>
        <Ionicons
          size={16}
          color={isLiked ? theme.blueColor : "#999"}
          name={
            Platform.OS === "ios"
              ? isLiked
                ? "ios-heart"
                : "ios-heart-empty"
              : isLiked
              ? "md-heart"
              : "md-heart-empty"
          }
        />
        <Text>{likeCount === 1 ? "1 like" : `${likeCount} likes`}</Text>
      </IconContainer>
    </Touchable>
  );
};
export default CityLikeBtnPresenter;
