import React from "react";

import AuthNavigation from "../navigation/AuthNavigation";
import MainNavigation from "../navigation/MainNavigation";
import { useIsLoggedIn } from "../context/AuthContext";
import { MeProvider } from "../../src/context/MeContext";

export default () => {
  const isLoggedIn = useIsLoggedIn();

  return isLoggedIn ? (
    <MeProvider>
      <MainNavigation />
    </MeProvider>
  ) : (
    <AuthNavigation />
  );
};
