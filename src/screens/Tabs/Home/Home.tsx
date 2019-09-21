import React, { useContext } from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import { GET_MATCHES } from "./HomeQueries";
import { GetMatches } from "../../../types/api";
import { useMe } from "../../../context/MeContext";
import { useLocation } from "../../../context/LocationContext";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => {
  const { loading, data } = useQuery<GetMatches>(GET_MATCHES);
  const me = useMe();
  const location = useLocation();
  console.log("useLocation::", location);
  console.log(me);

  return (
    <View>{loading ? <Loader /> : <Text>{me && me.user.username}</Text>}</View>
  );
};
