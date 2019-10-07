import React, { useState } from "react";
import styled from "styled-components";
import { RefreshControl } from "react-native";
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
  if (loading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    const { topContinents: { continents = null } = {} } = data;
    if (continents) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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
                  <UserRow
                    continent={continent}
                    count={continent.count}
                    diff={continent.diff}
                    type={"userProfileContinent"}
                  />
                </Touchable>
              ))}
          </View>
        </ScrollView>
      );
    }
  }
};
