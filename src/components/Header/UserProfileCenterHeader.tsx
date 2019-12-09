import React from "react";
import { withNavigation } from "react-navigation";
import { useMe } from "../../context/MeContext";
import PhotoLink from "../PhotoLink";

export default withNavigation(({ navigation }) => {
  const { me } = useMe();
  console.log(navigation);
  if (
    navigation.state.params &&
    navigation.state.params.uuid === me.user.profile.uuid &&
    navigation.state.routeName === "AvatarList"
  ) {
    return <PhotoLink />;
  } else {
    return null;
  }
});
