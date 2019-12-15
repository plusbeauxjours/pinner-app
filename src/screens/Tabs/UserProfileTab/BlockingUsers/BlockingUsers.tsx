import React, { useState } from "react";
import styled from "styled-components";
import { RefreshControl } from "react-native";
import { GetBlockedUser } from "../../../../types/api";
import { useQuery } from "react-apollo-hooks";
import { SwipeListView } from "react-native-swipe-list-view";
import { GET_BLOCkED_USER } from "./BlockingUsersQueries";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import { useMutation } from "react-apollo";
import { DELETE_BLOCK_USER } from "../../../../sharedQueries";
import {
  DeleteBlockUser,
  DeleteBlockUserVariables
} from "../../../../types/api";
const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  padding: 0 15px 0 15px;
`;
const TextContainer = styled.View`
  margin-top: 15px;
  justify-content: center;
  align-items: center;
`;
const Text = styled.Text`
  color: ${props => props.theme.color};
  font-size: 8px;
  margin-left: 5px;
`;
const TouchableRow = styled.TouchableOpacity`
  background-color: ${props => props.theme.bgColor};
`;
const TouchableBackRow = styled.View`
  background-color: ${props => props.theme.bgColor};
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
  background-color: ${props => props.theme.bgColor};
`;
const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
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

export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {
    data: { getBlockedUser: { blockedUsers = null } = {} } = {},
    loading,
    refetch
  } = useQuery<GetBlockedUser>(GET_BLOCkED_USER, { fetchPolicy: "no-cache" });
  const [deleteBlockUserFn, { loading: deleteBlockUserLoading }] = useMutation<
    DeleteBlockUser,
    DeleteBlockUserVariables
  >(DELETE_BLOCK_USER);
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
  if (loading) {
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
          {blockedUsers && blockedUsers.length !== 0 ? (
            <SwipeListView
              useFlatList={false}
              closeOnRowBeginSwipe={true}
              data={blockedUsers}
              previewOpenValue={1000}
              renderItem={data => (
                <TouchableBackRow key={data.item.id}>
                  {console.log("data.item", data.item)}
                  <TouchableRow
                    onPress={() =>
                      navigation.push("UserProfile", {
                        uuid: data.item.profile.uuid,
                        isSelf: data.item.profile.isSelf
                      })
                    }
                  >
                    <UserRow user={data.item} type={"user"} />
                  </TouchableRow>
                </TouchableBackRow>
              )}
              renderHiddenItem={data => (
                <RowBack>
                  <BackLeftBtn
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
              keyExtractor={item => item.id}
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
