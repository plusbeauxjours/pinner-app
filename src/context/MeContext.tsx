import React, { createContext, useContext } from "react";
import { useQuery } from "react-apollo-hooks";
import { Me } from "../types/api";
import { ME } from "../sharedQueries";

export const MeContext = createContext(null);

export const MeProvider = ({ children }) => {
  const { data, loading } = useQuery<Me>(ME);
  // const { data, loading,  } = useQuery<Me>(ME, { fetchPolicy: "no-cache" });
  // const { data, loading } = useQuery<Me>(ME, {fetchPolicy: "network-only"});
  const me = data ? data.me : null;
  console.log("on the meContext");
  console.log("me", me);
  return (
    <MeContext.Provider value={{ me, loading }}>{children}</MeContext.Provider>
  );
};
export const useMe = () => {
  const { me, loading } = useContext(MeContext);
  return { me, loading };
};
