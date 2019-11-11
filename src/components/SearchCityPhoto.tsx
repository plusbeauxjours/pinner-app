import * as React from "react";
import { GET_CITY_PHOTO } from "./Search/SearchQueries";
import { Image } from "react-native";
import { useQuery } from "react-apollo";
import { GetCityPhoto, GetCityPhotoVariables } from "../types/api";
import styled from "styled-components";

const SmallText = styled.Text`
  font-size: 9px;
  color: #999;
  text-align: center;
`;
const View = styled.View`
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 40px;
  width: 40px;
  border: 0.5px solid #999;
  padding: 2px;
  border-radius: 5px;
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
      <>
        {photo && photo.length !== 0 ? (
          <Image
            style={{ height: 40, width: 40, borderRadius: 5 }}
            source={
              photo && {
                uri: photo
              }
            }
          />
        ) : (
          <View>
            <SmallText>NO PHOTO</SmallText>
          </View>
        )}
      </>
    );
  } else {
    return <View />;
  }
};

export default SearchCityPhoto;
