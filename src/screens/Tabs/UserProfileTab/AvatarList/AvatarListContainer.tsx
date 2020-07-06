import React, { useState } from "react";
import { Platform, Alert } from "react-native";

import { withNavigation } from "react-navigation";
import { useQuery, useMutation } from "react-apollo-hooks";
import Toast from "react-native-root-toast";
import { useActionSheet } from "@expo/react-native-action-sheet";

import {
  Me,
  GetAvatars,
  GetAvatarsVariables,
  DeleteAvatar,
  DeleteAvatarVariables,
  MarkAsMain,
  MarkAsMainVariables,
  UserProfile,
  UserProfileVariables,
} from "../../../../types/api";

import { useMe } from "../../../../context/MeContext";
import { GET_AVATARS, DELETE_AVATAR, MARK_AS_MAIN } from "./AvatarListQueries";
import { GET_USER } from "../UserProfile/UserProfileQueries";
import { ME } from "../../../../sharedQueries";
import AvatarListPresenter from "./AvatarListPresenter";

const AvatarListContainer = ({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const { showActionSheetWithOptions } = useActionSheet();
  const uuid = navigation.getParam("uuid")
    ? navigation.getParam("uuid")
    : me.user.uuid;
  const isSelf = navigation.getParam("isSelf")
    ? navigation.getParam("isSelf")
    : me.user.uuid === navigation.getParam("uuid") ||
      !navigation.getParam("uuid");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<any>({});

  // MUTATION

  const [deleteAvatarFn, { loading: deleteAvatarLoading }] = useMutation<
    DeleteAvatar,
    DeleteAvatarVariables
  >(DELETE_AVATAR, {
    update(cache, { data: { deleteAvatar } }) {
      try {
        const data = cache.readQuery<GetAvatars, GetAvatarsVariables>({
          query: GET_AVATARS,
          variables: { uuid },
        });
        if (data) {
          data.getAvatars.avatars = data.getAvatars.avatars.filter(
            (i) => i.uuid !== deleteAvatar.uuid
          );
          cache.writeQuery({
            query: GET_AVATARS,
            variables: { uuid },
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  const [markAsMainFn, { loading: markAsMainLoading }] = useMutation<
    MarkAsMain,
    MarkAsMainVariables
  >(MARK_AS_MAIN, {
    update(cache, { data: { markAsMain } }) {
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid },
        });
        if (data) {
          data.userProfile.user.avatarUrl = markAsMain.avatar.thumbnail;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid },
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const data = cache.readQuery<Me>({
          query: ME,
        });
        if (data) {
          data.me.user.avatarUrl = markAsMain.avatar.thumbnail;
          cache.writeQuery({
            query: ME,
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const data = cache.readQuery<GetAvatars, GetAvatarsVariables>({
          query: GET_AVATARS,
          variables: { uuid },
        });
        if (data) {
          data.getAvatars.avatars.find(
            (i) => i.uuid === markAsMain.preAvatarUUID
          ).isMain = false;
          data.getAvatars.avatars.find(
            (i) => i.uuid === markAsMain.newAvatarUUID
          ).isMain = true;
          cache.writeQuery({
            query: GET_AVATARS,
            variables: { uuid },
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  // QUERY

  const {
    data: { getAvatars: { avatars = null } = {} } = {},
    loading: avatarLoading,
    refetch: avatarRefetch,
  } = useQuery<GetAvatars, GetAvatarsVariables>(GET_AVATARS, {
    variables: { uuid },
  });

  // FUNC

  const openModal = async (item: any) => {
    await setAvatar(item);
    await setModalOpen(true);
  };

  const closeModal = async () => {
    await setAvatar({});
    await setModalOpen(false);
  };

  const deleteAvatar = async (uuid: string) => {
    deleteAvatarFn({ variables: { uuid } });
    setModalOpen(false);
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await avatarRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  const onPress = () => {
    Platform.OS === "ios"
      ? showActionSheetWithOptions(
          {
            options: ["Change main photo", "Delete photo", "Cancel"],
            showSeparators: true,
            cancelButtonIndex: 2,
          },
          (buttonIndex) => {
            if (
              buttonIndex === 0 &&
              !deleteAvatarLoading &&
              !markAsMainLoading
            ) {
              markAsMainFn({ variables: { uuid: avatar.uuid } });
              setModalOpen(false);
              toast("Main photo changed");
            } else if (buttonIndex === 1) {
              onConfirmPress();
            } else {
              null;
            }
          }
        )
      : Alert.alert("Options", "Please tap an option.", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Change main photo",
            onPress: () => {
              !deleteAvatarLoading &&
                !markAsMainLoading &&
                markAsMainFn({ variables: { uuid: avatar.uuid } });
              setModalOpen(false);
              toast("Main photo changed");
            },
          },
          {
            text: "Delete photo",
            onPress: () => {
              onConfirmPress();
            },
          },
        ]);
  };

  const onConfirmPress = () => {
    Platform.OS === "ios"
      ? showActionSheetWithOptions(
          {
            options: ["Yes", "No"],
            destructiveButtonIndex: 0,
            showSeparators: true,
            cancelButtonIndex: 1,
          },
          (buttonIndex) => {
            if (
              buttonIndex === 0 &&
              !deleteAvatarLoading &&
              !markAsMainLoading
            ) {
              deleteAvatar(avatar.uuid);
              toast("Photo deleted");
            } else {
              null;
            }
          }
        )
      : Alert.alert(
          "Delete Photo",
          "Once you delete your photo, there is no going back. Please be certain to delete photo. Are you sure to delete this photo?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => {
                !deleteAvatarLoading &&
                  !markAsMainLoading &&
                  deleteAvatar(avatar.uuid);
                toast("Photo deleted");
              },
            },
          ]
        );
  };

  const toast = (message: string) => {
    Toast.show(message, {
      duration: 1000,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  return (
    <AvatarListPresenter
      avatarLoading={avatarLoading}
      meLoading={meLoading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      avatars={avatars}
      modalOpen={modalOpen}
      openModal={openModal}
      closeModal={closeModal}
      isSelf={isSelf}
      avatar={avatar}
      onPress={onPress}
    />
  );
};

export default withNavigation(AvatarListContainer);
