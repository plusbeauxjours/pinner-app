import React, { useState, useEffect } from "react";

import { useMutation } from "react-apollo";

import {
  ToggleLikeCity,
  ToggleLikeCityVariables,
  CityProfile,
  CityProfileVariables,
  CountryProfile,
  CountryProfileVariables,
} from "../../types/api";

import { TOGGLE_LIKE_CITY } from "./CityLikeBtnQueries";
import CityLikeBtnPresenter from "./CityLikeBtnPresenter";
import { CITY_PROFILE } from "../../screens/Tabs/LocationTab/CityProfile/CityProfileQueries";
import { COUNTRY_PROFILE } from "../../screens/Tabs/LocationTab/CountryProfile/CountryProfileQueries";

interface IProps {
  isLiked: boolean;
  likeCount: number;
  cityId: string;
  height?: string;
}

const CityLikeBtnContainer: React.FC<IProps> = ({
  isLiked: isLikedProp,
  likeCount: likeCountProp,
  cityId,
  height,
}) => {
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);

  // MUTATION

  const [toggleLikeFn, { loading }] = useMutation<
    ToggleLikeCity,
    ToggleLikeCityVariables
  >(TOGGLE_LIKE_CITY, {
    variables: { cityId },
    update(cache, { data: { toggleLikeCity } }) {
      try {
        const data = cache.readQuery<CityProfile, CityProfileVariables>({
          query: CITY_PROFILE,
          variables: { cityId },
        });
        if (data) {
          data.cityProfile.city.isLiked = toggleLikeCity.city.isLiked;
          data.cityProfile.city.likeCount = toggleLikeCity.city.likeCount;
          cache.writeQuery({
            query: CITY_PROFILE,
            variables: { cityId },
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const {
          city: {
            country: { countryCode },
          },
        } = toggleLikeCity;
        const data = cache.readQuery<CountryProfile, CountryProfileVariables>({
          query: COUNTRY_PROFILE,
          variables: { countryCode },
        });
        if (data) {
          data.countryProfile.cities.find(
            (i) => i.cityId === toggleLikeCity.city.cityId
          ).isLiked = toggleLikeCity.city.isLiked;
          data.countryProfile.cities.find(
            (i) => i.cityId === toggleLikeCity.city.cityId
          ).likeCount = toggleLikeCity.city.likeCount;
          cache.writeQuery({
            query: COUNTRY_PROFILE,
            variables: { countryCode },
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  // FUNC

  const handleLike = async () => {
    if (!loading) {
      if (isLiked === true) {
        setLikeCount((l) => l - 1);
      } else {
        setLikeCount((l) => l + 1);
      }
      setIsLiked((p) => !p);
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
    <CityLikeBtnPresenter
      loading={loading}
      handleLike={handleLike}
      height={height}
      isLiked={isLiked}
      likeCount={likeCount}
    />
  );
};

export default CityLikeBtnContainer;
