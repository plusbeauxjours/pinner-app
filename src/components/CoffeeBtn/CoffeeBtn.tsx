import React from "react";
import { MATCH, UNMATCH } from "./CoffeeBtnQueries";
import {
  Match,
  MatchVariables,
  UnMatch,
  UnMatchVariables,
  deleteCoffee,
  deleteCoffeeVariables
} from "../../types/api";
import { useMutation } from "react-apollo";
import styled from "styled-components";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-root-toast";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { DELETE_COFFEE } from "../../screens/CoffeeDetail/CoffeeDetailQueries";

const Touchable = styled.TouchableOpacity`
  justify-content: center;
  height: 45px;
`;

const Text = styled.Text`
  color: #999;
`;

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  border: 0.5px solid #999;
  border-radius: 4px;
  width: 150px;
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
  setModalOpen: any;
}

const CoffeeBtn: React.FC<IProps> = ({
  cityId,
  coffeeId,
  matchId,
  isSelf,
  isMatching,
  setModalOpen
}) => {
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
  const [deleteCoffeeFn, { loading: deleteCoffeeLoading }] = useMutation<
    deleteCoffee,
    deleteCoffeeVariables
  >(DELETE_COFFEE, { variables: { coffeeId } });

  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const match = async coffeeId => {
    await matchFn(coffeeId);
    setModalOpen(false);
    toast("Matched");
  };
  const { showActionSheetWithOptions } = useActionSheet();
  const unMatch = (matchId: string) => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: "Are you sure to unmatch?"
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          unMatchFn();
          setModalOpen(false);
          toast("unmatched");
        }
      }
    );
  };
  const deleteCoffee = () => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: "Are you sure to cancel?"
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          deleteCoffeeFn();
          setModalOpen(false);
          toast("canceld");
        }
      }
    );
  };
  return (
    <>
      {isSelf ? (
        <Touchable disabled={deleteCoffeeLoading} onPress={deleteCoffee}>
          <Container>
            {deleteCoffeeLoading ? (
              <ActivityIndicator color={"#999"} />
            ) : (
              <Text>CANCEL COFFEE</Text>
            )}
          </Container>
        </Touchable>
      ) : (
        <>
          {!isSelf && isMatching ? (
            <Touchable disabled={unMatchLoading} onPress={unMatch}>
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
