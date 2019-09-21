import React, { useContext } from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import { GET_MATCHES } from "./HomeQueries";
import { GetMatches, Me } from "../../../types/api";
import { useMe } from "../../../context/MeContext";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => {
  const { loading, data } = useQuery<GetMatches>(GET_MATCHES);
  const me = useMe();
  console.log(me);

  return (
    <View>{loading ? <Loader /> : <Text>{me && me.user.username}</Text>}</View>
  );
};
