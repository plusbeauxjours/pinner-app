import React, { useState } from "react";
import styled from "styled-components";
import { RefreshControl } from "react-native";
import { TopContinents, TopContinentsVariables } from "../../../../types/api";
import { useQuery } from "react-apollo-hooks";
import { TOP_CONTINENTS } from "./ContinentsQueries";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";

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
  const {
    data: { topContinents: { continents = null } = {} } = {},
    loading,
    refetch,
  } = useQuery<TopContinents, TopContinentsVariables>(TOP_CONTINENTS, {
    variables: { uuid },
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#999"}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View>
          {continents && continents.length !== 0 ? (
            continents.map((continent, index) => (
              <Touchable
                key={index}
                onPress={() =>
                  navigation.push("ContinentProfile", {
                    continentCode: continent.continentCode,
                  })
                }
              >
                <UserRow
                  continent={continent}
                  count={continent.count}
                  type={"userProfileContinent"}
                />
              </Touchable>
            ))
          ) : (
            <TextContainer>
              <Text>No continent yet...</Text>
            </TextContainer>
          )}
        </View>
      </ScrollView>
    );
  }
};
