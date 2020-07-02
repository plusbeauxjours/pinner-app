import React from "react";
import { withNavigation } from "react-navigation";
import { useMe } from "../../context/MeContext";
import PhotoLink from "../PhotoLink";

export default withNavigation(({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  if (
    !meLoading &&
    navigation.state.params &&
    navigation.state.params.uuid === me.user.uuid &&
    navigation.state.routeName === "AvatarList"
  ) {
    return <PhotoLink />;
  } else {
    return null;
  }
});
