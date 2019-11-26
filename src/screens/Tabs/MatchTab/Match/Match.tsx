import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import { useQuery, useMutation } from "react-apollo-hooks";
import { Linking } from "expo";
import { GET_MATCHES } from "./MatchQueries";
import { useMe } from "../../../../context/MeContext";
import { RefreshControl } from "react-native";
import { MARK_AS_READ_MATCH } from "./MatchQueries";
import { SwipeListView } from "react-native-swipe-list-view";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Toast from "react-native-root-toast";
import { UNMATCH } from "../../../../components/CoffeeBtn/CoffeeBtnQueries";
import { chat_leave } from "../../../../../Fire";
import { COMPLETE_EDIT_EMAIL_VERIFICATION } from "../../UserProfileTab/EditProfile/EditProfileQueries";
import {
  GetMatches,
  GetMatchesVariables,
  MarkAsReadMatch,
  MarkAsReadMatchVariables,
  UnMatch,
  UnMatchVariables,
  CompleteEditEmailVerification,
  CompleteEditEmailVerificationVariables
} from "../../../../types/api";

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  padding: 0 10px 0 10px;
`;
const Touchable = styled.TouchableOpacity``;
const View = styled.View``;
const Text = styled.Text`
  color: ${props => props.theme.color};
  font-size: 9px;
  margin-left: 5px;
`;
const UserContainer = styled.View`
  padding: 0 5px 0 5px;
`;

const Item = styled.View`
  flex: 1;
  margin-bottom: 25px;
`;
const Title = styled.Text`
  font-weight: 500;
  margin-left: 5px;
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
  color: #999;
  text-align: center;
  font-size: 9px;
`;
const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
  padding: 2px;
`;
const TouchableBackRow = styled.View`
  background-color: ${props => props.theme.bgColor};
`;
export default ({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const [refreshing, setRefreshing] = useState(false);
  const [completeEditEmailVerificationFn] = useMutation<
    CompleteEditEmailVerification,
    CompleteEditEmailVerificationVariables
  >(COMPLETE_EDIT_EMAIL_VERIFICATION);
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
  const {
    data: { getMatches: { matches = null } = {} } = {},
    loading: matchLoading,
    refetch: matchRefetch
  } = useQuery<GetMatches, GetMatchesVariables>(GET_MATCHES, {
    fetchPolicy: "network-only"
  });
  const [unMatchFn, { loading: unMatchLoading }] = useMutation<
    UnMatch,
    UnMatchVariables
  >(UNMATCH);
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
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const { showActionSheetWithOptions } = useActionSheet();
  const unMatch = (matchId: string) => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: "Are you sure to unmatch?"
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          try {
            // chat_leave(matchId, me.user.profile.id, me.user.username);
            unMatchFn({
              variables: {
                matchId
              }
            });
            toast("unmatched");
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  };
  const handleOpenURL = async event => {
    const route = await event.url.replace(/.*?:\/\//g, "");
    const key = await route.match(/\/([^\/]+)\/?$/)[0].split("/")[1];
    const routeName = await route.split("/")[2];
    const toast = (message: string) => {
      Toast.show(message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0
      });
    };
    const {
      data: { completeEditEmailVerification }
    } = await completeEditEmailVerificationFn({
      variables: {
        key
      }
    });
    if (completeEditEmailVerification.ok) {
      toast("Your new email address is verified");
    } else {
      toast("Could not be verified your new email address, please try again");
    }
  };
  useEffect(() => {
    Linking.addEventListener("url", handleOpenURL);
  }, []);
  if (matchLoading || meLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          {matches && matches.length !== 0 ? (
            <Item>
              <UserContainer>
                <SwipeListView
                  useFlatList={false}
                  closeOnRowBeginSwipe={true}
                  data={matches}
                  previewOpenValue={1000}
                  renderItem={data => (
                    <TouchableBackRow key={data.index}>
                      <Touchable
                        onPress={() => {
                          MarkAsReadMatchFn({
                            variables: { matchId: data.item.id }
                          }),
                            navigation.navigate("Chat", {
                              chatId: data.item.id,
                              userId: me.user.profile.id,
                              receiverId: data.item.isHost
                                ? data.item.guest.profile.id
                                : data.item.host.profile.id,
                              receiverAvatar: data.item.isHost
                                ? data.item.guest.profile.appAvatarUrl
                                : data.item.host.profile.appAvatarUrl,
                              userName: me.user.username,
                              userUrl: me.user.profile.appAvatarUrl,
                              targetName: data.item.isHost
                                ? data.item.guest.username
                                : data.item.host.username
                            });
                        }}
                      >
                        <UserRow match={data.item} type={"match"} />
                      </Touchable>
                    </TouchableBackRow>
                  )}
                  renderHiddenItem={data => (
                    <RowBack>
                      <BackLeftBtn onPress={() => unMatch(data.item.id)}>
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
