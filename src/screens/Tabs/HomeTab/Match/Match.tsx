import React, { useState } from "react";
import styled from "styled-components";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import { useQuery, useMutation } from "react-apollo-hooks";
import { GET_MATCHES } from "./MatchQueries";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import { RefreshControl, TouchableOpacity } from "react-native";
import { MARK_AS_READ_MATCH } from "./MatchQueries";
import {
  GetMatches,
  GetMatchesVariables,
  MarkAsReadMatch,
  MarkAsReadMatchVariables
} from "../../../../types/api";

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
`;
const Touchable = styled.TouchableOpacity``;
const View = styled.View``;
const Text = styled.Text`
  color: ${props => props.theme.color};
  font-size: 9px;
  margin-left: 15px;
`;
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
  color: ${props => props.theme.color};
`;
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
    navigation.push("Chat", {
      chatId: matchId,
      lastMessage: "hi"
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
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
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
                  {matchData.getMatches.matches.map((match, index, arr) => {
                    if (index === 0) {
                      return (
                        <View key={index}>
                          <Text>
                            {arr[index].coffee.city.cityName}
                            {arr[index].coffee.city.country.countryEmoji}
                          </Text>
                          <Touchable
                            onPress={() =>
                              navigation.push("Chat", {
                                chatId: match.id,
                                userId: me.user.profile.id,
                                userName: me.user.username
                              })
                            }
                          >
                            <UserRow
                              match={match}
                              type={"match"}
                              onPress={onPress}
                            />
                          </Touchable>
                        </View>
                      );
                    } else if (
                      0 < index &&
                      index < arr.length - 1 &&
                      arr[index].coffee.city.cityId !==
                        arr[index - 1].coffee.city.cityId
                    ) {
                      return (
                        <View key={index}>
                          <Text>
                            {arr[index].coffee.city.cityName}
                            {arr[index].coffee.city.country.countryEmoji}
                          </Text>
                          <Touchable
                            onPress={() =>
                              navigation.push("Chat", {
                                chatId: match.id,
                                userId: me.user.profile.id,
                                userName: me.user.username
                              })
                            }
                          >
                            <UserRow
                              match={match}
                              type={"match"}
                              onPress={onPress}
                            />
                          </Touchable>
                        </View>
                      );
                    } else {
                      return (
                        <Touchable
                          key={index}
                          onPress={() =>
                            navigation.push("Chat", {
                              chatId: match.id,
                              userId: me.user.profile.id,
                              userName: me.user.username,
                              targetName: match.isHost
                                ? match.guest.profile.username
                                : match.host.profile.username,
                              targetUrl: match.isHost
                                ? match.guest.profile.appAvatarUrl
                                : match.host.profile.appAvatarUrl
                            })
                          }
                        >
                          <UserRow
                            match={match}
                            type={"match"}
                            onPress={onPress}
                          />
                        </Touchable>
                      );
                    }
                  })}
                </UserContainer>
              </Item>
            )}
        </Container>
      </ScrollView>
    );
  }
};
