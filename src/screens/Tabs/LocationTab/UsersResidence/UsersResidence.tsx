import React, { useState } from "react";
import styled from "styled-components";
import { RefreshControl } from "react-native";
import {
  GetResidenceUsers,
  GetResidenceUsersVariables,
} from "../../../../types/api";
import { useQuery } from "react-apollo-hooks";
import { GET_RESIDENCE_USERS } from "./UsersResidenceQueries";
import Loader from "../../../../components/Loader";
import ItemRow from "../../../../components/ItemRow";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;
const Touchable = styled.TouchableOpacity``;
const ScrollView = styled.ScrollView`
  background-color: ${(props) => props.theme.bgColor};
`;
const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;

export default ({ navigation }) => {
  const countryCode = navigation.getParam("countryCode");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {
    data: { getResidenceUsers: { users = null } = {} } = {},
    loading,
    refetch,
  } = useQuery<GetResidenceUsers, GetResidenceUsersVariables>(
    GET_RESIDENCE_USERS,
    {
      variables: { countryCode },
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#999"}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View>
          {users &&
            users.length !== 0 &&
            users.map((user: any, index: any) => (
              <Touchable
                key={index}
                onPress={() =>
                  navigation.push("UserProfile", {
                    uuid: user.uuid,
                    isSelf: user.isSelf,
                  })
                }
              >
                <ItemRow user={user} type={"user"} />
              </Touchable>
            ))}
        </View>
      </ScrollView>
    );
  }
};
