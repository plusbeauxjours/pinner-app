import React, { useState } from "react";
import styled from "styled-components";
import { RefreshControl } from "react-native";
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
const ScrollView = styled.ScrollView`
  background-color: ${props => props.theme.bgColor};
`;

export default ({ navigation }) => {
  const me = useMe();
  const location = useLocation();
  const [username, setUsername] = useState(navigation.getParam("username"));
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data, loading, refetch } = useQuery<GetCoffees, GetCoffeesVariables>(
    GET_COFFEES,
    {
      variables: {
        userName: username,
        location: "history"
      }
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
            data.getCoffees.coffees.length !== 0 &&
            data.getCoffees.coffees.map((coffee, index) => (
              <>
                {console.log(coffee.matchCount)}
                <UserRow
                  key={index}
                  coffee={coffee}
                  type={"userProfileCoffee"}
                />
              </>
            ))}
        </View>
      )}
    </ScrollView>
  );
};
