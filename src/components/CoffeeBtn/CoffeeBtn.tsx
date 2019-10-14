import React, { useState } from "react";
import { MATCH, UNMATCH } from "./CoffeeBtnQueries";
import {
  Match,
  MatchVariables,
  UnMatch,
  UnMatchVariables
} from "../../types/api";
import { useMutation } from "react-apollo";
import styled from "styled-components";
import { ActivityIndicator } from "react-native";
import { useMe } from "../../context/MeContext";
import { useLocation } from "../../context/LocationContext";

const Touchable = styled.TouchableOpacity`
  width: 100px;
  height: 45px;
`;

const Text = styled.Text`
  color: ${props => props.theme.color};
`;

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  border: 0.5px solid ${props => props.theme.borderColor};
  border-radius: 4px;
  width: 100px;
  height: 25px;
  align-items: center;
  justify-content: center;
`;

interface IProps {
  cityId?: string;
  coffeeId?: string;
  matchId?: string;
  isSelf: boolean;
  isMatching?: boolean;
}

const CoffeeBtn: React.FC<IProps> = ({
  cityId,
  coffeeId,
  matchId,
  isSelf,
  isMatching
}) => {
  const me = useMe();
  const location = useLocation();
  const [matchFn, { loading: matchLoading }] = useMutation<
    Match,
    MatchVariables
  >(MATCH, {
    variables: { coffeeId }
  });
  const [unMatchFn, { loading: unMatchLoading }] = useMutation<
    UnMatch,
    UnMatchVariables
  >(UNMATCH, {
    variables: { matchId }
  });
  const match = async coffeeId => {
    await matchFn(coffeeId);
  };
  const unmatch = async matchId => {
    await unMatchFn(matchId);
  };
  return (
    <>
      {isSelf ? null : (
        <>
          {!isSelf && isMatching ? (
            <Touchable disabled={unMatchLoading} onPress={unmatch}>
              <Container>
                {unMatchLoading ? (
                  <ActivityIndicator color={"#999"} />
                ) : (
                  <Text>UNMATCH</Text>
                )}
              </Container>
            </Touchable>
          ) : (
            <Touchable disabled={matchLoading} onPress={match}>
              <Container>
                {matchLoading ? (
                  <ActivityIndicator color={"#999"} />
                ) : (
                  <Text>JOIN</Text>
                )}
              </Container>
            </Touchable>
          )}
        </>
      )}
    </>
  );
};

export default CoffeeBtn;
