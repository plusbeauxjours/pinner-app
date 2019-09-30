import React, { useState } from "react";
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
  if (loading) {
    return <Loader />;
  } else {
    const { topCountries: { countries = null } = {} } = data;
    if (countries) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            <Bold>COUNTRIES</Bold>
            {countries &&
              countries.length !== 0 &&
              countries.map((country, index) => (
                <Touchable
                  key={index}
                  onPress={() =>
                    navigation.push("CountryProfileTabs", {
                      countryCode: country.countryCode,
                      continentCode: country.continent.continentCode
                    })
                  }
                >
                  <UserRow
                    country={country}
                    count={country.count}
                    diff={country.diff}
                    type={"userProfileCountry"}
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
