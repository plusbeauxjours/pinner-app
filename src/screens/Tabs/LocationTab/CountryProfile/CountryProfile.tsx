import React, { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";

import Swiper from "react-native-swiper";
import {
  SlackReportLocations,
  SlackReportLocationsVariables
} from "../../../../types/api";
import { SLACK_REPORT_LOCATIONS } from "../../../../sharedQueries";
import {
  CountryProfile,
  CountryProfileVariables,
  GetCountries,
  GetCountriesVariables
} from "../../../../types/api";
import { COUNTRY_PROFILE, GET_COUNTRIES } from "./CountryProfileQueries";

const Container = styled.View``;

const Text = styled.Text``;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
`;

const UserContainer = styled.View``;

const UserColumn = styled.View``;

const Item = styled.View`
  flex: 1;
  margin-bottom: 25px;
`;
const Title = styled.Text`
  font-weight: 500;
  font-size: 18px;
  padding-left: 15px;
  margin-bottom: 5px;
`;

export default () => {
  const me = useMe();
  const location = useLocation();
  const [countryCode, setCountryCode] = useState<string>(
    location.currentCountryCode
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [payload, setPayload] = useState<string>();
  const [slackReportLocationsFn] = useMutation<
    SlackReportLocations,
    SlackReportLocationsVariables
  >(SLACK_REPORT_LOCATIONS, {
    variables: {
      targetLocationId: countryCode,
      targetLocationType: "country",
      payload
    }
  });
  const {
    data: profileData,
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<CountryProfile, CountryProfileVariables>(COUNTRY_PROFILE, {
    variables: { countryCode: "JP" }
  });
  const {
    data: countriesData,
    loading: countriesLoading,
    refetch: countriesRefetch
  } = useQuery<GetCountries, GetCountriesVariables>(GET_COUNTRIES, {
    variables: { countryCode: "JP" }
  });
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await profileRefetch();
      await countriesRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  if (profileLoading || countriesLoading) {
    return <Loader />
  } else if (
    !profileLoading &&
    !countriesLoading &&
    profileData &&
    countriesData
  ) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          <Bold>Country Profile</Bold>
          {profileData.countryProfile.country && (
            <>
              <Text>
                cityName:{profileData.countryProfile.country.countryName}
                {profileData.countryProfile.country.countryEmoji}
              </Text>
              <Text>
                cityPhoto:{profileData.countryProfile.country.countryPhoto}
              </Text>
              {profileData.countryProfile.country.totalLikeCount !== 0 ? (
                <Text>
                  {profileData.countryProfile.country.totalLikeCount}
                  {profileData.countryProfile.country.totalLikeCount === 1
                    ? " like"
                    : " likes"}
                </Text>
              ) : null}
              {profileData.countryProfile.country.cityCount !== 0 ? (
                <Text>
                  {profileData.countryProfile.country.cityCount}
                  {profileData.countryProfile.country.cityCount === 1
                    ? " city"
                    : " cities"}
                </Text>
              ) : null}
              {profileData.countryProfile.count !== 0 ? (
                <Text>
                  You've been {profileData.countryProfile.country.countryName}{" "}
                  {profileData.countryProfile.count}
                  {profileData.countryProfile.count === 1 ? " time" : " times"}
                </Text>
              ) : null}
            </>
          )}
          {countriesData.getCountries.countries &&
            countriesData.getCountries.countries.length !== 0 && (
              <Item>
                <Title>
                  {profileData.countryProfile.country.continent.continentName}
                </Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {countriesData.getCountries.countries.map(
                      (country, index) => {
                        return (
                          <UserColumn key={index}>
                            <UserRow country={country} type={"country"} />
                            <UserRow country={country} type={"country"} />
                            <UserRow country={country} type={"country"} />
                          </UserColumn>
                        );
                      }
                    )}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
          {profileData.countryProfile.cities &&
            profileData.countryProfile.cities.length !== 0 && (
              <Item>
                <Title>
                  {profileData.countryProfile.country.cityCount}
                  {profileData.countryProfile.country.cityCount === 1
                    ? " CITY"
                    : " CITIES"}
                </Title>
                {profileData.countryProfile.cities &&
                  profileData.countryProfile.cities.map((city, index) => (
                    <UserRow key={index} city={city} type={"city"} />
                  ))}
                {profileData.countryProfile.cities &&
                  profileData.countryProfile.cities.map((city, index) => (
                    <Text key={index}>
                      {city.cityName}
                      {city.likeCount}
                      {city.isLiked}
                    </Text>
                  ))}
              </Item>
            )}
        </Container>
      </ScrollView>
    );
  } else {
    return null;
  }
};
