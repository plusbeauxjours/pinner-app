import React, { useState } from "react";
import { RefreshControl, Image } from "react-native";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useLocation } from "../../../../context/LocationContext";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import Swiper from "react-native-swiper";
import {
  SlackReportLocations,
  SlackReportLocationsVariables,
  ContinentProfile,
  ContinentProfileVariables
} from "../../../../types/api";
import { SLACK_REPORT_LOCATIONS } from "../../../../sharedQueries";
import { CONTINENT_PROFILE } from "./ContinentProfileQueries";
import { countries as countryData } from "../../../../../countryData";
import constants from "../../../../../constants";

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

const View = styled.View`
  justify-content: center;
  padding: 15px;
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
  const [continentCode, setContinentCode] = useState<string>(
    navigation.getParam("continentCode") ||
      countryData.find(i => i.code === location.currentCountryCode).continent
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [payload, setPayload] = useState<string>();
  const [sameContinents, setSameContinents] = useState([]);
  const {
    data: profileData,
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<ContinentProfile, ContinentProfileVariables>(CONTINENT_PROFILE, {
    variables: { continentCode }
  });
  const [slackReportLocationsFn] = useMutation<
    SlackReportLocations,
    SlackReportLocationsVariables
  >(SLACK_REPORT_LOCATIONS, {
    variables: {
      targetLocationId: continentCode,
      targetLocationType: "continent",
      payload
    }
  });
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await profileRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
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
  if (profileLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    const {
      continentProfile: {
        count = null,
        hasNextPage = null,
        continent = null,
        continents = null,
        countries = null
      } = {}
    } = profileData;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          {continent && (
            <View>
              <Image
                style={{
                  height: constants.width - 30,
                  width: constants.width - 30,
                  borderRadius: 3
                }}
                source={
                  continent.continentPhoto && {
                    uri: continent.continentPhoto
                  }
                }
              />
              <Bold>{continent.continentName}</Bold>
              {count && count !== 0 ? (
                <Text>
                  You've been to {continent.continentName} {count}
                  {count === 1 ? " time" : " times"}
                </Text>
              ) : null}
            </View>
          )}
          {continents && continents.length !== 0 && (
            <Item>
              <Title>CONTINENTS</Title>
              <UserContainer>
                <Swiper
                  style={{ height: 135 }}
                  paginationStyle={{ bottom: -15 }}
                  loop={false}
                >
                  {chunk(continents).map((continentItem, index) => {
                    return (
                      <UserColumn key={index}>
                        {continentItem.map((continent: any, index: any) => {
                          return (
                            <Touchable
                              key={index}
                              onPress={() => {
                                if (continentCode !== continent.continentCode) {
                                  navigation.push("ContinentProfile", {
                                    continentCode: continent.continentCode
                                  });
                                }
                              }}
                            >
                              <UserRow
                                continent={continent}
                                type={"continent"}
                              />
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
          {countries && countries.length !== 0 && (
            <Item>
              <Title>
                {continent.countryCount}
                {continent.countryCount === 1 ? " COUNTRY" : " COUNTRIES"}
              </Title>
              {countries.map((country: any, index: any) => (
                <Touchable
                  key={index}
                  onPress={() => {
                    if (
                      navigation.getParam("countryCode") !==
                        country.countryCode ||
                      navigation.getParam("cityId")
                    ) {
                      navigation.push("CountryProfileTabs", {
                        countryCode: country.countryCode,
                        continentCode: country.continent.continentCode
                      });
                    } else {
                      navigation.goBack();
                    }
                  }}
                >
                  <UserRow country={country} type={"country"} />
                </Touchable>
              ))}
            </Item>
          )}
        </Container>
      </ScrollView>
    );
  }
};
