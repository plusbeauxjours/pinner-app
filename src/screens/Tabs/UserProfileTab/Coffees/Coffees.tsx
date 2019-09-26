import React, { useState } from "react";
import styled from "styled-components";
import { ScrollView, RefreshControl } from "react-native";
import { GetCoffees, GetCoffeesVariables } from "../../../../types/api";
import { useQuery } from "react-apollo-hooks";
import { GET_COFFEES } from "./CoffeesQueries";
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

export default () => {
  const me = useMe();
  const location = useLocation();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data, loading, refetch } = useQuery<GetCoffees, GetCoffeesVariables>(
    GET_COFFEES,
    {
      variables: { userName: "devilishPlusbeauxjours", location: "profile" }
    }
  );
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
          <Bold>COFFEES</Bold>

          {data.getCoffees.coffees &&
            data.getCoffees.coffees.map((coffee, index) => (
              <UserRow key={index} coffee={coffee} type={"userProfileCoffee"} />
            ))}
        </View>
      )}
    </ScrollView>
  );
};