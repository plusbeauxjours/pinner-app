import React, { useState } from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import { GET_MATCHES } from "./HomeQueries";
import { GetMatches } from "../../../types/api";
import { useMe } from "../../../context/MeContext";
import { useLocation } from "../../../context/LocationContext";
import { ScrollView, RefreshControl } from "react-native";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => {
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery<GetMatches>(GET_MATCHES);
  const me = useMe();
  const location = useLocation();
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
  console.log("useLocation::", location);
  console.log(me);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        {loading ? <Loader /> : <Text>{me && me.user.username}</Text>}
      </View>
    </ScrollView>
  );
};
