import React, { useState } from "react";
import styled from "styled-components";
import { RefreshControl } from "react-native";
import { TopCountries, TopCountriesVariables } from "../../../../types/api";
import { useQuery } from "react-apollo-hooks";
import { TOP_COUNTRIES } from "./CountriesQueries";
import Loader from "../../../../components/Loader";
import ItemRow from "../../../../components/ItemRow";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;

const Text = styled.Text`
  color: ${(props) => props.theme.color};
  font-size: 8px;
  margin-left: 5px;
`;

const Touchable = styled.TouchableOpacity``;

const ScrollView = styled.ScrollView`
  background-color: ${(props) => props.theme.bgColor};
`;

const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
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

  // QUERY

  const {
    data: { topCountries: { countries = null } = {} } = {},
    loading,
    refetch,
  } = useQuery<TopCountries, TopCountriesVariables>(TOP_COUNTRIES, {
    variables: { uuid },
  });

  // FUNC

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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#999"}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View>
          {countries && countries.length !== 0 ? (
            countries.map((country, index) => (
              <Touchable
                key={index}
                onPress={() =>
                  navigation.push("CountryProfileTabs", {
                    countryCode: country.countryCode,
                    continentCode: country.continent.continentCode,
                  })
                }
              >
                <ItemRow
                  country={country}
                  count={country.count}
                  type={"userProfileCountry"}
                />
              </Touchable>
            ))
          ) : (
            <TextContainer>
              <Text>No country yet...</Text>
            </TextContainer>
          )}
        </View>
      </ScrollView>
    );
  }
};
