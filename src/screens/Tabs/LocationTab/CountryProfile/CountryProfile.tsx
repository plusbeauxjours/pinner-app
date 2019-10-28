import React, { useState } from "react";
import { RefreshControl, Image, FlatList, ListView } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
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
import constants from "../../../../../constants";
import { countries as countryData } from "../../../../../countryData";
import { useTheme } from "../../../../context/ThemeContext";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import InfiniteScrollView from "react-native-infinite-scroll-view";

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
`;

const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 34;
  color: ${props => props.theme.color};
`;
const Flag = styled.Text`
  font-size: 24;
  color: ${props => props.theme.color};
`;
const View = styled.View`
  justify-content: center;
  padding: 15px;
`;
const CountryNameContainer = styled.View`
  align-items: center;
  flex-direction: row;
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
  text-transform: uppercase;
  color: ${props => props.theme.color};
`;
const Touchable = styled.TouchableOpacity``;

const ScrollView = styled.ScrollView`
  background-color: ${props => props.theme.bgColor};
`;
const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;

export default ({ navigation }) => {
  const location = useLocation();
  const isDarkMode = useTheme();
  const [countryCode, setCountryCode] = useState<string>(
    navigation.getParam("countryCode") || location.currentCountryCode
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [payload, setPayload] = useState<string>();
  const [mapOpen, setMapOpen] = useState<boolean>(false);
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
    refetch: profileRefetch,
    fetchMore: profileFetchMore
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
  const loadMore = page => {
    profileFetchMore({
      variables: {
        page,
        countryCode
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        const data = {
          countryProfile: {
            ...previousResult.countryProfile,
            cities: [
              ...previousResult.countryProfile.cities,
              ...fetchMoreResult.countryProfile.cities
            ],
            page: fetchMoreResult.countryProfile.page,
            hasNextPage: fetchMoreResult.countryProfile.hasNextPage
          }
        };
        return data;
      }
    });
  };
  const chunk = arr => {
    let chunks = [],
      i = 0,
      n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, (i += 3)));
    }
    return chunks;
  };
  if (profileLoading || countriesLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    const {
      countryProfile: {
        count = null,
        page = null,
        hasNextPage = null,
        country = null,
        cities = null
      } = {}
    } = profileData;
    const { getCountries: { countries = null } = {} } = countriesData;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          {country && (
            <View>
              {mapOpen ? (
                // <Touchable onPress={() => setMapOpen(false)}>
                <Touchable>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{
                      height: constants.width - 30,
                      width: constants.width - 30,
                      borderRadius: 3
                    }}
                    initialRegion={{
                      latitude: country.latitude,
                      longitude: country.longitude,
                      latitudeDelta: 10,
                      longitudeDelta: 10
                    }}
                    rotateEnabled={false}
                    customMapStyle={
                      isDarkMode && isDarkMode === true ? darkMode : lightMode
                    }
                  />
                </Touchable>
              ) : (
                <Touchable onPress={() => setMapOpen(true)}>
                  <Image
                    style={{
                      height: constants.width - 30,
                      width: constants.width - 30,
                      borderRadius: 3
                    }}
                    source={
                      country.countryPhoto && {
                        uri: country.countryPhoto
                      }
                    }
                  />
                </Touchable>
              )}

              <CountryNameContainer>
                <Bold>{country.countryName}</Bold>
                <Flag>{country.countryEmoji}</Flag>
              </CountryNameContainer>
              {count && count !== 0 ? (
                <Text>
                  You've been to {country.countryName} {count}
                  {count === 1 ? " time" : " times"}
                </Text>
              ) : null}
            </View>
          )}
          {countries && countries.length !== 0 && (
            <Item>
              <Title>{country.continent.continentName}</Title>
              <UserContainer>
                <Swiper
                  style={{ height: 135 }}
                  paginationStyle={{ bottom: -15 }}
                  loop={false}
                >
                  {countries.length !== 0 &&
                    chunk(countries).map((countryItem, index) => {
                      return (
                        <UserColumn key={index}>
                          {countryItem.map((country: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() =>
                                  navigation.push("CountryProfileTabs", {
                                    countryCode: country.countryCode,
                                    continentCode: country.continentCode
                                  })
                                }
                              >
                                <UserRow country={country} type={"country"} />
                              </Touchable>
                            );
                          })}
                        </UserColumn>
                      );
                    })}
                </Swiper>
              </UserContainer>
            </Item>
          )}
          {cities && cities.length !== 0 && (
            <Item>
              <Title>
                {country.cityCount}
                {country.cityCount === 1 ? " CITY" : " CITIES"}
              </Title>
              <FlatList
                data={cities}
                renderItem={({ item, index }) => {
                  return (
                    <Touchable
                      key={index}
                      onPress={() =>
                        navigation.push("CityProfileTabs", {
                          cityId: item.cityId,
                          countryCode: item.country.countryCode,
                          continentCode: countryData.find(
                            i => i.code === item.country.countryCode
                          ).continent
                        })
                      }
                    >
                      <UserRow city={item} type={"city"} />
                    </Touchable>
                  );
                }}
                renderScrollComponent={props => (
                  <InfiniteScrollView {...props}  />
                )}
                onEndReached={() => hasNextPage && loadMore(page)}
                onEndReachedThreshold={0.8}
              />
            </Item>
          )}
        </Container>
      </ScrollView>
    );
  }
};
