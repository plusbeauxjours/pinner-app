import React, { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import Swiper from "react-native-swiper";
import { SLACK_REPORT_LOCATIONS } from "../../../../sharedQueries";
import {
  CountryProfile,
  CountryProfileVariables,
  GetCountries,
  GetCountriesVariables,
  SlackReportLocations,
  SlackReportLocationsVariables
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
const Touchable = styled.TouchableOpacity``;

export default ({ navigation }) => {
  const me = useMe();
  const location = useLocation();
  const [countryCode, setCountryCode] = useState<string>(
    navigation.getParam("countryCode") || location.currentCountryCode
  );
  console.log("navigation=========", navigation.getParam("countryCode"));
  console.log("state=========", countryCode);
  console.log("location=========", location.currentCountryCode);
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
    variables: { countryCode }
  });
  const {
    data: countriesData,
    loading: countriesLoading,
    refetch: countriesRefetch
  } = useQuery<GetCountries, GetCountriesVariables>(GET_COUNTRIES, {
    variables: { countryCode }
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
    return <Loader />;
  } else {
    console.log(profileData);
    const {
      countryProfile: {
        country = null,
        cities = null,
        count = null,
        hasNextPage = null
      } = {}
    } = profileData;
    const { getCountries: { countries = null } = {} } = countriesData;
    if (countries && cities) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Container>
            <Bold>Country Profile</Bold>
            {country && (
              <>
                <Text>
                  countryName:{country.countryName}
                  {country.countryEmoji}
                </Text>
                <Text>countryPhoto:{country.countryPhoto}</Text>
                {country.totalLikeCount !== 0 ? (
                  <Text>
                    {country.totalLikeCount}
                    {country.totalLikeCount === 1 ? " like" : " likes"}
                  </Text>
                ) : null}
                {country.cityCount !== 0 ? (
                  <Text>
                    {country.cityCount}
                    {country.cityCount === 1 ? " city" : " cities"}
                  </Text>
                ) : null}
                {count !== 0 ? (
                  <Text>
                    You've been {country.countryName} {count}
                    {count === 1 ? " time" : " times"}
                  </Text>
                ) : null}
              </>
            )}
            {countries.length !== 0 && (
              <Item>
                {/* <Title>{country.continent.continentName}</Title> */}
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {countries.map((country, index) => {
                      return (
                        <UserColumn key={index}>
                          <Touchable
                            onPress={() =>
                              navigation.push("CountryProfileTabs", {
                                countryCode: country.countryCode,
                                continentCode: country.continent.continentCode
                              })
                            }
                          >
                            <UserRow country={country} type={"country"} />
                          </Touchable>
                          <Touchable
                            onPress={() =>
                              navigation.push("CountryProfileTabs", {
                                countryCode: country.countryCode,
                                continentCode: country.continent.continentCode
                              })
                            }
                          >
                            <UserRow country={country} type={"country"} />
                          </Touchable>
                          <Touchable
                            onPress={() =>
                              navigation.push("CountryProfileTabs", {
                                countryCode: country.countryCode,
                                continentCode: country.continent.continentCode
                              })
                            }
                          >
                            <UserRow country={country} type={"country"} />
                          </Touchable>
                        </UserColumn>
                      );
                    })}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
            {cities.length !== 0 && (
              <Item>
                <Title>
                  {country.cityCount}
                  {country.cityCount === 1 ? " CITY" : " CITIES"}
                </Title>
                {cities.map((city, index) => (
                  <Touchable
                    onPress={() =>
                      navigation.push("CityProfileTabs", {
                        cityId: city.cityId,
                        countryCode: city.country.countryCode,
                        continentCode: city.country.continent.continentCode
                      })
                    }
                  >
                    <UserRow key={index} city={city} type={"city"} />
                  </Touchable>
                ))}
              </Item>
            )}
          </Container>
        </ScrollView>
      );
    } else {
      return null;
    }
  }
};
