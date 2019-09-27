import React, { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import {
  CityProfile,
  CityProfileVariables,
  GetSamenameCities,
  GetSamenameCitiesVariables,
  SlackReportLocations,
  SlackReportLocationsVariables
} from "../../../../types/api";
import {
  CITY_PROFILE,
  GET_SAMENAME_CITIES,
  NEAR_CITIES
} from "./CityProfileQueries";
import Swiper from "react-native-swiper";
import { NearCities, NearCitiesVariables } from "../../../../types/api";
import { SLACK_REPORT_LOCATIONS } from "../../../../sharedQueries";
import CityLikeBtn from "../../../../components/CityLikeBtn";

const Container = styled.View``;

const Text = styled.Text``;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
`;

const View = styled.View``;

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
  const [cityId, setCityId] = useState<string>(location.currentCityId);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [payload, setPayload] = useState<string>();
  const [slackReportLocationsFn] = useMutation<
    SlackReportLocations,
    SlackReportLocationsVariables
  >(SLACK_REPORT_LOCATIONS, {
    variables: {
      targetLocationId: cityId,
      targetLocationType: "city",
      payload
    }
  });
  const {
    data: profileData,
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<CityProfile, CityProfileVariables>(CITY_PROFILE, {
    variables: { cityId: "ChIJZ2jHc-2kw0cRpwJzeGY6i8E" }
  });
  const {
    data: nearCitiesData,
    loading: nearCitiesLoading,
    refetch: nearCitiesRefetch
  } = useQuery<NearCities, NearCitiesVariables>(NEAR_CITIES, {
    variables: { cityId: "ChIJZ2jHc-2kw0cRpwJzeGY6i8E" }
  });
  const {
    data: samenameCitiesData,
    loading: samenameCitiesLoading,
    refetch: samenameCitiesRefetch
  } = useQuery<GetSamenameCities, GetSamenameCitiesVariables>(
    GET_SAMENAME_CITIES,
    { variables: { cityId: "ChIJZ2jHc-2kw0cRpwJzeGY6i8E" } }
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await profileRefetch();
      await samenameCitiesRefetch();
      await nearCitiesRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  if (profileLoading || nearCitiesLoading || samenameCitiesLoading) {
    return <Loader />;
  } else if (
    !profileLoading &&
    !nearCitiesLoading &&
    !samenameCitiesLoading &&
    profileData &&
    nearCitiesData &&
    samenameCitiesData
  ) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          <Bold>City Profile</Bold>
          {profileData.cityProfile.city && (
            <View>
              <Text>cityName:{profileData.cityProfile.city.cityName}</Text>
              <Text>cityPhoto:{profileData.cityProfile.city.cityPhoto}</Text>
              {profileData.cityProfile.city.likeCount !== 0 ? (
                <Text>
                  {profileData.cityProfile.city.likeCount}
                  {profileData.cityProfile.city.likeCount === 1
                    ? " like"
                    : " likes"}
                </Text>
              ) : null}
              {profileData.cityProfile.city.userCount !== 0 ? (
                <Text>userCount:{profileData.cityProfile.city.userCount}</Text>
              ) : null}
              {profileData.cityProfile.city.userLogCount == 0 ? (
                <Text>
                  userLogCount:{profileData.cityProfile.city.userLogCount}
                </Text>
              ) : null}
              {profileData.cityProfile.count !== 0 ? (
                <Text>
                  You've been {profileData.cityProfile.city.cityName}{" "}
                  {profileData.cityProfile.count}
                  {profileData.cityProfile.count === 1 ? " time" : " times"}
                </Text>
              ) : null}
            </View>
          )}
          <CityLikeBtn
            isLiked={profileData.cityProfile.city.isLiked}
            cityId={profileData.cityProfile.city.cityId}
            likeCount={profileData.cityProfile.city.likeCount}
          />
          {nearCitiesData.nearCities.cities &&
            nearCitiesData.nearCities.cities.length !== 0 && (
              <Item>
                <Title>SAMENAME CITIES</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {nearCitiesData.nearCities.cities.map((city, index) => {
                      return (
                        <UserColumn key={index}>
                          <UserRow city={city} type={"city"} />
                          <UserRow city={city} type={"city"} />
                          <UserRow city={city} type={"city"} />
                        </UserColumn>
                      );
                    })}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
          {samenameCitiesData.getSamenameCities.cities &&
            samenameCitiesData.getSamenameCities.cities.length !== 0 && (
              <Item>
                <Title>SAMENAME CITIES</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {samenameCitiesData.getSamenameCities.cities.map(
                      (city, index) => {
                        return (
                          <UserColumn key={index}>
                            <UserRow city={city} type={"city"} />
                            <UserRow city={city} type={"city"} />
                            <UserRow city={city} type={"city"} />
                          </UserColumn>
                        );
                      }
                    )}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
          {profileData.cityProfile.usersBefore &&
            profileData.cityProfile.usersBefore.length !== 0 && (
              <Item>
                <Title>USERS BEFORE</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: 135 }}
                    paginationStyle={{ bottom: -15 }}
                  >
                    {profileData.cityProfile.usersBefore.map((user, index) => {
                      return (
                        <UserColumn key={index}>
                          <UserRow user={user.actor.profile} type={"user"} />
                          <UserRow user={user.actor.profile} type={"user"} />
                          <UserRow user={user.actor.profile} type={"user"} />
                        </UserColumn>
                      );
                    })}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
          {profileData.cityProfile.usersNow &&
            profileData.cityProfile.usersNow.length !== 0 && (
              <Item>
                <Title>USERS NOW</Title>
                {profileData.cityProfile.usersNow &&
                  profileData.cityProfile.usersNow.map((user, index) => (
                    <UserRow key={index} user={user} type={"user"} />
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
