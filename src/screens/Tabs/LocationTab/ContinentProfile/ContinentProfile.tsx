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
  SlackReportLocationsVariables,
  ContinentProfile,
  ContinentProfileVariables
} from "../../../../types/api";
import { SLACK_REPORT_LOCATIONS } from "../../../../sharedQueries";
import { CONTINENT_PROFILE } from "./ContinentProfileQueries";

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
  const [continentCode, setContinentCode] = useState<string>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [payload, setPayload] = useState<string>();
  const {
    data: profileData,
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<ContinentProfile, ContinentProfileVariables>(CONTINENT_PROFILE, {
    variables: { continentCode: "NA" }
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
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {profileLoading ? (
        <Loader />
      ) : (
        <Container>
          <Bold>Continent Profile</Bold>
          {profileData.continentProfile.continent && (
            <>
              <Text>
                continentName:
                {profileData.continentProfile.continent.continentName}
              </Text>
              <Text>
                continentPhoto:
                {profileData.continentProfile.continent.continentPhoto}
              </Text>
            </>
          )}
          {profileData.continentProfile.countries &&
            profileData.continentProfile.countries.length !== 0 && (
              <Item>
                <Title>CONTINENTS</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {profileData.continentProfile.continents.map(
                      (continent, index) => {
                        return (
                          <UserColumn key={index}>
                            <UserRow continent={continent} type={"continent"} />
                            <UserRow continent={continent} type={"continent"} />
                            <UserRow continent={continent} type={"continent"} />
                          </UserColumn>
                        );
                      }
                    )}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
          {profileData.continentProfile.countries &&
            profileData.continentProfile.countries.length !== 0 && (
              <Item>
                <Title>
                  {profileData.continentProfile.continent.countryCount}
                  {profileData.continentProfile.continent.countryCount === 1
                    ? " COUNTRY"
                    : " COUNTRIES"}
                </Title>
                {profileData.continentProfile.countries &&
                  profileData.continentProfile.countries.map(
                    (country, index) => (
                      <UserRow key={index} country={country} type={"country"} />
                    )
                  )}
              </Item>
            )}
        </Container>
      )}
    </ScrollView>
  );
};