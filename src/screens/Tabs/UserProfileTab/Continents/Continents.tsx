import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ScrollView, RefreshControl } from "react-native";
import { TopContinents, TopContinentsVariables } from "../../../../types/api";
import { useQuery } from "react-apollo-hooks";
import { TOP_CONTINENTS } from "./ContinentsQueries";
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
  const [username, setUsername] = useState<string>(
    navigation.getParam("username")
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data, loading, refetch } = useQuery<
    TopContinents,
    TopContinentsVariables
  >(TOP_CONTINENTS, {
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
          <Bold>CONTINENTS</Bold>
          {data.topContinents.continents &&
            data.topContinents.continents.length !== 0 &&
            data.topContinents.continents.map((continent, index) => (
              <Touchable
                key={index}
                onPress={() =>
                  navigation.push("ContinentProfile", {
                    continentCode: continent.continentCode
                  })
                }
              >
                <UserRow continent={continent} type={"userProfileContinent"} />
              </Touchable>
            ))}
        </View>
      )}
    </ScrollView>
  );
};
