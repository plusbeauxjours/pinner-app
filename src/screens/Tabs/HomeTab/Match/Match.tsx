import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import { useQuery } from "react-apollo-hooks";
import { GET_MATCHES } from "./MatchQueries";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import { ScrollView, RefreshControl } from "react-native";
import Swiper from "react-native-swiper";
import { useMutation } from "react-apollo";
import { MARK_AS_READ_MATCH } from "./MatchQueries";
import {
  GetMatches,
  MarkAsReadMatch,
  MarkAsReadMatchVariables
} from "../../../../types/api";

const Container = styled.View``;

const UserContainer = styled.View``;

const UserColumn = styled.View``;

const Item = styled.View`
  flex: 1;
  margin-bottom: 25px;
`;
const Title = styled.Text`
  font-weight: 500;
  font-size: 18px;
  padding-left: 15px;
  margin-bottom: 5px;
`;

export default () => {
  const me = useMe();
  const location = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [matchId, setMatchId] = useState("");
  const [MarkAsReadMatchFn] = useMutation<
    MarkAsReadMatch,
    MarkAsReadMatchVariables
  >(MARK_AS_READ_MATCH, { variables: { matchId } });
  const {
    data: matchData,
    loading: matchLoading,
    refetch: matchRefetch
  } = useQuery<GetMatches>(GET_MATCHES);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await matchRefetch();
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
      {matchLoading ? (
        <Loader />
      ) : (
        <Container>
          {matchData.getMatches.matches &&
            matchData.getMatches.matches.length !== 0 && (
              <Item>
                <Title>MATCHES</Title>
                <UserContainer>
                  <Swiper style={{ height: 180 }}>
                    {matchData.getMatches.matches.map(match => (
                      <UserRow key={match.id} match={match} type={"match"} />
                    ))}
                  </Swiper>
                </UserContainer>
              </Item>
            )}
        </Container>
      )}
    </ScrollView>
  );
};
