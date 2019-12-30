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
const Text = styled.Text`
  color: ${props => props.theme.color};
  font-size: 8px;
  margin-left: 5px;
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
const TextContainer = styled.View`
  margin-top: 15px;
  justify-content: center;
  align-items: center;
`;
export default ({ navigation }) => {
  const uuid = navigation.getParam("uuid");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {
    data: { frequentVisits: { cities = null } = {} } = {},
    loading,
    refetch
  } = useQuery<FrequentVisits, FrequentVisitsVariables>(FREQUENT_VISITS, {
    variables: { uuid },
    fetchPolicy: "network-only"
  });
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
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"#999"} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View>
          {cities && cities.length !== 0 ? (
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
            ))
          ) : (
            <TextContainer>
              <Text>No city yet...</Text>
            </TextContainer>
          )}
        </View>
      </ScrollView>
    );
  }
};
