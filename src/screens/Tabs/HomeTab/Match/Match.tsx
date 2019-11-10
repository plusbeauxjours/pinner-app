import React, { useState } from "react";
import styled from "styled-components";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import { useQuery, useMutation } from "react-apollo-hooks";
import { GET_MATCHES } from "./MatchQueries";
import { useMe } from "../../../../context/MeContext";
import { RefreshControl } from "react-native";
import { MARK_AS_READ_MATCH } from "./MatchQueries";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  GetMatches,
  GetMatchesVariables,
  MarkAsReadMatch,
  MarkAsReadMatchVariables
} from "../../../../types/api";

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  padding: 0 15px 0 15px;
`;
const Touchable = styled.TouchableOpacity``;
const View = styled.View``;
const Text = styled.Text`
  color: ${props => props.theme.color};
  font-size: 9px;
  margin-left: 5px;
`;
const UserContainer = styled.View``;

const Item = styled.View`
  flex: 1;
  margin-bottom: 25px;
`;
const Title = styled.Text`
  font-weight: 500;
  font-size: 18px;
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
const RowBack = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  margin-left: 5px;
  max-width: 85px;
  width: 100%;
  justify-content: space-between;
`;
const BackLeftBtn = styled.TouchableOpacity`
  justify-content: center;
`;
const SmallText = styled.Text`
  color: ${props => props.theme.color};
  text-align: center;
  font-size: 9px;
`;
const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
`;
const TouchableBackRow = styled.View`
  background-color: ${props => props.theme.bgColor};
`;
export default ({ navigation }) => {
  const me = useMe();
  const [refreshing, setRefreshing] = useState(false);
  const [MarkAsReadMatchFn] = useMutation<
    MarkAsReadMatch,
    MarkAsReadMatchVariables
  >(MARK_AS_READ_MATCH, {
    fetchPolicy: "network-only",
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
    const { getMatches: { matches = null } = {} } = matchData;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          {matches && matches.length !== 0 ? (
            <Item>
              <Title>MATCHES</Title>
              <UserContainer>
                <SwipeListView
                  useFlatList={false}
                  closeOnRowBeginSwipe={true}
                  data={matches}
                  previewOpenValue={1000}
                  renderItem={data => (
                    <TouchableBackRow key={data.index}>
                      <Touchable
                        onPress={() =>
                          navigation.push("Chat", {
                            chatId: data.item.id,
                            userId: me.user.profile.id,
                            userName: me.user.username,
                            userUrl: me.user.profile.appAvatarUrl,
                            targetName: data.item.isHost
                              ? data.item.guest.profile.username
                              : data.item.host.profile.username
                          })
                        }
                      >
                        <UserRow
                          match={data.item}
                          type={"match"}
                          onPress={onPress}
                        />
                      </Touchable>
                    </TouchableBackRow>
                  )}
                  renderHiddenItem={data => (
                    <RowBack>
                      <BackLeftBtn onPress={() => console.log("hihi")}>
                        <IconContainer>
                          <SmallText>UN MATCH</SmallText>
                        </IconContainer>
                      </BackLeftBtn>
                    </RowBack>
                  )}
                  leftOpenValue={45}
                  keyExtractor={item => item.id}
                />
              </UserContainer>
            </Item>
          ) : (
            <Text>
              You don't have any matches. Please swipe to right to find someone.
            </Text>
          )}
        </Container>
      </ScrollView>
    );
  }
};
