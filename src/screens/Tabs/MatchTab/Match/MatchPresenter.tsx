import React from "react";
import { RefreshControl } from "react-native";

import styled from "styled-components";
import { SwipeListView } from "react-native-swipe-list-view";

import Loader from "../../../../components/Loader";
import ItemRow from "../../../../components/ItemRow";
import { useTheme } from "../../../../context/ThemeContext";
import { withNavigation } from "react-navigation";

const TextContainer = styled.View`
  margin-top: 15px;
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  padding: 0 10px 0 10px;
`;

const Touchable = styled.TouchableOpacity``;

const Text = styled.Text`
  color: ${(props) => props.theme.color};
  font-size: 8px;
  margin-left: 5px;
`;

const UserContainer = styled.View`
  padding: 0 5px 0 5px;
`;

const Item = styled.View`
  flex: 1;
  margin-bottom: 25px;
`;

const ScrollView = styled.ScrollView`
  background-color: ${(props) => props.theme.bgColor};
`;

const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
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
  font-size: 8px;
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
  background-color: ${(props) => props.theme.bgColor};
`;

interface IProps {
  navigation: any;
  matchLoading: boolean;
  meLoading: boolean;
  me: any;
  refreshing: boolean;
  onRefresh: () => void;
  matches: any;
  unMatchLoading: boolean;
  addBlockUserLoading: boolean;
  MarkAsReadMatchFn: any;
  unMatch: (matchId: string) => void;
  blockedUser: (uuid: string, matchId: string) => void;
}

const MatchPresenter: React.FC<IProps> = ({
  navigation,
  matchLoading,
  meLoading,
  me,
  refreshing,
  onRefresh,
  matches,
  unMatchLoading,
  addBlockUserLoading,
  MarkAsReadMatchFn,
  unMatch,
  blockedUser,
}) => {
  const isDarkMode = useTheme();

  if (matchLoading || meLoading || !me) {
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
        <Container>
          {matches && matches.length !== 0 && me ? (
            <Item>
              <UserContainer>
                <SwipeListView
                  useFlatList={false}
                  closeOnRowBeginSwipe={true}
                  data={matches}
                  previewOpenValue={1000}
                  renderItem={(data: any) => (
                    <TouchableBackRow key={data.index}>
                      <Touchable
                        disabled={unMatchLoading || addBlockUserLoading}
                        onPress={() => {
                          MarkAsReadMatchFn({
                            variables: { matchId: parseInt(data.item.id, 10) },
                          }),
                            navigation.navigate("Chat", {
                              chatId: data.item.id,
                              userId: me.user.uuid,
                              receiverId: data.item.isHost
                                ? data.item.guest.uuid
                                : data.item.host.uuid,
                              receiverAvatar: data.item.isHost
                                ? data.item.guest.appAvatarUrl
                                : data.item.host.appAvatarUrl,
                              receiverPushToken: data.item.isHost
                                ? data.item.guest.pushToken
                                : data.item.host.pushToken,
                              uuid: me.user.uuid,
                              userName: me.user.username,
                              userUrl: me.user.appAvatarUrl,
                              targetUuid: data.item.isHost
                                ? data.item.guest.uuid
                                : data.item.host.uuid,
                              isDarkMode: isDarkMode,
                              latitude: me.user.currentCity.latitude,
                              longitude: me.user.currentCity.longitude,
                            });
                        }}
                      >
                        <ItemRow match={data.item} type={"match"} />
                      </Touchable>
                    </TouchableBackRow>
                  )}
                  renderHiddenItem={(data: any) => (
                    <RowBack>
                      <BackLeftBtn
                        disabled={unMatchLoading}
                        onPress={() => unMatch(data.item.id)}
                      >
                        <IconContainer>
                          <SmallText>UN MATCH</SmallText>
                        </IconContainer>
                      </BackLeftBtn>
                      <BackLeftBtn
                        disabled={addBlockUserLoading}
                        onPress={() =>
                          blockedUser(data.item.host.uuid, data.item.id)
                        }
                      >
                        <IconContainer>
                          <SmallText>BLOCK USER</SmallText>
                        </IconContainer>
                      </BackLeftBtn>
                    </RowBack>
                  )}
                  leftOpenValue={91}
                  keyExtractor={(item: any) => item.id}
                />
              </UserContainer>
            </Item>
          ) : (
            <TextContainer>
              <Text>
                You don't have any matches. Please tab PIN to find someone.
              </Text>
            </TextContainer>
          )}
        </Container>
      </ScrollView>
    );
  }
};

export default withNavigation(MatchPresenter);
