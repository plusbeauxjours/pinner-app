import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ScrollView, RefreshControl } from "react-native";
import { FrequentVisits, FrequentVisitsVariables } from "../../../../types/api";
import { useQuery } from "react-apollo-hooks";
import { FREQUENT_VISITS } from "./CitiesQueries";
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
    FrequentVisits,
    FrequentVisitsVariables
  >(FREQUENT_VISITS, {
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
  useEffect(() => {
    setUsername(navigation.getParam("username")), [navigation];
  });
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
          <Bold>CITIES</Bold>
          {data.frequentVisits.cities &&
            data.frequentVisits.cities.length !== 0 &&
            data.frequentVisits.cities.map((city, index) => (
              <Touchable
                key={index}
                onPress={() =>
                  navigation.navigate("CountryProfileTabs", {
                    countryCode: city.country.countryCode,
                    continentCode: city.country.continent.continentCode
                  })
                }
              >
                <UserRow key={index} city={city} type={"userProfileCity"} />
              </Touchable>
            ))}
        </View>
      )}
    </ScrollView>
  );
};
