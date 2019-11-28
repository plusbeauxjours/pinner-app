import React, { useState, useEffect } from "react";
import { TOGGLE_LIKE_CITY } from "./CityLikeBtnQueries";
import {
  ToggleLikeCity,
  ToggleLikeCityVariables,
  CityProfile,
  CityProfileVariables,
  CountryProfile,
  CountryProfileVariables
} from "../../types/api";
import { useMutation } from "react-apollo";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { theme } from "../../styles/theme";
import styled from "styled-components";
import { CITY_PROFILE } from "../../screens/Tabs/LocationTab/CityProfile/CityProfileQueries";
import { COUNTRY_PROFILE } from "../../screens/Tabs/LocationTab/CountryProfile/CountryProfileQueries";

const Touchable = styled.TouchableOpacity<ITheme>`
  margin-left: 3px;
  width: 70px;
  height: ${props => (props.height ? props.height : "45px")};
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
  color: ${props => props.theme.color};
`;

interface ITheme {
  height: string;
}

interface IProps {
  isLiked: boolean;
  cityId: string;
  likeCount: number;
  height?: string;
}

const CityLikeBtn: React.FC<IProps> = ({
  isLiked: isLikedProp,
  cityId,
  likeCount: likeCountProp,
  height
}) => {
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [toggleLikeFn, { loading }] = useMutation<
    ToggleLikeCity,
    ToggleLikeCityVariables
  >(TOGGLE_LIKE_CITY, {
    variables: { cityId },
    update(cache, { data: { toggleLikeCity } }) {
      try {
        const data = cache.readQuery<CityProfile, CityProfileVariables>({
          query: CITY_PROFILE,
          variables: { cityId }
        });
        if (data) {
          data.cityProfile.city.isLiked = toggleLikeCity.city.isLiked;
          data.cityProfile.city.likeCount = toggleLikeCity.city.likeCount;
          cache.writeQuery({
            query: CITY_PROFILE,
            variables: { cityId },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const {
          city: {
            country: { countryCode }
          }
        } = toggleLikeCity;
        const data = cache.readQuery<CountryProfile, CountryProfileVariables>({
          query: COUNTRY_PROFILE,
          variables: { countryCode }
        });
        if (data) {
          data.countryProfile.cities.find(
            i => i.cityId === toggleLikeCity.city.cityId
          ).isLiked = toggleLikeCity.city.isLiked;
          data.countryProfile.cities.find(
            i => i.cityId === toggleLikeCity.city.cityId
          ).likeCount = toggleLikeCity.city.likeCount;
          cache.writeQuery({
            query: COUNTRY_PROFILE,
            variables: { countryCode },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const handleLike = async () => {
    if (!loading) {
      if (isLiked === true) {
        setLikeCount(l => l - 1);
      } else {
        setLikeCount(l => l + 1);
      }
      setIsLiked(p => !p);
      try {
        await toggleLikeFn();
      } catch (e) {}
    }
  };
  useEffect(() => {
    setIsLiked(isLikedProp);
    setLikeCount(likeCountProp);
  }, [likeCountProp]);
  return (
    <Touchable disabled={loading} nPress={handleLike} height={height}>
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
export default CityLikeBtn;
