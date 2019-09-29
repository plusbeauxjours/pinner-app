import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ScrollView, RefreshControl } from "react-native";
import { TopCountries, TopCountriesVariables } from "../../../../types/api";
import { useQuery } from "react-apollo-hooks";
import { TOP_COUNTRIES } from "./CountriesQueries";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
`;

const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;

export default ({ navigation }) => {
  const me = useMe();
  const location = useLocation();
  const [username, setUsername] = useState(navigation.getParam("username"));
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data, loading, refetch } = useQuery<
    TopCountries,
    TopCountriesVariables
  >(TOP_COUNTRIES, {
    variables: { userName: username }
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
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <View>
          <Bold>COUNTRIES</Bold>
          {data.topCountries.countries &&
            data.topCountries.countries.length !== 0 &&
            data.topCountries.countries.map((country, index) => (
              <Touchable
                key={index}
                onPress={() =>
                  navigation.navigate("CountryProfileTabs", {
                    countryCode: country.countryCode,
                    continentCode: country.continent.continentCode
                  })
                }
              >
                <UserRow
                  key={index}
                  country={country}
                  type={"userProfileCountry"}
                />
              </Touchable>
            ))}
        </View>
      )}
    </ScrollView>
  );
};
