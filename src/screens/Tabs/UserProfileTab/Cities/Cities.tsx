import React, { useState } from "react";
import styled from "styled-components";
import { RefreshControl } from "react-native";
import { FrequentVisits, FrequentVisitsVariables } from "../../../../types/api";
import { useQuery } from "react-apollo-hooks";
import { FREQUENT_VISITS } from "./CitiesQueries";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import { countries } from "../../../../../countryData";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${props => props.theme.bgColor};
`;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
  color: ${props => props.theme.color};
`;

const Text = styled.Text`
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
  const [username, setUsername] = useState(navigation.getParam("username"));
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data, loading, refetch } = useQuery<
    FrequentVisits,
    FrequentVisitsVariables
  >(FREQUENT_VISITS, {
    variables: { userName: username },
    fetchPolicy: "network-only"
  });
  console.log(data);
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  if (loading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    const { frequentVisits: { cities = null } = {} } = data;
    if (cities) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            <Bold>CITIES</Bold>
            {cities.length !== 0 &&
              cities.map((city: any, index: any) => (
                <Touchable
                  key={index}
                  onPress={() =>
                    navigation.push("CityProfileTabs", {
                      cityId: city.cityId,
                      countryCode: city.country.countryCode,
                      continentCode: countries.find(
                        i => i.code === city.country.countryCode
                      ).continent
                    })
                  }
                >
                  <UserRow
                    city={city}
                    count={city.count}
                    diff={city.diff}
                    type={"userProfileCity"}
                  />
                </Touchable>
              ))}
          </View>
        </ScrollView>
      );
    } else {
      return null;
    }
  }
};
