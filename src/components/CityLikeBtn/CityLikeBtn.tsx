import React, { useState, useEffect } from "react";
import { TOGGLE_LIKE_CITY } from "./CityLikeBtnQueries";
import {
  ToggleLikeCity,
  ToggleLikeCityVariables,
} from "../../types/api";
import { useMutation } from "react-apollo";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { theme } from "../../styles/theme";
import { useMe } from "../../context/MeContext";
import { useLocation } from "../../context/LocationContext";

const Touchable = styled.TouchableOpacity`
  width: 70px;
`;
const IconContainer = styled.View`
  flex: 1;
  flex-direction: row;
  margin-right: 10px;
`;
const Text = styled.Text`
  margin-left: 10px;
`;

interface IProps {
  isLiked: boolean;
  cityId: string;
  likeCount: number;
}

const CityLikeBtn: React.FC<IProps> = ({
  isLiked: isLikedProp,

  cityId,
  likeCount: likeCountProp
}) => {
  const me = useMe();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [toggleLikeFn] = useMutation<ToggleLikeCity, ToggleLikeCityVariables>(
    TOGGLE_LIKE_CITY,
    {variables: { cityId }}
  );
  const handleLike = async () => {
    if (isLiked === true) {
      setLikeCount(l => l - 1);
    } else {
      setLikeCount(l => l + 1);
    }
    setIsLiked(p => !p);
    try {
      await toggleLikeFn();
    } catch (e) {}
  };
  useEffect(() => {
    console.log("working");
    setIsLiked(isLikedProp);
    setLikeCount(likeCountProp);
  }, [likeCountProp]);
  return (
    <Touchable onPress={handleLike}>
      <IconContainer>
        <Ionicons
          size={18}
          color={isLiked ? theme.blueColor : theme.darkBlueColor}
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
export default CityLikeBtn;
