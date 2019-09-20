import React from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import { GET_MATCHES } from "./HomeQueries";
import { GetMatches, Me } from "../../../types/api";
import { ME } from "../../../sharedQueries";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => {
  const { loading, data } = useQuery<GetMatches>(GET_MATCHES);
  const { loading: meloading, data: medata } = useQuery<Me>(ME);
  console.log(loading, medata);
  return <View>{loading ? <Loader /> : null}</View>;
};
