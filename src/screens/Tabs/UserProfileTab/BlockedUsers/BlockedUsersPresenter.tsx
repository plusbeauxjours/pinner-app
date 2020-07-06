import React from "react";
import { RefreshControl } from "react-native";

import styled from "styled-components";
import { SwipeListView } from "react-native-swipe-list-view";

import Loader from "../../../../components/Loader";
import ItemRow from "../../../../components/ItemRow";

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  padding: 0 15px 0 15px;
`;

const TextContainer = styled.View`
  margin-top: 15px;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  color: ${(props) => props.theme.color};
  font-size: 8px;
  margin-left: 5px;
`;

const TouchableRow = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.bgColor};
`;

const TouchableBackRow = styled.View`
  background-color: ${(props) => props.theme.bgColor};
`;

const SmallText = styled.Text`
  color: #999;
  text-align: center;
  font-size: 8px;
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

const ScrollView = styled.ScrollView`
  background-color: ${(props) => props.theme.bgColor};
`;

const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
  justify-content: center;
  align-items: center;
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

interface IProps {
  navigation: any;
  loading: boolean;
  meLoading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  blockedUsers: any;
  deleteBlockUserLoading: boolean;
  deleteBlockUserFn: any;
}

const BlockedUsersPresenter: React.FC<IProps> = ({
  navigation,
  loading,
  meLoading,
  refreshing,
  onRefresh,
  blockedUsers,
  deleteBlockUserLoading,
  deleteBlockUserFn,
}) => {
  if (loading || meLoading) {
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
          {blockedUsers && blockedUsers.length !== 0 ? (
            <SwipeListView
              useFlatList={false}
              closeOnRowBeginSwipe={true}
              data={blockedUsers}
              previewOpenValue={1000}
              renderItem={(data: any) => (
                <TouchableBackRow key={data.item.id}>
                  <TouchableRow
                    onPress={() =>
                      navigation.push("UserProfile", {
                        uuid: data.item.uuid,
                        isSelf: data.item.isSelf,
                      })
                    }
                  >
                    <ItemRow user={data.item} type={"user"} />
                  </TouchableRow>
                </TouchableBackRow>
              )}
              renderHiddenItem={(data) => (
                <RowBack>
                  <BackLeftBtn
                    disabled={deleteBlockUserLoading}
                    onPress={() =>
                      deleteBlockUserFn({ variables: { uuid: data.item.uuid } })
                    }
                  >
                    <IconContainer>
                      <SmallText>UN BLOCK</SmallText>
                    </IconContainer>
                  </BackLeftBtn>
                </RowBack>
              )}
              leftOpenValue={45}
              keyExtractor={(item: any) => item.id}
            />
          ) : (
            <TextContainer>
              <Text>No blocked user yet...</Text>
            </TextContainer>
          )}
        </Container>
      </ScrollView>
    );
  }
};

export default BlockedUsersPresenter;
