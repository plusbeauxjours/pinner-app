import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { Me } from "../types/api";
import { ME } from "../sharedQueries";

const LocationContext = createContext(null);

const LocationProvider = ({ children }) => {
  const { data } = useQuery<Me>(ME);
  const me = data ? data.me : null;
  return (
    <LocationContext.Provider value={{ me }}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext, LocationProvider };
