import * as React from "react";
import { GET_CITY_PHOTO } from "./Search/SearchQueries";
import { Image } from "react-native";
import { useQuery } from "react-apollo";
import { GetCityPhoto, GetCityPhotoVariables } from "../types/api";
import styled from "styled-components";

const View = styled.View`
  width: 40;
  height: 40;
`;

interface IProps {
  cityId?: string;
}

const SearchCityPhoto: React.FC<IProps> = ({ cityId }) => {
  const { data, loading } = useQuery<GetCityPhoto, GetCityPhotoVariables>(
    GET_CITY_PHOTO,
    { variables: { cityId } }
  );
  if (!loading) {
    const { getCityPhoto: { photo = null } = {} } = data;
    return (
      <Image
        style={{ height: 40, width: 40, borderRadius: 5 }}
        source={
          photo && {
            uri: photo
          }
        }
      />
    );
  } else {
    return <View />;
  }
};

export default SearchCityPhoto;
