import React, { useState, useEffect } from "react";
import { TOGGLE_LIKE_CITY } from "./CityLikeBtnQueries";
import { ToggleLikeCity, ToggleLikeCityVariables } from "../../types/api";
import { useMutation } from "react-apollo";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { theme } from "../../styles/theme";
import { useMe } from "../../context/MeContext";
import { useLocation } from "../../context/LocationContext";

const Touchable = styled.TouchableOpacity`
  width: 70px;
  height: 45px;
`;
const IconContainer = styled.View`
  flex: 1;
  flex-direction: row;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
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
  const [isSubmitted, setSubmitted] = useState(false);
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [toggleLikeFn] = useMutation<ToggleLikeCity, ToggleLikeCityVariables>(
    TOGGLE_LIKE_CITY,
    { variables: { cityId } }
  );
  const handleLike = async () => {
    if (!isSubmitted) {
      setSubmitted(true);
      if (isLiked === true) {
        setLikeCount(l => l - 1);
      } else {
        setLikeCount(l => l + 1);
      }
      setIsLiked(p => !p);
      try {
        await toggleLikeFn();
        setSubmitted(false);
      } catch (e) {
        setSubmitted(false);
      }
    }
  };
  useEffect(() => {
    setIsLiked(isLikedProp);
    setLikeCount(likeCountProp);
  }, [likeCountProp]);
  return (
    <Touchable onPress={handleLike}>
      <IconContainer>
        <Ionicons
          size={16}
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
