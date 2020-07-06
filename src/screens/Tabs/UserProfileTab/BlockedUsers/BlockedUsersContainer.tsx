import React, { useState } from "react";

import { useMutation } from "react-apollo";
import { useQuery } from "react-apollo-hooks";

import {
  GetBlockedUser,
  UserProfile,
  UserProfileVariables,
  DeleteBlockUser,
  DeleteBlockUserVariables,
} from "../../../../types/api";
import { GET_BLOCkED_USER } from "./BlockedUsersQueries";
import { DELETE_BLOCK_USER } from "../../../../sharedQueries";
import { GET_USER } from "../UserProfile/UserProfileQueries";
import { useMe } from "../../../../context/MeContext";
import BlockedUsersPresenter from "./BlockedUsersPresenter";

export default ({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // MUTATION

  const [deleteBlockUserFn, { loading: deleteBlockUserLoading }] = useMutation<
    DeleteBlockUser,
    DeleteBlockUserVariables
  >(DELETE_BLOCK_USER, {
    update(cache, { data: { deleteBlockUser } }) {
      try {
        const blockedUserData = cache.readQuery<GetBlockedUser>({
          query: GET_BLOCkED_USER,
        });
        if (blockedUserData) {
          blockedUserData.getBlockedUser.blockedUsers = blockedUserData.getBlockedUser.blockedUsers.filter(
            (i) => i.uuid !== deleteBlockUser.uuid
          );
          cache.writeQuery({
            query: GET_BLOCkED_USER,
            data: blockedUserData,
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const userData = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid: me.user.uuid },
        });
        if (userData) {
          userData.userProfile.user.blockedUserCount =
            userData.userProfile.user.blockedUserCount - 1;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid: me.user.uuid },
            data: userData,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  // QUERY

  const {
    data: { getBlockedUser: { blockedUsers = null } = {} } = {},
    loading,
    refetch,
  } = useQuery<GetBlockedUser>(GET_BLOCkED_USER);

  // FUNC

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

  return (
    <BlockedUsersPresenter
      navigation={navigation}
      loading={loading}
      meLoading={meLoading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      blockedUsers={blockedUsers}
      deleteBlockUserLoading={deleteBlockUserLoading}
      deleteBlockUserFn={deleteBlockUserFn}
    />
  );
};
