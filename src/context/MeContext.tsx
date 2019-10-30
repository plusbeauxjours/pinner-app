import React, { createContext, useContext } from "react";
import { useQuery } from "react-apollo-hooks";
import { Me } from "../types/api";
import { ME } from "../sharedQueries";

export const MeContext = createContext(null);

export const MeProvider = ({ children }) => {
  const { data } = useQuery<Me>(ME, { fetchPolicy: "no-cache" });
  const me = data ? data.me : null;
  return <MeContext.Provider value={{ me }}>{children}</MeContext.Provider>;
};

export const useMe = () => {
  const { me } = useContext(MeContext);
  return me;
};
