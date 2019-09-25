import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import { useQuery, useMutation } from "react-apollo-hooks";
import { GET_MATCHES } from "./MatchQueries";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import { ScrollView, RefreshControl } from "react-native";
import { MARK_AS_READ_MATCH } from "./MatchQueries";
import {
  GetMatches,
  GetMatchesVariables,
  MarkAsReadMatch,
  MarkAsReadMatchVariables
} from "../../../../types/api";

const Container = styled.View``;

const UserContainer = styled.View``;


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
  const [MarkAsReadMatchFn] = useMutation<
    MarkAsReadMatch,
    MarkAsReadMatchVariables
  >(MARK_AS_READ_MATCH, {
    update(cache, { data: { markAsReadMatch } }) {
      try {
        const matchData = cache.readQuery<GetMatches, GetMatchesVariables>({
          query: GET_MATCHES
        });
        if (matchData) {
          matchData.getMatches.matches.find(
            i => i.id === markAsReadMatch.matchId
          ).isReadByHost = markAsReadMatch.isReadByHost;
          matchData.getMatches.matches.find(
            i => i.id === markAsReadMatch.matchId
          ).isReadByGuest = markAsReadMatch.isReadByGuest;
          cache.writeQuery({
            query: GET_MATCHES,
            data: matchData
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const onPress = (matchId: string) => {
    MarkAsReadMatchFn({
      variables: { matchId }
    });
  };
  const {
    data: matchData,
    loading: matchLoading,
    refetch: matchRefetch
  } = useQuery<GetMatches, GetMatchesVariables>(GET_MATCHES);
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
  if (matchLoading) {
    return <Loader />;
  } else if (matchData) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          {matchData.getMatches.matches &&
            matchData.getMatches.matches.length !== 0 && (
              <Item>
                <Title>MATCHES</Title>
                <UserContainer>
                  {matchData.getMatches.matches.map(match => (
                    <UserRow
                      key={match.id}
                      match={match}
                      type={"match"}
                      onPress={onPress}
                    />
                  ))}
                </UserContainer>
              </Item>
            )}
        </Container>
      </ScrollView>
    );
  }
};
