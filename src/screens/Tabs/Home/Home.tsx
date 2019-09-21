import React from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import { GET_MATCHES } from "./HomeQueries";
import { GetMatches, Me } from "../../../types/api";
import { ME } from "../../../sharedQueries";
import { useIsLoggedIn } from "../../../context/AuthContext";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => {
  // const { loading, data } = useQuery<GetMatches>(GET_MATCHES);
  const isLoggedIn = useIsLoggedIn();
  console.log(isLoggedIn);
  const { loading, data } = useQuery<Me>(ME);
  const {
    me: { user }
  } = data;
  console.log(data);

  return (
    <View>{loading ? <Loader /> : <Text>{user && user.username}</Text>}</View>
  );
};
