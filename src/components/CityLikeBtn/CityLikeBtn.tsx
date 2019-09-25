import React, { useState } from "react";
import { TOGGLE_LIKE_CITY } from "./CityLikeBtnQueries";
import {
  ToggleLikeCity,
  ToggleLikeCityVariables,
  CityProfile,
  CityProfileVariables
} from "../../types/api";
import { useMutation } from "react-apollo";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Text } from "react-native";
import { theme } from "../../styles/theme";
import { CITY_PROFILE } from "../../screens/Tabs/LocationTab/CityProfile/CityProfileQueries";
import { FREQUENT_VISITS } from "../../screens/Tabs/UserProfileTab/Cities/CitiesQueries";
import { COUNTRY_PROFILE } from "../../screens/Tabs/LocationTab/CountryProfile/CountryProfileQueries";
import { useMe } from "../../context/MeContext";
import { useLocation } from "../../context/LocationContext";
import {
  FrequentVisits,
  FrequentVisitsVariables,
  CountryProfile,
  CountryProfileVariables
} from "../../types/api";

const Touchable = styled.TouchableOpacity``;
const IconContainer = styled.View`
  margin-right: 10px;
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
    {
      variables: { cityId },
      update(cache, { data: { toggleLikeCity } }) {
        try {
          const data = cache.readQuery<CityProfile, CityProfileVariables>({
            query: CITY_PROFILE,
            variables: { cityId: location.currentCityId }
          });
          if (data) {
            data.cityProfile.city.isLiked = toggleLikeCity.city.isLiked;
            data.cityProfile.city.likeCount = toggleLikeCity.city.likeCount;
            cache.writeQuery({
              query: CITY_PROFILE,
              variables: { cityId: location.currentCityId },
              data
            });
          }
        } catch (e) {
          console.log(e);
        }
        try {
          const data = cache.readQuery<FrequentVisits, FrequentVisitsVariables>(
            {
              query: FREQUENT_VISITS,
              variables: { userName: me.user.username }
            }
          );
          if (data) {
            data.frequentVisits.cities.find(
              i => i.id === toggleLikeCity.city.id
            ).isLiked = toggleLikeCity.city.isLiked;
            data.frequentVisits.cities.find(
              i => i.id === toggleLikeCity.city.id
            ).likeCount = toggleLikeCity.city.likeCount;
            cache.writeQuery({
              query: FREQUENT_VISITS,
              variables: { userName: me.user.username },
              data
            });
          }
        } catch (e) {
          console.log(e);
        }
        try {
          const data = cache.readQuery<CountryProfile, CountryProfileVariables>(
            {
              query: COUNTRY_PROFILE,
              variables: { countryCode: location.currentCountryCode }
            }
          );
          if (data) {
            data.countryProfile.cities.find(
              i => i.id === toggleLikeCity.city.id
            ).isLiked = toggleLikeCity.city.isLiked;
            data.countryProfile.cities.find(
              i => i.id === toggleLikeCity.city.id
            ).likeCount = toggleLikeCity.city.likeCount;
            cache.writeQuery({
              query: COUNTRY_PROFILE,
              variables: { countryCode: location.currentCountryCode },
              data
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
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

  return (
    <Touchable onPress={handleLike}>
      <IconContainer>
        <Ionicons
          size={24}
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
        <Touchable>
          <Text>{likeCount === 1 ? "1 like" : `${likeCount} likes`}</Text>
        </Touchable>
      </IconContainer>
    </Touchable>
  );
};
export default CityLikeBtn;
